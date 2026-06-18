// =====================================================
// Cart state — types + pure helpers
// Persist vào localStorage với key 'pcms-cart'
// UI state dùng context (xem cart-context.tsx)
// =====================================================

import type { ProductSummary } from '@/types/shop/catalog';

const STORAGE_KEY = 'pcms-cart';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  /** Subcategory slug (L2 nếu có) — dùng để build PDP URL */
  subcategorySlug?: string;
  /** Category slug (L1) — dùng để build PDP URL */
  categorySlug?: string;
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

const EMPTY_STATE: CartState = { items: [], updatedAt: 0 };

// =====================================================
// Persistence (localStorage) — SSR-safe
// =====================================================

export function loadCart(): CartState {
  if (typeof window === 'undefined') return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as CartState;
    // Defensive: đảm bảo shape đúng
    if (!Array.isArray(parsed.items)) return EMPTY_STATE;
    return parsed;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveCart(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full / disabled — silently fail
  }
}

// =====================================================
// Pure helpers (state in, state out)
// =====================================================

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.qty, 0);
}

export function addToCart(cart: CartState, product: ProductSummary, qty = 1): CartState {
  const existing = cart.items.find((it) => it.productId === product.id);
  const items = existing
    ? cart.items.map((it) =>
        it.productId === product.id ? { ...it, qty: it.qty + qty } : it
      )
    : [
        ...cart.items,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          categorySlug: product.categorySlug,
          subcategorySlug: product.subcategorySlug,
          price: product.price,
          thumbnail: product.thumbnail,
          unit: product.unit,
          qty,
          prescriptionRequired: product.prescriptionRequired,
          stockStatus: product.stockStatus,
        },
      ];
  return { ...cart, items, updatedAt: Date.now() };
}

export function updateQty(cart: CartState, productId: string, qty: number): CartState {
  if (qty <= 0) return removeFromCart(cart, productId);
  return {
    ...cart,
    items: cart.items.map((it) => (it.productId === productId ? { ...it, qty } : it)),
    updatedAt: Date.now(),
  };
}

export function removeFromCart(cart: CartState, productId: string): CartState {
  return {
    ...cart,
    items: cart.items.filter((it) => it.productId !== productId),
    updatedAt: Date.now(),
  };
}

export function clearCart(): CartState {
  return { items: [], updatedAt: Date.now() };
}

export function applyVoucher(cart: CartState, code: string, discount: number): CartState {
  return { ...cart, voucherCode: code, voucherDiscount: discount, updatedAt: Date.now() };
}
