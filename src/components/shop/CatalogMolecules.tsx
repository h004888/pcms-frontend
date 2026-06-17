// =====================================================
// ProductSortDropdown + ProductBreadcrumb + ProductGallery
// 3 catalog molecules used by CAT-1/2, PDP, SEARCH
// =====================================================

'use client';

import { useState, useRef } from 'react';
import { ChevronDown, Check, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProductSort } from '@/types/shop/catalog';

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'best_selling', label: 'Bán chạy nhất' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
];

export function ProductSortDropdown({
  value,
  onChange,
}: {
  value: ProductSort;
  onChange: (v: ProductSort) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3 h-9 text-sm font-medium text-ink-700 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <span className="text-ink-500">Sắp xếp:</span>
        <span className="text-ink-900 font-semibold">{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 top-full mt-1 w-56 bg-white border border-ink-200 rounded-md z-20 overflow-hidden"
            style={{ boxShadow: '0 4px 12px rgba(15, 29, 61, 0.12)' }}
          >
            {SORT_OPTIONS.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li key={opt.value} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-ink-50 transition-colors ${
                      isActive ? 'text-accent-700 font-semibold bg-accent-50' : 'text-ink-700'
                    }`}
                  >
                    {opt.label}
                    {isActive && <Check className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

// =====================================================
// ProductBreadcrumb — shared breadcrumb for all catalog pages
// =====================================================

export interface ProductBreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs flex-wrap">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-ink-500 hover:text-accent-700 transition-colors"
          >
            <Home className="w-3 h-3" aria-hidden="true" />
            Trang chủ
          </Link>
        </li>
        {items.map((b, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight
              className="w-3 h-3 text-ink-400"
              aria-hidden="true"
            />
            {b.href ? (
              <Link
                href={b.href}
                className="text-ink-500 hover:text-accent-700 transition-colors"
              >
                {b.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-700 font-medium">
                {b.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// =====================================================
// ProductGallery — image gallery for PDP
// Main image + thumbnails strip
// =====================================================

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const displayImages = images.length > 0 ? images : ['/placeholder-products/product.svg'];

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-ink-50 border border-ink-200 rounded-md overflow-hidden">
        <Image
          src={displayImages[active]}
          alt={alt}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className={`aspect-square bg-ink-50 border-2 rounded overflow-hidden transition-colors ${
                i === active
                  ? 'border-accent-500'
                  : 'border-transparent hover:border-ink-300'
              }`}
            >
              <Image
                src={img}
                alt=""
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
