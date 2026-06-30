// =====================================================
// CartContext — shared cart state cho toàn bộ (shop) routes
// - Header badge đồng bộ với PDP/Checkout/Cart page
// - Source of truth: backend CartController (X-User-Id qua gateway)
// - SSR-safe: render initial = empty, fetch ở useEffect mount
// - Sync-up: localStorage → backend lần đầu mount khi có token
// - Interface useCart() giữ nguyên shape để không phá 5 nơi dùng
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
  addCartItem,
  fetchCart,
  removeCartItem,
  updateCartItem,
  clearCart as backendClearCart,
} from '@/features/cart';
import type { Cart as BackendCart, CartItem as BackendCartItem } from '@/features/cart';
import { syncLocalCartToBackend } from './cart-migration';
import { getAccessToken } from '@/lib/api/client';
import toast from 'react-hot-toast';
import type { ProductSummary } from '@/types/shop/catalog';

// FE-friendly CartItem shape (giữ nguyên để không phá PDP/CartItemRow)
export interface CartItem {
  id: string;          // item UUID from backend
  medicineId: string;  // productId (UUID) from backend
  sku: string;
  name: string;
  slug: string;
  categorySlug?: string;
  subcategorySlug?: string;
  price: number;
  thumbnail: string;
  unit: string;
  qty: number;
  prescriptionRequired: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CartState {
  items: CartItem[];
  voucherCode?: string;
  voucherDiscount?: number;
  updatedAt: number;
}

function fromBackend(b: BackendCart): CartItem[] {
  return b.items.map((it: BackendCartItem): CartItem => ({
    id: it.id,
    medicineId: it.medicineId,
    sku: '',
    name: it.medicineName,
    slug: '',
    price: it.unitPrice,
    thumbnail: it.imageUrl ?? '',
    unit: '',
    qty: it.qty,
    prescriptionRequired: false,
    stockStatus: 'in_stock',
  }));
}

function calcSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

function calcItemCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.qty, 0);
}

interface CartContextValue {
  cart: CartState;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: ProductSummary, qty?: number) => Promise<void>;
  updateItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  applyVoucher: (code: string, discount: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [voucherCode, setVoucherCode] = useState<string | undefined>();
  const [voucherDiscount, setVoucherDiscount] = useState<number | undefined>();
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const cart = await fetchCart();
    setItems(fromBackend(cart));
    setVoucherCode(cart.voucherCode);
    setHydrated(true);
  }, []);

  // Mount: sync-up nếu có token + có cart local, sau đó fetch từ server
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hasToken = !!getAccessToken();
        if (hasToken) {
          const result = await syncLocalCartToBackend(() => !!getAccessToken());
          if (!cancelled && result.synced > 0) {
            toast.success(`Đã đồng bộ ${result.synced} sản phẩm lên máy chủ`);
          } else if (!cancelled && result.failed > 0) {
            toast.error(`Không đồng bộ được ${result.failed} sản phẩm`);
          }
        }
        if (!cancelled) await refresh();
      } catch {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const addItem = useCallback(
    async (product: ProductSummary, qty = 1) => {
      try {
        const cart = await addCartItem({
          medicineId: product.id,
          qty,
        });
        setItems(fromBackend(cart));
      } catch {
        toast.error('Không thể thêm vào giỏ hàng');
      }
    },
    []
  );

  const updateItem = useCallback(
    async (productId: string, qty: number) => {
      const target = items.find((it) => it.medicineId === productId);
      if (!target) return;
      try {
        if (qty <= 0) {
          const cart = await removeCartItem(target.id);
          setItems(fromBackend(cart));
        } else {
          const cart = await updateCartItem(target.id, { qty });
          setItems(fromBackend(cart));
        }
      } catch {
        toast.error('Không thể cập nhật số lượng');
      }
    },
    [items]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const target = items.find((it) => it.medicineId === productId);
      if (!target) return;
      try {
        const cart = await removeCartItem(target.id);
        setItems(fromBackend(cart));
      } catch {
        toast.error('Không thể xoá sản phẩm');
      }
    },
    [items]
  );

  const clear = useCallback(async () => {
    try {
      const cart = await backendClearCart();
      setItems(fromBackend(cart));
      setVoucherCode(undefined);
      setVoucherDiscount(undefined);
    } catch {
      toast.error('Không thể xoá giỏ hàng');
    }
  }, []);

  const applyVoucher = useCallback(
    (code: string, discount: number) => {
      // Local UI state — backend sẽ validate qua POST /vouchers/apply khi cần
      setVoucherCode(code);
      setVoucherDiscount(discount);
    },
    []
  );

  const cart: CartState = useMemo(
    () => ({ items, voucherCode, voucherDiscount, updatedAt: 0 }),
    [items, voucherCode, voucherDiscount]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items,
      itemCount: calcItemCount(items),
      subtotal: calcSubtotal(items),
      hydrated,
      addItem,
      updateItem,
      removeItem,
      clear,
      applyVoucher,
    }),
    [cart, items, hydrated, addItem, updateItem, removeItem, clear, applyVoucher]
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
