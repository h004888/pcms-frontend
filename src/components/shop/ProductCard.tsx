// =====================================================
// ProductCard — Product card for grid + carousel
// Variants: default (with all info) | compact (smaller, for carousels)
// =====================================================

import Link from 'next/link';
import Image from 'next/image';
import { Star, AlertTriangle, Heart, ShoppingCart } from 'lucide-react';
import { formatVND, getStockLabel, getProductHref } from '@/lib/shop/format';
import type { ProductSummary } from '@/types/shop/catalog';

export interface ProductCardProps {
  product: ProductSummary;
  variant?: 'default' | 'compact';
  showCTA?: boolean;
}

export function ProductCard({ product, variant = 'default', showCTA = true }: ProductCardProps) {
  const stock = getStockLabel(product.stockStatus);
  const compact = variant === 'compact';
  const href = getProductHref(product);

  return (
    <article
      className="group relative flex flex-col bg-white border border-ink-200 rounded-md overflow-hidden hover:border-accent-500 transition-colors"
    >
      {/* Thumbnail */}
      <Link
        href={href}
        className="block aspect-square bg-ink-50 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        aria-label={`Xem chi tiết ${product.name}`}
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Tags overlay */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={
                  tag === 'Bán chạy'
                    ? 'px-2 h-5 bg-accent-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center'
                    : tag === 'Mới'
                      ? 'px-2 h-5 bg-info-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center'
                      : 'px-2 h-5 bg-warning-500 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center'
                }
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Discount badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 right-2">
            <span className="px-2 h-6 bg-danger-600 text-white text-xs font-bold rounded flex items-center">
              -{product.discountPercent}%
            </span>
          </div>
        )}
        {/* Prescription overlay (warning) */}
        {product.prescriptionRequired && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-warning-50 border border-warning-200 rounded text-[10px] font-medium text-warning-800">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span>Thuốc kê đơn — cần đơn từ BS</span>
            </div>
          </div>
        )}
        {/* Quick action buttons (always visible on hover) */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Yêu thích"
            className="w-8 h-8 bg-white border border-ink-200 rounded-full flex items-center justify-center text-ink-600 hover:text-accent-600 hover:border-accent-500 transition-colors"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        {/* Brand + country */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] text-ink-500 uppercase tracking-wider font-semibold truncate">
            {product.brand}
          </span>
          <span className="text-[10px] text-ink-400">·</span>
          <span className="text-[10px] text-ink-500">{product.country}</span>
        </div>

        {/* Name */}
        <h3 className={`font-semibold text-ink-900 leading-snug line-clamp-2 mb-2 ${compact ? 'text-sm' : 'text-sm'}`}>
          <Link
            href={href}
            className="hover:text-accent-700 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        {product.rating && product.reviewCount && (
          <div className="flex items-center gap-1 mb-2 text-xs">
            <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" aria-hidden="true" />
            <span className="font-mono font-semibold text-ink-900">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-ink-400">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`font-bold text-accent-700 font-mono ${compact ? 'text-base' : 'text-lg'}`}>
              {formatVND(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-ink-400 line-through font-mono">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="text-[10px] text-ink-500 mt-0.5">/ {product.unit}</div>
        </div>

        {/* Stock */}
        <div className="mt-2 flex items-center gap-1 text-[11px]">
          <span
            className={
              stock.color === 'accent'
                ? 'w-1.5 h-1.5 rounded-full bg-accent-600'
                : stock.color === 'warning'
                  ? 'w-1.5 h-1.5 rounded-full bg-warning-500'
                  : 'w-1.5 h-1.5 rounded-full bg-danger-500'
            }
            aria-hidden="true"
          />
          <span
            className={
              stock.color === 'accent'
                ? 'text-accent-700 font-medium'
                : stock.color === 'warning'
                  ? 'text-warning-700 font-medium'
                  : 'text-danger-600 font-medium'
            }
          >
            {stock.text}
          </span>
        </div>

        {/* CTA */}
        {showCTA && (
          <button
            type="button"
            disabled={product.stockStatus === 'out_of_stock'}
            className="mt-3 inline-flex items-center justify-center gap-1.5 w-full h-9 bg-ink-900 text-white text-xs font-semibold rounded hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
            {product.prescriptionRequired ? 'Đặt theo toa' : 'Thêm giỏ'}
          </button>
        )}
      </div>
    </article>
  );
}
