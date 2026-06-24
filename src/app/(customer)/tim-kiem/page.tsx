// =====================================================
// /search — SHOP-SEARCH (real API)
// Tìm kiếm sản phẩm — /api/v1/shop/search
// =====================================================

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/Feedback';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search as SearchIcon } from 'lucide-react';
import { searchShop } from '@/features/shop';
import { formatVND } from '@/lib/shop/format';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const q = searchParams.q;
  return {
    title: q ? `Tìm "${q}"` : 'Tìm kiếm sản phẩm',
    description: 'Tra cứu thuốc, thực phẩm chức năng, dược mỹ phẩm chính hãng tại PCMS.',
  };
}

async function loadResults(params: PageProps['searchParams']) {
  try {
    const res = await searchShop(params.q ?? '', {
      sort: params.sort,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    });
    return res.products;
  } catch {
    return [];
  }
}

export default async function ShopSearchPage({ searchParams }: PageProps) {
  const products = await loadResults(searchParams);
  const q = (searchParams.q ?? '').trim();
  const hasQuery = q.length > 0;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <form action="/tim-kiem" method="get" className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Tìm thuốc, thực phẩm chức năng, dược mỹ phẩm..."
              className="w-full h-12 pl-10 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-base font-semibold text-ink-900 mb-3">
          {hasQuery ? `Kết quả cho "${q}"` : 'Tất cả sản phẩm'}
          <span className="ml-2 text-sm font-normal text-ink-500">
            ({products.length})
          </span>
        </h2>

        {products.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="Không tìm thấy"
            description={
              hasQuery
                ? `Không có kết quả cho "${q}". Thử từ khóa khác.`
                : 'Chưa có sản phẩm nào trong hệ thống.'
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((p) => (
              <article
                key={p.id}
                className="p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <Link href={`/${p.slug ?? p.id}`} className="block">
                  <h3 className="text-sm font-semibold text-ink-900 line-clamp-2 text-balance">
                    {p.name}
                  </h3>
                  {p.manufacturer && (
                    <p className="mt-1 text-xs text-ink-500">{p.manufacturer}</p>
                  )}
                  <p className="mt-2 text-base font-bold text-accent-700 font-mono">
                    {formatVND(p.price)}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}