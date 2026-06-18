// =====================================================
// Shared helper: ProductDetail → ProductSummary
// Tách ra để orders.ts và catalog.ts cùng dùng
// =====================================================

import type { ProductDetail, ProductSummary } from '@/types/shop/catalog';
import { CATEGORIES } from '@/data/shop/catalog';

export function stripToSummary(p: ProductDetail): ProductSummary {
  const directCat = CATEGORIES.find((c) => c.id === p.category.id || c.slug === p.category.slug);
  const parentCat = CATEGORIES.find((c) =>
    c.children?.some((ch) => ch.id === p.category.id || ch.slug === p.category.slug)
  );
  const isL2 = Boolean(parentCat);
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    unit: p.unit,
    thumbnail: p.thumbnail,
    country: p.country,
    brand: p.brand,
    prescriptionRequired: p.prescriptionRequired,
    stockStatus: p.stockStatus,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags,
    categorySlug: isL2 ? parentCat!.slug : directCat?.slug,
    subcategorySlug: p.category.slug,
  };
}
