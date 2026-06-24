// =====================================================
// [slug] — SHOP-CAT-1 (real API)
// Danh mục cấp 1 — /api/v1/categories + /api/v1/medicines?category=...
// Routes: /thuoc, /thuc-pham-chuc-nang, ...
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { formatVND } from '@/lib/shop/format';

interface PageProps {
  params: { slug: string };
}

interface CategoryLite {
  id: string;
  slug: string;
  name: string;
  productCount?: number;
  children?: Array<{ id: string; slug: string; name: string }>;
}

interface ProductLite {
  id: string;
  name: string;
  price: number;
  slug?: string;
  manufacturer?: string;
}

async function loadCategoryBySlug(slug: string): Promise<CategoryLite | null> {
  try {
    const res = await apiClient.get<CategoryLite[]>(API_ENDPOINTS.CATEGORIES);
    return res.data.find((c) => c.slug === slug) ?? null;
  } catch {
    return null;
  }
}

async function loadProductsByCategory(categoryId: string): Promise<ProductLite[]> {
  try {
    const res = await apiClient.get<ProductLite[] | { products: ProductLite[] }>(
      API_ENDPOINTS.MEDICINES,
      { params: { categoryId, size: 24 } }
    );
    const body = res.data;
    if (Array.isArray(body)) return body;
    return body?.products ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const category = await loadCategoryBySlug(params.slug);
  if (!category) return { title: 'Không tìm thấy' };
  return {
    title: category.name,
    description: `${category.productCount ?? 0} sản phẩm ${category.name.toLowerCase()} chính hãng tại PCMS.`,
  };
}

export default async function ShopCategoryL1Page({ params }: PageProps) {
  const category = await loadCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = await loadProductsByCategory(category.id);

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: category.name }]} className="text-accent-100" />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100 font-mono">
            {(category.productCount ?? products.length).toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {category.children && category.children.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink-900 mb-2">
              Danh mục con
            </h2>
            <div className="flex gap-2 flex-wrap">
              {category.children.map((c) => (
                <Link
                  key={c.id}
                  href={`/${category.slug}/${c.slug}`}
                  className="px-3 h-8 inline-flex items-center bg-ink-100 text-ink-700 text-xs font-medium rounded-full hover:bg-ink-200"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Sản phẩm nổi bật
          </h2>
          {products.length === 0 ? (
            <EmptyState
              icon={() => null}
              title="Chưa có sản phẩm"
              description="Danh mục này hiện chưa có sản phẩm nào."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/${category.slug}/${p.slug ?? p.id}`}
                  className="block p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
                >
                  <h3 className="text-sm font-medium text-ink-900 line-clamp-2 text-balance">
                    {p.name}
                  </h3>
                  {p.manufacturer && (
                    <p className="mt-1 text-xs text-ink-500">{p.manufacturer}</p>
                  )}
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