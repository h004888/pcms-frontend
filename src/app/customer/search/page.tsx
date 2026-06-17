// =====================================================
// /search — SHOP-SEARCH: Tìm kiếm sản phẩm
// Dùng searchParams để filter (q, sort, minPrice, maxPrice)
// force-dynamic vì dùng searchParams runtime
// =====================================================

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PRODUCTS } from '@/data/shop/catalog';
import { SearchFilters } from '@/components/shop/SearchFilters';
import { SearchResultCard } from '@/components/shop/SearchResultCard';
import { EmptyState } from '@/components/ui/Feedback';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search as SearchIcon, X } from 'lucide-react';
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

export default function ShopSearchPage({ searchParams }: PageProps) {
  const q = (searchParams.q ?? '').trim().toLowerCase();

  let results = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    : PRODUCTS;

  if (searchParams.minPrice) {
    results = results.filter((p) => p.price >= Number(searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    results = results.filter((p) => p.price <= Number(searchParams.maxPrice));
  }

  // Sort
  const sort = searchParams.sort ?? 'relevance';
  switch (sort) {
    case 'price_asc':
      results = [...results].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      results = [...results].sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      results = [...results].sort((a, b) => a.sku.localeCompare(b.sku));
      break;
    case 'best_selling':
      results = [...results].sort(
        (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
      );
      break;
    // 'relevance' giữ nguyên thứ tự mặc định
  }

  const hasQuery = q.length > 0;
  const hasFilters = Boolean(searchParams.minPrice || searchParams.maxPrice || sort !== 'relevance');

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">
            {hasQuery ? (
              <>
                Kết quả cho <span className="text-accent-700">"{searchParams.q}"</span>
              </>
            ) : (
              'Tất cả sản phẩm'
            )}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            <span className="font-mono font-semibold text-ink-900">{results.length}</span> kết quả
            {hasQuery && (
              <Link
                href="/customer/search"
                className="ml-3 inline-flex items-center gap-1 text-xs text-ink-500 hover:text-danger-600"
              >
                <X className="w-3 h-3" aria-hidden="true" />
                Xóa từ khóa
              </Link>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          <Suspense fallback={<div className="space-y-3"><Skeleton height="120px" /><Skeleton height="200px" /></div>}>
            <SearchFilters />
          </Suspense>
          <div>
            {results.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="Không tìm thấy sản phẩm"
                description={
                  hasQuery
                    ? `Không có kết quả cho "${searchParams.q}". Thử từ khóa khác hoặc điều chỉnh bộ lọc.`
                    : 'Điều chỉnh bộ lọc để xem thêm sản phẩm.'
                }
                action={
                  hasFilters ? (
                    <Link
                      href={hasQuery ? `/customer/search?q=${encodeURIComponent(q)}` : '/customer/search'}
                      className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                      Xóa bộ lọc
                    </Link>
                  ) : undefined
                }
              />
            ) : (
              <div className="space-y-3">
                {results.map((p) => (
                  <SearchResultCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
