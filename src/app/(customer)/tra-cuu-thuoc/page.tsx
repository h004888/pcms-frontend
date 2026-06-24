'use client';

// =====================================================
// /tra-cuu-thuoc — SHOP-LOOKUP-DRUG (real API)
// Sử dụng /api/v1/shop/search từ customer-portal-service
// =====================================================

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Pill, ChevronRight, Loader2 } from 'lucide-react';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { formatVND } from '@/lib/shop/format';
import { searchShop } from '@/features/shop';
import type { ShopSearchResult } from '@/features/shop';

export default function TraCuuThuocPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const [results, setResults] = useState<ShopSearchResult['products']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchShop(q)
      .then((res) => {
        if (!cancelled) setResults(res.products);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <>
      <LookupNav active="tra-cuu-thuoc" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tra cứu' }, { label: 'Tra thuốc' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Tra cứu thuốc
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tìm thuốc theo tên, hoạt chất, SĐK — dữ liệu từ catalog-service và shop-service.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <form action="/tra-cuu-thuoc" method="get" className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nhập tên thuốc, hoạt chất..."
            className="w-full h-12 pl-10 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
        </form>

        {loading ? (
          <p className="text-sm text-ink-500 py-8 text-center">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
            Đang tìm kiếm...
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy"
            description={
              q
                ? `Không có kết quả cho "${q}".`
                : 'Nhập từ khóa để bắt đầu tìm kiếm.'
            }
          />
        ) : (
          <ul className="divide-y divide-ink-100 bg-white border border-ink-200 rounded-md">
            {results.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/tra-cuu-thuoc/${p.slug ?? p.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-ink-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-accent-50 text-accent-700 rounded-md flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    {p.manufacturer && (
                      <p className="text-xs text-ink-500 mt-0.5">
                        {p.manufacturer}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-accent-700 font-mono">
                      {formatVND(p.price)}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-ink-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}