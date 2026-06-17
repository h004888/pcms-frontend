// =====================================================
// B2C format utilities — VND, dates, prescription badges, URL helpers
// Pure functions, no React
// =====================================================
import type { ProductSummary } from '@/types/shop/catalog';

const VND_FORMATTER = new Intl.NumberFormat('vi-VN');

export function formatVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return VND_FORMATTER.format(amount) + ' ₫';
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatVND(min)} — ${formatVND(max)}`;
}

export function calculateDiscount(original: number, current: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function getStockLabel(status: 'in_stock' | 'low_stock' | 'out_of_stock'): {
  text: string;
  color: 'accent' | 'warning' | 'danger';
} {
  switch (status) {
    case 'in_stock':
      return { text: 'Còn hàng', color: 'accent' };
    case 'low_stock':
      return { text: 'Sắp hết', color: 'warning' };
    case 'out_of_stock':
      return { text: 'Hết hàng', color: 'danger' };
  }
}

export function getPrescriptionLabel(required: boolean): {
  text: string;
  color: 'warning' | 'info';
} {
  return required
    ? { text: '⚕️ Thuốc kê đơn', color: 'warning' }
    : { text: 'Không kê đơn', color: 'info' };
}

// =====================================================
// URL helpers — build route theo main plan:
// /customer/{L1}                    — SHOP-CAT-1
// /customer/{L1}/{L2}               — SHOP-CAT-2
// /customer/{L1}/{L2}/{slug}        — SHOP-PDP (có L2)
// /customer/{L1}/{slug}             — SHOP-PDP (không có L2)
// B2C e-commerce nằm trong folder thật `customer/`
// (không dùng route group `(shop)` vì conflict với
//  `(dashboard)` routes trùng path /orders, /search, /prescriptions).
// =====================================================

const BASE = '/customer';

/**
 * Build URL PDP theo main plan structure.
 * Nếu product có categorySlug = subcategorySlug (trùng L1), bỏ segment L2.
 * Nếu product thuộc L2, giữ nguyên /{L1}/{L2}/{slug}.
 * Accept subset of ProductSummary (CartItem cũng dùng được).
 */
export function getProductHref(product: {
  slug: string;
  categorySlug?: string;
  subcategorySlug?: string;
}): string {
  const { slug, categorySlug, subcategorySlug } = product;
  if (!categorySlug) return `${BASE}/${slug}`;
  if (subcategorySlug && subcategorySlug !== categorySlug) {
    return `${BASE}/${categorySlug}/${subcategorySlug}/${slug}`;
  }
  return `${BASE}/${categorySlug}/${slug}`;
}

/** Build URL CAT-1 (L1). */
export function getCategoryL1Href(slug: string): string {
  return `${BASE}/${slug}`;
}

/** Build URL CAT-2 (L1/L2). */
export function getCategoryL2Href(l1Slug: string, l2Slug: string): string {
  return `${BASE}/${l1Slug}/${l2Slug}`;
}
