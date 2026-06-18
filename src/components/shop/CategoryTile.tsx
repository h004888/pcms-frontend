// =====================================================
// CategoryTile — square tile for category grid (SHOP-HOME, CAT-1)
// Shows icon + name + product count
// =====================================================

import Link from 'next/link';
import {
  Pill,
  Heart,
  Stethoscope,
  Baby,
  FlaskConical,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '@/types/shop/catalog';

const ICON_MAP: Record<string, LucideIcon> = {
  Pill,
  Heart,
  Stethoscope,
  Baby,
  FlaskConical,
};

export interface CategoryTileProps {
  category: Category;
  variant?: 'home' | 'sidebar';
}

export function CategoryTile({ category, variant = 'home' }: CategoryTileProps) {
  const Icon = ICON_MAP[category.icon ?? 'Pill'] ?? Pill;
  const href = `/shop/${category.slug}`;

  if (variant === 'sidebar') {
    return (
      <Link
        href={href}
        className="group flex items-center gap-3 px-3 py-2.5 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:bg-accent-50 transition-colors"
      >
        <div className="flex-shrink-0 w-9 h-9 bg-accent-50 rounded-md flex items-center justify-center group-hover:bg-accent-100 transition-colors">
          <Icon className="w-4 h-4 text-accent-700" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink-900 truncate">{category.name}</p>
          <p className="text-xs text-ink-500 font-mono">{category.productCount} sản phẩm</p>
        </div>
        <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-accent-700 transition-colors" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col items-center p-5 md:p-6 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:bg-accent-50 transition-colors"
      aria-label={`Xem danh mục ${category.name}, ${category.productCount} sản phẩm`}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 bg-accent-50 rounded-full flex items-center justify-center group-hover:bg-accent-100 group-hover:scale-110 transition-[transform,background-color] duration-150 mb-3">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent-700" aria-hidden="true" />
      </div>
      <p className="text-sm md:text-base font-semibold text-ink-900 text-center leading-tight">
        {category.name}
      </p>
      <p className="text-[11px] text-ink-500 mt-1 font-mono">
        {category.productCount.toLocaleString('vi-VN')} sp
      </p>
    </Link>
  );
}
