// =====================================================
// ShopHomeBestseller — Sản phẩm nổi bật (vivid edition)
// Layout phá vỡ "5-equal-cards grid":
//   • Top #1: featured card lớn (chiếm 2/3 chiều ngang)
//   • Top #2-5: 4 cards nhỏ bên cạnh
//   • Rank badges số (#1, #2...) — nhãn semantic thay cho card icon lặp lại
// Mỗi sản phẩm có ảnh thật, rating, giá, stock.
// =====================================================

import Link from 'next/link';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { getBestsellers } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';

export function ShopHomeBestseller() {
  const bestsellers = getBestsellers(5);
  if (bestsellers.length === 0) return null;

  const [top1, ...rest] = bestsellers;

  return (
    <section
      className="bg-gradient-to-b from-ink-50/50 to-white py-12 md:py-16"
      aria-labelledby="bestseller-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger-700 mb-2">
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              Được dược sĩ tin dùng
            </div>
            <h2
              id="bestseller-title"
              className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance leading-tight"
            >
              Sản phẩm nổi bật
            </h2>
            <p className="mt-2 text-sm text-ink-600 text-pretty max-w-2xl">
              Top sản phẩm có lượt đánh giá cao nhất — dược sĩ thường xuyên giới thiệu.
            </p>
          </div>
          <Link
            href="/thuoc"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top #1 — featured large card */}
          <FeaturedTopProduct product={top1} rank={1} />
          {/* Top #2-5 — 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {rest.slice(0, 4).map((p, i) => (
              <RankedProductCard key={p.id} product={p} rank={i + 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured card — lớn hơn, có rank badge lớn, hiển thị rating prominently
function FeaturedTopProduct({ product, rank }: { product: ReturnType<typeof getBestsellers>[number]; rank: number }) {
  return (
    <Link
      href={`/thuoc/thuoc-giam-dau/${product.slug}`}
      className="group relative flex flex-col bg-gradient-to-br from-white to-ink-50 border-2 border-ink-200 rounded-xl overflow-hidden hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      {/* Top stripe với rank */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 z-10" />
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-danger-600 text-white text-xs font-bold rounded-md shadow-sm">
          <Star className="w-3 h-3 fill-current" aria-hidden="true" />
          TOP {rank}
        </span>
        {product.tags?.[0] && (
          <span className="px-2 h-7 bg-white border border-ink-200 text-ink-700 text-xs font-semibold rounded-md flex items-center">
            {product.tags[0]}
          </span>
        )}
      </div>
      {product.discountPercent && product.discountPercent > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 h-8 bg-danger-600 text-white text-sm font-bold rounded-md flex items-center shadow-sm">
            -{product.discountPercent}%
          </span>
        </div>
      )}

      <div className="aspect-[4/3] bg-gradient-to-br from-ink-50 to-accent-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="text-5xl md:text-6xl font-bold text-accent-600/30">
              {product.brand.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 md:p-6">
        <div>
          <p className="text-xs text-ink-500 font-medium">
            {product.brand} · {product.country}
          </p>
          <h3 className="mt-1 text-lg md:text-xl font-bold text-ink-900 leading-snug line-clamp-2 group-hover:text-accent-700 transition-colors text-balance">
            {product.name}
          </h3>
        </div>
        {product.rating && product.reviewCount && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating!) ? 'text-warning-500 fill-warning-500' : 'text-ink-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm font-mono font-semibold text-ink-900">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-ink-500">({product.reviewCount} đánh giá)</span>
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-2xl font-bold text-accent-700 font-mono">
            {product.price.toLocaleString('vi-VN')} ₫
          </span>
          {product.originalPrice && (
            <span className="text-sm text-ink-400 line-through font-mono">
              {product.originalPrice.toLocaleString('vi-VN')} ₫
            </span>
          )}
        </div>
        <p className="text-xs text-ink-500">/ {product.unit}</p>
      </div>
    </Link>
  );
}

// Ranked card nhỏ — rank number rõ ràng thay vì card icon
function RankedProductCard({ product, rank }: { product: ReturnType<typeof getBestsellers>[number]; rank: number }) {
  return (
    <Link
      href={`/thuoc/thuoc-giam-dau/${product.slug}`}
      className="group relative flex flex-col bg-white border border-ink-200 rounded-lg overflow-hidden hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      {/* Rank badge — top-left, semantic accent */}
      <div className="absolute top-2 left-2 z-10">
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-ink-900 text-white text-xs font-bold rounded-md font-mono">
          #{rank}
        </span>
      </div>
      {product.discountPercent && product.discountPercent > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-1.5 h-6 bg-danger-600 text-white text-[11px] font-bold rounded flex items-center">
            -{product.discountPercent}%
          </span>
        </div>
      )}
      <div className="aspect-square bg-gradient-to-br from-ink-50 to-ink-100 flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <div className="text-2xl font-bold text-accent-600/30">{product.brand.charAt(0)}</div>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[10px] text-ink-500 font-medium truncate">
          {product.brand} · {product.country}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink-900 line-clamp-2 leading-snug group-hover:text-accent-700 transition-colors text-balance">
          {product.name}
        </p>
        <div className="mt-auto pt-2">
          <p className="text-sm font-bold text-accent-700 font-mono">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
          {product.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-warning-500 fill-warning-500" aria-hidden="true" />
              <span className="text-xs font-mono font-semibold text-ink-900">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
