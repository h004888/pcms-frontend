// =====================================================
// [slug]/[subSlug] — SHOP-CAT-2: Danh mục cấp 2 (real API)
// Route: /thuoc/thuoc-giam-dau, /thuc-pham-chuc-nang/vitamin-khoang-chat, ...
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Package } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import { fetchCategoryBySlug } from '@/features/categories';
import { fetchMedicines } from '@/features/medicines';
import type { Medicine } from '@/features/medicines';

interface PageProps {
  params: Promise<{ slug: string; subSlug: string }>;
}

async function loadL2(slug: string, subSlug: string) {
  try {
    const [parent, sub] = await Promise.all([
      fetchCategoryBySlug(slug),
      fetchCategoryBySlug(subSlug),
    ]);
    if (!sub) return null;
    return { parent, sub };
  } catch {
    return null;
  }
}

async function loadProductsBySubCategory(categoryId: string): Promise<Medicine[]> {
  try {
    const res = await fetchMedicines({ categoryId, size: 24 });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const ctx = await loadL2((await params).slug, (await params).subSlug);
  if (!ctx?.sub) return { title: 'Không tìm thấy' };
  return {
    title: ctx.sub.name,
    description: `Sản phẩm ${ctx.sub.name.toLowerCase()} chính hãng.`,
  };
}

export default async function ShopCategoryL2Page({ params }: PageProps) {
  const ctx = await loadL2((await params).slug, (await params).subSlug);
  if (!ctx?.sub) notFound();

  const products = await loadProductsBySubCategory(ctx.sub.id);
  const subSlug = ctx.sub.slug ?? (await params).subSlug;
  const parentSlug = ctx.parent?.slug ?? (await params).slug;

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: ctx.parent?.name ?? 'Danh mục', href: `/${parentSlug}` },
              { label: ctx.sub.name },
            ]}
            className="text-accent-100"
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {ctx.sub.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100 font-mono">
            {products.length.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có sản phẩm"
            description="Danh mục này hiện chưa có sản phẩm nào."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/${parentSlug}/${subSlug}/${p.slug ?? p.id}`}
                className="block p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <h3 className="text-sm font-medium text-ink-900 line-clamp-2 text-balance">
                  {p.name}
                </h3>
                <p className="mt-2 text-base font-bold text-accent-700 font-mono">
                  {formatVND(p.price)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
