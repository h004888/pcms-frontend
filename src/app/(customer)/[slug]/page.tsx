// =====================================================
// [slug] — SHOP-CAT-1 (real API)
// Danh mục cấp 1 — GET /categories/slug/{slug} + GET /medicines?categoryId=...
// Routes: /thuoc, /thuc-pham-chuc-nang, ...
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Package } from 'lucide-react';
import { fetchCategoryBySlug } from '@/features/categories';
import { fetchMedicines } from '@/features/medicines';
import type { Medicine } from '@/features/medicines';
import { formatVND } from '@/lib/shop/format';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadCategoryBySlug(slug: string) {
  try {
    return await fetchCategoryBySlug(slug);
  } catch {
    return null;
  }
}

async function loadProductsByCategory(categoryId: string): Promise<Medicine[]> {
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
  const category = await loadCategoryBySlug((await params).slug);
  if (!category) return { title: 'Không tìm thấy' };
  return {
    title: category.name,
    description: `Sản phẩm ${category.name.toLowerCase()} chính hãng tại PCMS.`,
  };
}

export default async function ShopCategoryL1Page({ params }: PageProps) {
  const category = await loadCategoryBySlug((await params).slug);
  if (!category) notFound();

  const products = await loadProductsByCategory(category.id);
  const categorySlug = category.slug ?? (await params).slug;

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: category.name }]} className="text-accent-100" />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100 font-mono">
            {products.length.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Sản phẩm nổi bật
          </h2>
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
                  href={`/${categorySlug}/${p.slug ?? p.id}`}
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
    </div>
  );
}