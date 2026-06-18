// =====================================================
// /tra-cuu-thuoc — SHOP-LOOKUP-DRUG: Tra cứu thuốc
// Dùng PRODUCTS có sẵn. Search theo tên/brand/SKU. Browse theo L1 category.
// PCMS portal: phục vụ dược sĩ tra cứu nhanh.
// =====================================================

import Link from 'next/link';
import type { Metadata } from 'next';
import { Search, Pill, ChevronRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/shop/catalog';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { formatVND } from '@/lib/shop/format';
import { getProductHref } from '@/lib/shop/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tra cứu thuốc',
  description: 'Tra cứu thông tin thuốc: công dụng, liều dùng, tác dụng phụ, tương tác.',
};

interface PageProps {
  searchParams: { q?: string; cat?: string };
}

export default function TraCuuThuocPage({ searchParams }: PageProps) {
  const q = (searchParams.q ?? '').trim().toLowerCase();
  const catFilter = searchParams.cat;

  let results = PRODUCTS;
  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }
  if (catFilter) {
    results = results.filter(
      (p) => p.category.id === catFilter || p.category.slug === catFilter
    );
  }

  // Browse by category (L1) — show count
  const catCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: PRODUCTS.filter((p) => p.category.id === cat.id).length,
  }));

  return (
    <>
      <LookupNav active="tra-cuu-thuoc" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tra cứu thuốc' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">Tra cứu thuốc</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Thông tin chi tiết: công dụng, liều dùng, tác dụng phụ, tương tác.
          </p>

          {/* Search form */}
          <form action="/tra-cuu-thuoc" method="get" className="mt-6 max-w-2xl" role="search">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tên thuốc, hoạt chất, hãng, mã SKU..."
                aria-label="Tìm thuốc"
                className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
            {catFilter && <input type="hidden" name="cat" value={catFilter} />}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Browse by category */}
        {!q && (
          <section aria-labelledby="browse-cat-title">
            <h2 id="browse-cat-title" className="text-lg font-semibold text-ink-900 mb-3">
              Tra cứu theo danh mục
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {catCounts.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tra-cuu-thuoc?cat=${cat.id}`}
                  className="flex items-center justify-between gap-2 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <span className="text-sm font-medium text-ink-900">{cat.name}</span>
                  <span className="text-xs text-ink-500 font-mono">{cat.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        <section aria-labelledby="results-title">
          <div className="flex items-baseline justify-between mb-3">
            <h2 id="results-title" className="text-lg font-semibold text-ink-900">
              {q
                ? `Kết quả cho "${searchParams.q}"`
                : catFilter
                  ? `Danh mục: ${CATEGORIES.find((c) => c.id === catFilter)?.name ?? catFilter}`
                  : 'Tất cả thuốc'}
            </h2>
            <p className="text-sm text-ink-600">
              <span className="font-mono font-semibold text-ink-900">{results.length}</span> kết quả
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Không tìm thấy thuốc"
              description="Thử từ khóa khác hoặc bỏ bộ lọc danh mục"
            />
          ) : (
            <ul className="divide-y divide-ink-100 bg-white border border-ink-200 rounded-md">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={getProductHref(p)}
                    className="flex items-center gap-4 p-4 hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-ink-50 rounded-md flex items-center justify-center">
                      <Pill className="w-6 h-6 text-ink-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 line-clamp-1 text-balance">
                        {p.name}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {p.brand} · {p.country}
                        <span className="mx-1">·</span>
                        <span className="font-mono">{p.sku}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-accent-700 font-mono">
                        {formatVND(p.price)}
                      </p>
                      <p className="text-[10px] text-ink-500 mt-0.5">/{p.unit}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}