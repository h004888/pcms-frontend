'use client';
export const dynamic = 'force-dynamic';

// =====================================================
// /tra-cuu-duoc-lieu — SHOP-LOOKUP-HERB (real API)
// /api/v1/shop/lookup/herb
// =====================================================

import { Suspense } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Leaf, ChevronRight, Loader2 } from 'lucide-react';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { lookupHerb } from '@/features/shop';

interface HerbLite {
  id: string;
  name: string;
  slug?: string;
  scientificName?: string;
  category?: string;
}

function HerbSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = (searchParams.get('q') ?? '').trim();
  const [results, setResults] = useState<HerbLite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    lookupHerb(q)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? (data as HerbLite[])
          : Array.isArray((data as { items?: HerbLite[] })?.items)
            ? ((data as { items: HerbLite[] }).items)
            : [];
        setResults(list);
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

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get('q')?.toString() ?? '';
    const params = new URLSearchParams();
    if (value) params.set('q', value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tra cứu dược liệu' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Tra cứu dược liệu
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Dược liệu Việt Nam: tên khoa học, bộ phận dùng, công dụng theo y học cổ truyền.
          </p>

          <form onSubmit={handleSearch} className="mt-6 max-w-2xl relative" role="search">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Tìm dược liệu (Gừng, Nghệ, Atisô, ...)"
              className="w-full h-12 pl-10 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink-500 py-8 text-center">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
            Đang tìm...
          </p>
        ) : results.length === 0 ? (
          <EmptyState
            icon={Leaf}
            title="Không tìm thấy"
            description={
              q ? `Không có kết quả cho "${q}".` : 'Nhập từ khóa để bắt đầu tìm.'
            }
          />
        ) : (
          <ul className="divide-y divide-ink-100 bg-white border border-ink-200 rounded-md">
            {results.map((h) => (
              <li key={h.id}>
                <Link
                  href={`/tra-cuu-duoc-lieu/${h.slug ?? h.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-ink-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-success-50 text-success-700 rounded-md flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{h.name}</p>
                    {h.scientificName && (
                      <p className="text-xs text-ink-500 italic mt-0.5">
                        {h.scientificName}
                      </p>
                    )}
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

function HerbSearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-3">
      <p className="text-sm text-ink-500 py-8 text-center">
        <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
        Đang tải...
      </p>
    </div>
  );
}

export default function TraCuuDuocLieuPage() {
  return (
    <>
      <LookupNav active="tra-cuu-duoc-lieu" />
      <Suspense fallback={<HerbSearchFallback />}>
        <HerbSearchContent />
      </Suspense>
    </>
  );
}
