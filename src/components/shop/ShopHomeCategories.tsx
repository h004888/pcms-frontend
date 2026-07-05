// =====================================================
// ShopHomeCategories — Danh mục dạng pills (horizontal scroll)
// API: GET /categories?page=0&size=20 → lấy 6 categories
// =====================================================

import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fetchCategories } from '@/features/categories';
import type { Category as BackendCategory } from '@/features/categories/types';

export const revalidate = 300;

function getIcon(name?: string): LucideIcon {
  if (!name) return Icons.Pill;
  const iconMap = Icons as unknown as Record<string, LucideIcon>;
  return iconMap[name] ?? Icons.Pill;
}

const CATEGORY_MAP: Record<string, { icon: LucideIcon; label: string }> = {
  thuoc: { icon: Icons.Pill, label: 'Thuốc' },
  'thuc-pham-chuc-nang': { icon: Icons.Apple, label: 'TPCN' },
  'my-pham': { icon: Icons.Sparkles, label: 'Mỹ phẩm' },
  'me-va-be': { icon: Icons.Baby, label: 'Mẹ & Bé' },
  vaccine: { icon: Icons.Syringe, label: 'Vaccine' },
  'thiet-bi-y-te': { icon: Icons.HeartPulse, label: 'TB Y tế' },
};

export async function ShopHomeCategories() {
  let cats: { slug: string; name: string }[] = [];
  try {
    const page = await fetchCategories({ page: 0, size: 20 });
    if (!page.data?.length) return null;
    cats = page.data.slice(0, 6).map((c: BackendCategory) => ({ slug: c.slug ?? '', name: c.name }));
  } catch {
    return null;
  }

  return (
    <section className="bg-white border-b border-ink-200" aria-label="Danh mục sản phẩm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-ink-900">Danh mục nổi bật</h2>
          <Link href="/thuoc" className="text-xs font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {cats.map((cat) => {
            const meta = CATEGORY_MAP[cat.slug] ?? { icon: getIcon(cat.slug), label: cat.name };
            const Icon = meta.icon;
            return (
              <Link key={cat.slug} href={`/${cat.slug}`}
                className="press group flex flex-col items-center gap-2.5 p-3 md:p-4 rounded-lg bg-white hover:bg-accent-50 border border-ink-200 hover:border-accent-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-ink-50 group-hover:bg-accent-100 flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent-700" aria-hidden="true" />
                </div>
                <span className="text-xs md:text-sm font-medium text-ink-800 text-center leading-tight">
                  {meta.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
