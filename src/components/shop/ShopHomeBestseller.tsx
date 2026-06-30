// =====================================================
// ShopHomeBestseller — Sản phẩm nổi bật (2-col layout)
// API: GET /shop/home → bestsellers[]
// =====================================================

import Link from 'next/link';
import { ArrowRight, Pill, Star } from 'lucide-react';
import { getHomePage } from '@/features/shop';
import type { ProductSummary } from '@/types/shop/catalog';

export const revalidate = 300;

function toProductSummary(b: {
  id: string; slug: string; name: string; price: number;
  oldPrice?: number; imageUrl?: string;
}): ProductSummary {
  const hasDiscount = b.oldPrice && b.oldPrice > b.price;
  return {
    id: b.id, sku: b.id, name: b.name, slug: b.slug,
    price: b.price, originalPrice: b.oldPrice,
    discountPercent: hasDiscount ? Math.round(((b.oldPrice! - b.price) / b.oldPrice!) * 100) : undefined,
    unit: 'Hộp', thumbnail: b.imageUrl ?? '/placeholder-products/product.svg',
    country: 'Việt Nam', brand: b.name.split(' ')[0] ?? '',
    prescriptionRequired: false, stockStatus: 'in_stock',
    rating: undefined, reviewCount: undefined, tags: hasDiscount ? ['Bán chạy'] : undefined,
  };
}

export async function ShopHomeBestseller() {
  let bestsellers: ProductSummary[] = [];
  try {
    const raw = await getHomePage();
    bestsellers = raw.slice(0, 5).map(toProductSummary);
  } catch { return null; }
  if (bestsellers.length === 0) return null;

  const [top1, ...rest] = bestsellers;

  return (
    <section className="bg-white" aria-labelledby="bestseller-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="bestseller-title" className="text-lg font-bold text-ink-900">Sản phẩm nổi bật</h2>
            <p className="text-sm text-ink-500 mt-0.5">Top sản phẩm được dược sĩ tin dùng</p>
          </div>
          <Link href="/thuoc"
            className="text-xs font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <FeaturedTopProduct product={top1} />
          <div className="grid grid-cols-2 gap-3">
            {rest.slice(0, 4).map((p) => (
              <RankedProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedTopProduct({ product }: { product: ProductSummary }) {
  const discount = product.discountPercent ?? 0;
  return (
    <Link href={`/${product.slug}`}
      className="group relative flex flex-col bg-white border border-ink-200 rounded-lg overflow-hidden hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <div className="aspect-[4/3] bg-ink-50 flex items-center justify-center">
        <Pill className="w-16 h-16 text-ink-300 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
      </div>
      {discount > 0 && (
        <div className="absolute top-3 right-3 px-2 h-6 bg-danger-600 text-white text-xs font-bold rounded flex items-center">
          -{discount}%
        </div>
      )}
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-ink-900 line-clamp-2 group-hover:text-accent-700 transition-colors text-balance leading-snug">
          {product.name}
        </h3>
        {product.rating !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" aria-hidden="true" />
            <span className="text-xs font-medium text-ink-900">{product.rating!.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-lg font-bold text-accent-700 font-mono">{product.price.toLocaleString('vi-VN')} ₫</span>
          {product.originalPrice !== undefined && (
            <span className="text-xs text-ink-400 line-through font-mono">{product.originalPrice.toLocaleString('vi-VN')} ₫</span>
          )}
        </div>
        <p className="text-[10px] text-ink-400">/ {product.unit}</p>
      </div>
    </Link>
  );
}

function RankedProductCard({ product }: { product: ProductSummary }) {
  const discount = product.discountPercent ?? 0;
  const initial = product.name.charAt(0);
  return (
    <Link href={`/${product.slug}`}
      className="group flex flex-col bg-white border border-ink-200 rounded-lg overflow-hidden hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <div className="aspect-square bg-ink-50 flex items-center justify-center relative">
        <span className="text-2xl font-bold text-ink-300">{initial}</span>
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-1.5 h-5 bg-danger-600 text-white text-[10px] font-bold rounded flex items-center">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-ink-900 line-clamp-2 leading-snug group-hover:text-accent-700 transition-colors">
          {product.name}
        </p>
        <p className="mt-1 text-sm font-bold text-accent-700 font-mono">{product.price.toLocaleString('vi-VN')} ₫</p>
      </div>
    </Link>
  );
}
