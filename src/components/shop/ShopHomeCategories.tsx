// =====================================================
// ShopHomeCategories — Lưới 5 danh mục chính (vivid edition)
// Mỗi category có theme màu riêng (accent/info/success/warning/danger)
// → không còn cảm giác "5 thẻ trắng giống nhau".
// Phá vỡ pattern "3-equal-cards" với 1 featured card lớn + 4 thẻ nhỏ.
// =====================================================

import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES } from '@/data/shop/catalog';
import type { Category } from '@/types/shop/catalog';

function getIcon(name?: string): LucideIcon {
  if (!name) return Icons.Pill;
  const iconMap = Icons as unknown as Record<string, LucideIcon>;
  return iconMap[name] ?? Icons.Pill;
}

// Theme palette: 5 categories → 5 distinct color identities (cool + 1 warm warning)
const THEMES: Record<
  NonNullable<Category['theme']>,
  { bg: string; ring: string; iconBg: string; iconText: string; chip: string }
> = {
  accent: {
    bg: 'bg-accent-50 hover:bg-accent-100',
    ring: 'hover:border-accent-500',
    iconBg: 'bg-accent-600',
    iconText: 'text-white',
    chip: 'text-accent-700',
  },
  info: {
    bg: 'bg-info-50 hover:bg-info-100',
    ring: 'hover:border-info-500',
    iconBg: 'bg-info-600',
    iconText: 'text-white',
    chip: 'text-info-700',
  },
  success: {
    bg: 'bg-success-50 hover:bg-success-100',
    ring: 'hover:border-success-500',
    iconBg: 'bg-success-600',
    iconText: 'text-white',
    chip: 'text-success-700',
  },
  warning: {
    bg: 'bg-warning-50 hover:bg-warning-100',
    ring: 'hover:border-warning-500',
    iconBg: 'bg-warning-600',
    iconText: 'text-white',
    chip: 'text-warning-700',
  },
  danger: {
    bg: 'bg-danger-50 hover:bg-danger-100',
    ring: 'hover:border-danger-500',
    iconBg: 'bg-danger-600',
    iconText: 'text-white',
    chip: 'text-danger-700',
  },
  ink: {
    bg: 'bg-ink-50 hover:bg-ink-100',
    ring: 'hover:border-ink-500',
    iconBg: 'bg-ink-700',
    iconText: 'text-white',
    chip: 'text-ink-700',
  },
};

export function ShopHomeCategories() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      aria-labelledby="categories-title"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700 mb-2">
            <Icons.Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Khám phá theo nhóm
          </div>
          <h2
            id="categories-title"
            className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance leading-tight"
          >
            Danh mục nổi bật
          </h2>
          <p className="mt-2 text-sm text-ink-600 text-pretty max-w-2xl">
            Tra cứu theo nhóm thuốc và sản phẩm — phù hợp với dược sĩ tra cứu nhanh trong ca.
          </p>
        </div>
        <Link
          href="/thuoc"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
        >
          Xem tất cả
          <Icons.ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = getIcon(cat.icon);
          const theme = THEMES[cat.theme ?? 'accent'];
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className={`group relative flex flex-col items-start gap-3 p-5 md:p-6 ${theme.bg} border border-ink-200 ${theme.ring} rounded-lg transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500`}
            >
              {/* Decorative corner glow */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-300"
              />
              <div
                className={`relative w-12 h-12 md:w-14 md:h-14 ${theme.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-150 ring-1 ring-black/5`}
              >
                <Icon className={`w-6 h-6 md:w-7 md:h-7 ${theme.iconText}`} aria-hidden="true" />
              </div>
              <div className="relative">
                <p className="text-base md:text-lg font-bold text-ink-900 text-balance leading-tight">
                  {cat.name}
                </p>
                <p className={`mt-1.5 text-xs font-mono font-semibold ${theme.chip}`}>
                  {cat.productCount.toLocaleString('vi-VN')} sản phẩm
                </p>
                {cat.children && cat.children.length > 0 && (
                  <p className="mt-1 text-xs text-ink-500 line-clamp-1">
                    {cat.children.slice(0, 2).map((c) => c.name).join(' · ')}
                    {cat.children.length > 2 && ` · +${cat.children.length - 2}`}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
