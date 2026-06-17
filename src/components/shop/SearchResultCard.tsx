// =====================================================
// SearchResultCard — Card kết quả tìm kiếm (horizontal)
// =====================================================

import Link from 'next/link';
import Image from 'next/image';
import type { ProductSummary } from '@/types/shop/catalog';
import { formatVND, getProductHref } from '@/lib/shop/format';

interface Props {
  product: ProductSummary;
}

export function SearchResultCard({ product }: Props) {
  const href = getProductHref(product);
  return (
    <Link
      href={href}
      className="flex gap-4 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <div className="relative w-24 h-24 bg-ink-50 rounded-md flex-shrink-0 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="96px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-500">
          {product.brand} · {product.country}
        </p>
        <h3 className="mt-1 text-sm font-medium text-ink-900 line-clamp-2 text-balance">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-accent-700 font-mono">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-ink-400 line-through font-mono">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-ink-500">/ {product.unit}</p>
      </div>
    </Link>
  );
}
