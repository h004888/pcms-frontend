// =====================================================
// ShopHomeCategories — Lưới 5 danh mục chính
// Dùng data từ CATEGORIES (catalog.ts)
// =====================================================

import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/data/shop/catalog';

function getIcon(name?: string): LucideIcon {
  if (!name) return Icons.Pill;
  const iconMap = Icons as unknown as Record<string, LucideIcon>;
  return iconMap[name] ?? Icons.Pill;
}

export function ShopHomeCategories() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10"
      aria-labelledby="categories-title"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2
            id="categories-title"
            className="text-2xl font-bold text-ink-900 tracking-tight text-balance"
          >
            Danh mục
          </h2>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Tra cứu theo nhóm thuốc và sản phẩm
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <div className="w-14 h-14 bg-accent-50 rounded-full flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                <Icon className="w-7 h-7 text-accent-700" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-ink-900 text-balance">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-500 font-mono">
                  {cat.productCount.toLocaleString('vi-VN')} sản phẩm
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
