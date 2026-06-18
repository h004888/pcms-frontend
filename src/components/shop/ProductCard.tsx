// =====================================================
// ProductCard — Product card for grid + carousel (vivid edition)
// Variants: default (with all info) | compact (smaller, for carousels)
// Upgrades:
//   - Image-forward: bigger image, subtle gradient background
//   - Hover: lift effect (transform + shadow on card)
//   - Discount badge: vivid gradient red ribbon (vẫn tuân thủ palette)
//   - Featured variant (rank #1) dùng accent border + ribbon
// =====================================================

import Link from 'next/link';
import Image from 'next/image';
import { Star, AlertTriangle, Heart, ShoppingCart, Zap } from 'lucide-react';
import { formatVND, getStockLabel, getProductHref } from '@/lib/shop/format';
import type { ProductSummary } from '@/types/shop/catalog';

export interface ProductCardProps {
  product: ProductSummary;
  variant?: 'default' | 'compact' | 'featured';
  showCTA?: boolean;
  rank?: number;
}

export function ProductCard({ product, variant = 'default', showCTA = true, rank }: ProductCardProps) {
  const stock = getStockLabel(product.stockStatus);
  const compact = variant === 'compact';
  const featured = variant === 'featured';
  const href = getProductHref(product);

  return (
    <article
      className={`group relative flex flex-col bg-white border ${featured ? 'border-accent-400 ring-2 ring-accent-200' : 'border-ink-200'} rounded-lg overflow-hidden hover:border-accent-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink-900/10 transition-all duration-200`}
    >
      {/* Thumbnail */}
      <Link
        href={href}
        className="block aspect-square bg-gradient-to-br from-ink-50 to-accent-50/40 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        aria-label={`Xem chi tiết ${product.name}`}
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Featured ribbon */}
        {featured && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 h-7 bg-accent-600 text-white text-xs font-bold rounded-md shadow-sm">
            <Zap className="w-3 h-3 fill-current" aria-hidden="true" />
            HOT
          </div>
        )}
        {/* Rank badge (cho bestseller grid) */}
        {!featured && rank && rank <= 5 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-ink-900 text-white text-xs font-bold rounded-md font-mono shadow-sm">
              #{rank}
            </span>
          </div>
        )}
        {/* Tags overlay */}
        {product.tags && product.tags.length > 0 && !rank && !featured && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={
                  tag === 'Bán chạy'
                    ? 'px-2 h-6 bg-accent-600 text-white text-xs font-semibold rounded flex items-center'
                    : tag === 'Mới'
                      ? 'px-2 h-6 bg-info-600 text-white text-xs font-semibold rounded flex items-center'
                      : 'px-2 h-6 bg-warning-500 text-white text-xs font-semibold rounded flex items-center'
                }
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Discount badge — vivid gradient ribbon */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2.5 h-7 bg-gradient-to-br from-danger-500 to-danger-700 text-white text-xs font-bold rounded-md flex items-center shadow-sm">
              -{product.discountPercent}%
            </span>
          </div>
        )}
        {/* Prescription overlay (warning) */}
        {product.prescriptionRequired && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-warning-50 border border-warning-300 rounded text-xs font-medium text-warning-800">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span>Thuốc kê đơn — cần đơn từ BS</span>
            </div>
          </div>
        )}
        {/* Quick action button (wishlist) */}
        <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Yêu thích"
            className="w-8 h-8 bg-white border border-ink-200 rounded-full flex items-center justify-center text-ink-600 hover:text-danger-600 hover:border-danger-500 transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        {/* Brand + country */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs text-ink-500 font-medium truncate">
            {product.brand}
          </span>
          <span className="text-xs text-ink-400">·</span>
          <span className="text-xs text-ink-500">{product.country}</span>
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
          <div className="text-xs text-ink-500 mt-0.5">/ {product.unit}</div>
        </div>

        {/* Stock */}
        <div className="mt-2 flex items-center gap-1 text-xs">
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
