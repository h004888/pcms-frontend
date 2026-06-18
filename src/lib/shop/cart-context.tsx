// =====================================================
// CartContext — shared cart state cho toàn bộ (shop) routes
// - Header badge đồng bộ với PDP/Checkout/Cart page
// - Persist localStorage tự động
// - SSR-safe: render initial = empty, hydrate ở useEffect
// =====================================================

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  addToCart as addToCartFn,
  applyVoucher as applyVoucherFn,
  cartItemCount,
  cartSubtotal,
  clearCart as clearCartFn,
  loadCart,
  removeFromCart as removeFromCartFn,
  saveCart,
  updateQty as updateQtyFn,
  type CartItem,
  type CartState,
} from '@/lib/shop/cart';
import type { ProductSummary } from '@/types/shop/catalog';

interface CartContextValue {
  cart: CartState;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: ProductSummary, qty?: number) => void;
  updateItem: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  applyVoucher: (code: string, discount: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [], updatedAt: 0 });
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client-only)
  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  // Persist khi cart thay đổi (chỉ sau khi đã hydrate)
  useEffect(() => {
    if (hydrated) saveCart(cart);
  }, [cart, hydrated]);

  // Cross-tab sync: đồng bộ khi tab khác cập nhật cart
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'pcms-cart' && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue) as CartState);
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback(
    (product: ProductSummary, qty = 1) => setCart((c) => addToCartFn(c, product, qty)),
    []
  );
  const updateItem = useCallback(
    (productId: string, qty: number) => setCart((c) => updateQtyFn(c, productId, qty)),
    []
  );
  const removeItem = useCallback(
    (productId: string) => setCart((c) => removeFromCartFn(c, productId)),
    []
  );
  const clear = useCallback(() => setCart(clearCartFn()), []);
  const applyVoucherCode = useCallback(
    (code: string, discount: number) => setCart((c) => applyVoucherFn(c, code, discount)),
    []
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart.items,
      itemCount: cartItemCount(cart.items),
      subtotal: cartSubtotal(cart.items),
      hydrated,
      addItem,
      updateItem,
      removeItem,
      clear,
      applyVoucher: applyVoucherCode,
    }),
    [cart, hydrated, addItem, updateItem, removeItem, clear, applyVoucherCode]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within <CartProvider>');
  }
  return ctx;
}
