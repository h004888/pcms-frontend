// =====================================================
// ShopHomeBestseller — Top sản phẩm theo review count
// Dùng getBestsellers() từ catalog.ts (sort theo reviewCount)
// =====================================================

import { getBestsellers } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';

export function ShopHomeBestseller() {
  const bestsellers = getBestsellers(10);
  if (bestsellers.length === 0) return null;

  return (
    <section
      className="bg-ink-50 py-10"
      aria-labelledby="bestseller-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2
              id="bestseller-title"
              className="text-2xl font-bold text-ink-900 tracking-tight text-balance"
            >
              Sản phẩm nổi bật
            </h2>
            <p className="mt-1 text-sm text-ink-600 text-pretty">
              Được khách hàng đánh giá cao nhất
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
