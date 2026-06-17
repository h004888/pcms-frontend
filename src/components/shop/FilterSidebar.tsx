// =====================================================
// FilterSidebar — left sidebar filter for SHOP-CAT-1/2 + SHOP-SEARCH
// Groups: Price (range), Brand (checkbox), Country (checkbox), Stock, Prescription
// Collapsible on mobile via <details>
// =====================================================

'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface Facet {
  name: string;
  count: number;
}

export interface ProductFacets {
  brands: Facet[];
  countries: Facet[];
  priceRange: { min: number; max: number };
}

export interface ActiveFilters {
  priceMin?: number;
  priceMax?: number;
  brands: string[];
  countries: string[];
  inStockOnly: boolean;
  prescriptionOnly: 'all' | 'required' | 'otc';
}

export interface FilterSidebarProps {
  facets: ProductFacets;
  active: ActiveFilters;
  onChange: (next: ActiveFilters) => void;
  totalResults: number;
}

const PRESCRIPTION_LABELS: Record<ActiveFilters['prescriptionOnly'], string> = {
  all: 'Tất cả',
  required: 'Chỉ thuốc kê đơn',
  otc: 'Chỉ thuốc không kê đơn',
};

export function FilterSidebar({ facets, active, onChange, totalResults }: FilterSidebarProps) {
  const update = (patch: Partial<ActiveFilters>) =>
    onChange({ ...active, ...patch });

  const toggle = (key: 'brands' | 'countries', name: string) => {
    const set = new Set(active[key]);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    update({ [key]: Array.from(set) } as Partial<ActiveFilters>);
  };

  const hasActive =
    active.brands.length > 0 ||
    active.countries.length > 0 ||
    active.inStockOnly ||
    active.prescriptionOnly !== 'all' ||
    active.priceMin !== undefined ||
    active.priceMax !== undefined;

  const clearAll = () =>
    onChange({
      brands: [],
      countries: [],
      inStockOnly: false,
      prescriptionOnly: 'all',
      priceMin: undefined,
      priceMax: undefined,
    });

  return (
    <aside className="space-y-3" aria-label="Bộ lọc sản phẩm">
      {/* Active filter count + clear */}
      <div className="flex items-center justify-between p-3 bg-white border border-ink-200 rounded-md">
        <div>
          <p className="text-sm font-semibold text-ink-900">Bộ lọc</p>
          <p className="text-xs text-ink-500 mt-0.5">
            <span className="font-mono font-semibold text-accent-700">{totalResults}</span> sản phẩm
          </p>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-ink-600 hover:text-danger-600 transition-colors"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Price range */}
      <FilterSection title="Khoảng giá" defaultOpen>
        <PriceRangeFacet
          min={facets.priceRange.min}
          max={facets.priceRange.max}
          valueMin={active.priceMin}
          valueMax={active.priceMax}
          onChange={(priceMin, priceMax) => update({ priceMin, priceMax })}
        />
      </FilterSection>

      {/* Brand */}
      {facets.brands.length > 0 && (
        <FilterSection title="Thương hiệu" defaultOpen>
          <ul className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin">
            {facets.brands.map((b) => (
              <li key={b.name}>
                <label className="flex items-center gap-2 px-1 py-1 text-sm cursor-pointer hover:bg-ink-50 rounded">
                  <input
                    type="checkbox"
                    checked={active.brands.includes(b.name)}
                    onChange={() => toggle('brands', b.name)}
                    className="w-4 h-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="flex-1 text-ink-700 truncate">{b.name}</span>
                  <span className="text-xs text-ink-500 font-mono">({b.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {/* Country */}
      {facets.countries.length > 0 && (
        <FilterSection title="Xuất xứ" defaultOpen>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
            {facets.countries.map((c) => (
              <li key={c.name}>
                <label className="flex items-center gap-2 px-1 py-1 text-sm cursor-pointer hover:bg-ink-50 rounded">
                  <input
                    type="checkbox"
                    checked={active.countries.includes(c.name)}
                    onChange={() => toggle('countries', c.name)}
                    className="w-4 h-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="flex-1 text-ink-700 truncate">{c.name}</span>
                  <span className="text-xs text-ink-500 font-mono">({c.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {/* Stock */}
      <FilterSection title="Tình trạng" defaultOpen>
        <label className="flex items-center gap-2 px-1 py-1 text-sm cursor-pointer hover:bg-ink-50 rounded">
          <input
            type="checkbox"
            checked={active.inStockOnly}
            onChange={(e) => update({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500"
          />
          <span className="text-ink-700">Chỉ hiện sản phẩm còn hàng</span>
        </label>
      </FilterSection>

      {/* Prescription */}
      <FilterSection title="Loại thuốc" defaultOpen>
        <div className="space-y-1">
          {(['all', 'required', 'otc'] as const).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-1 py-1 text-sm cursor-pointer hover:bg-ink-50 rounded"
            >
              <input
                type="radio"
                name="prescriptionOnly"
                checked={active.prescriptionOnly === opt}
                onChange={() => update({ prescriptionOnly: opt })}
                className="w-4 h-4 border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500"
              />
              <span className="text-ink-700">{PRESCRIPTION_LABELS[opt]}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group bg-white border border-ink-200 rounded-md"
    >
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
        <span className="text-sm font-semibold text-ink-900">{title}</span>
        <ChevronDown
          className="w-4 h-4 text-ink-500 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </details>
  );
}

function PriceRangeFacet({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin?: number;
  valueMax?: number;
  onChange: (min?: number, max?: number) => void;
}) {
  const [localMin, setLocalMin] = useState(valueMin?.toString() ?? '');
  const [localMax, setLocalMax] = useState(valueMax?.toString() ?? '');

  const apply = () => {
    const newMin = localMin ? parseInt(localMin, 10) : undefined;
    const newMax = localMax ? parseInt(localMax, 10) : undefined;
    onChange(newMin, newMax);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-ink-500 mb-1">Từ (VND)</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={apply}
            placeholder={min.toString()}
            className="w-full h-9 px-2 text-sm bg-white border border-ink-200 rounded focus:border-accent-500 focus:ring-2 focus:ring-accent-200 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-500 mb-1">Đến (VND)</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={apply}
            placeholder={max.toString()}
            className="w-full h-9 px-2 text-sm bg-white border border-ink-200 rounded focus:border-accent-500 focus:ring-2 focus:ring-accent-200 focus:outline-none"
          />
        </div>
      </div>
      <p className="text-[10px] text-ink-500 font-mono">
        Khoảng: {min.toLocaleString('vi-VN')} — {max.toLocaleString('vi-VN')}
      </p>
    </div>
  );
}
