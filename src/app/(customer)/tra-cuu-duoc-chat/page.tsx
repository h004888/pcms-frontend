// =====================================================
// /tra-cuu-duoc-chat — SHOP-LOOKUP-INGREDIENT: Tra cứu hoạt chất
// Dùng INGREDIENTS data. Search + category filter.
// =====================================================

import Link from 'next/link';
import type { Metadata } from 'next';
import { Search, Beaker, ChevronRight } from 'lucide-react';
import {
  INGREDIENTS,
  INGREDIENT_CATEGORIES,
  searchIngredients,
  getIngredientsByCategory,
} from '@/data/shop/ingredients';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Badge } from '@/components/ui/Card';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tra cứu hoạt chất',
  description: 'Tra cứu thông tin hoạt chất/dược chất: công thức, cơ chế, chỉ định, liều dùng, tác dụng phụ, tương tác.',
};

interface PageProps {
  searchParams: { q?: string; cat?: string };
}

export default function TraCuuDuocChatPage({ searchParams }: PageProps) {
  const q = (searchParams.q ?? '').trim();
  const catFilter = searchParams.cat as any;

  let results = q
    ? searchIngredients(q)
    : catFilter
      ? getIngredientsByCategory(catFilter)
      : INGREDIENTS;

  return (
    <>
      <LookupNav active="tra-cuu-duoc-chat" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tra cứu hoạt chất' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Tra cứu hoạt chất
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Thông tin chi tiết hoạt chất: công thức hóa học, cơ chế tác dụng, chỉ định, liều dùng, tác dụng phụ, tương tác thuốc.
          </p>

          {/* Search form */}
          <form
            action="/tra-cuu-duoc-chat"
            method="get"
            className="mt-6 max-w-2xl"
            role="search"
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Tìm hoạt chất (Paracetamol, Amoxicillin, ...)"
                aria-label="Tìm hoạt chất"
                className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
              />
            </div>
            {catFilter && <input type="hidden" name="cat" value={catFilter} />}
          </form>

          {/* Category filter */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {INGREDIENT_CATEGORIES.map((cat) => {
              const isActive = (catFilter ?? 'all') === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={
                    cat.id === 'all'
                      ? '/tra-cuu-duoc-chat'
                      : `/tra-cuu-duoc-chat?cat=${cat.id}`
                  }
                  className={clsx(
                    'inline-flex items-center px-3 h-8 text-xs font-medium rounded-full whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                    isActive
                      ? 'bg-accent-600 text-white'
                      : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                  )}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-ink-600 mb-3">
          <span className="font-mono font-semibold text-ink-900">{results.length}</span> hoạt chất
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Không tìm thấy hoạt chất"
            description="Thử từ khóa khác hoặc bỏ bộ lọc"
          />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((ing) => (
              <li key={ing.slug}>
                <Link
                  href={`/tra-cuu-duoc-chat/${ing.slug}`}
                  className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-accent-700" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 text-balance">
                        {ing.name}
                      </p>
                      {ing.latinName && (
                        <p className="text-xs italic text-ink-500 mt-0.5">
                          {ing.latinName}
                        </p>
                      )}
                      {ing.formula && (
                        <p className="text-xs text-ink-600 mt-1 font-mono">
                          {ing.formula}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="default">{ing.category}</Badge>
                        <ChevronRight className="w-4 h-4 text-ink-400 ml-auto" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}