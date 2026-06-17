// =====================================================
// [slug]/[subSlug] — SHOP-CAT-2: Danh mục cấp 2
// Route: /thuoc/thuoc-giam-dau, /thuc-pham-chuc-nang/vitamin-khoang-chat, ...
// =====================================================

import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getCategoryL1Href } from '@/lib/shop/format';

interface PageProps {
  params: { slug: string; subSlug: string };
}

export function generateStaticParams() {
  const params: Array<{ slug: string; subSlug: string }> = [];
  for (const cat of CATEGORIES) {
    for (const sub of cat.children ?? []) {
      params.push({ slug: cat.slug, subSlug: sub.slug });
    }
  }
  return params;
}

export function generateMetadata({ params }: PageProps) {
  const parent = CATEGORIES.find((c) => c.slug === params.slug);
  const sub = parent?.children?.find((s) => s.slug === params.subSlug);
  if (!sub) return { title: 'Không tìm thấy' };
  return {
    title: sub.name,
    description: `${sub.productCount} sản phẩm ${sub.name.toLowerCase()} chính hãng.`,
  };
}

export default function ShopCategoryL2Page({ params }: PageProps) {
  const parent = CATEGORIES.find((c) => c.slug === params.slug);
  const sub = parent?.children?.find((s) => s.slug === params.subSlug);
  if (!parent || !sub) notFound();

  const products = PRODUCTS.filter((p) => p.category.id === sub.id).slice(0, 24);

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: parent.name, href: getCategoryL1Href(parent.slug) },
              { label: sub.name },
            ]}
            className="text-accent-100"
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {sub.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100 font-mono">
            {sub.productCount.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white border border-ink-200 rounded-md">
            <p className="text-sm text-ink-600">Chưa có sản phẩm trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
