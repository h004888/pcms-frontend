// =====================================================
// SearchFilters — Sidebar filter cho /search
// Sort + price range, sync URL params
// =====================================================

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { formatVND } from '@/lib/shop/format';
import clsx from 'clsx';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Liên quan nhất' },
  { value: 'best_selling', label: 'Bán chạy' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'newest', label: 'Mới nhất' },
];

const PRICE_RANGES = [
  { label: 'Dưới 50K', min: '0', max: '50000' },
  { label: '50K – 200K', min: '50000', max: '200000' },
  { label: '200K – 500K', min: '200000', max: '500000' },
  { label: 'Trên 500K', min: '500000', max: '' },
];

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`/search?${next.toString()}`);
    },
    [params, router]
  );

  const sort = params.get('sort') ?? 'relevance';
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');

  return (
    <aside className="space-y-4" aria-label="Bộ lọc tìm kiếm">
      <div className="p-4 bg-white border border-ink-200 rounded-md">
        <h2 className="text-sm font-semibold text-ink-900 mb-3">Sắp xếp</h2>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParam('sort', opt.value)}
              className={clsx(
                'w-full text-left px-2 py-1.5 text-sm rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                sort === opt.value
                  ? 'bg-accent-50 text-accent-700 font-medium'
                  : 'text-ink-700 hover:bg-ink-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border border-ink-200 rounded-md">
        <h2 className="text-sm font-semibold text-ink-900 mb-3">Khoảng giá</h2>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => {
                  updateParam('minPrice', range.min);
                  updateParam('maxPrice', range.max);
                }}
                className={clsx(
                  'block w-full text-left text-sm rounded px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  isActive
                    ? 'bg-accent-50 text-accent-700 font-medium'
                    : 'text-ink-700 hover:bg-ink-50'
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
        {(minPrice || maxPrice) && (
          <div className="mt-3 pt-3 border-t border-ink-200 space-y-2">
            <p className="text-xs text-ink-500">
              Đang chọn:{' '}
              <span className="font-mono text-ink-700">
                {minPrice ? formatVND(Number(minPrice)) : '0'}
              </span>
              {' – '}
              <span className="font-mono text-ink-700">
                {maxPrice ? formatVND(Number(maxPrice)) : '∞'}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                updateParam('minPrice', null);
                updateParam('maxPrice', null);
              }}
              className="text-xs text-danger-600 hover:underline"
            >
              Xóa khoảng giá
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
