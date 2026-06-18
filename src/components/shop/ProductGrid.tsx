// =====================================================
// ProductGrid — responsive grid wrapper for ProductCard
// Auto-fit grid: 1 col mobile, 2 tablet, 3-4 desktop
// Handles loading skeleton + empty state
// =====================================================

import { ProductCard } from './ProductCard';
import type { ProductSummary } from '@/types/shop/catalog';

export interface ProductGridProps {
  products: ProductSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const SKELETON_COUNT = 8;

export function ProductGrid({ products, isLoading, emptyMessage }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-ink-200 rounded-md">
        <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
        <p className="text-base font-semibold text-ink-900">
          {emptyMessage ?? 'Không tìm thấy sản phẩm'}
        </p>
        <p className="text-sm text-ink-500 mt-1">
          Hãy thử bỏ bớt bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-ink-200 rounded-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-ink-100" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-ink-100 rounded w-1/2" />
        <div className="h-3 bg-ink-100 rounded w-full" />
        <div className="h-3 bg-ink-100 rounded w-3/4" />
        <div className="h-5 bg-ink-100 rounded w-2/3 mt-2" />
        <div className="h-7 bg-ink-100 rounded w-full mt-2" />
      </div>
    </div>
  );
}
