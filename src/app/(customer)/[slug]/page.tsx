// =====================================================
// [slug] — SHOP-CAT-1: Danh mục cấp 1
// Routes: /thuoc, /thuc-pham-chuc-nang, /duoc-my-pham,
//         /cham-soc-ca-nhan, /thiet-bi-y-te
// Static routes (gioi-thieu, chinh-sach, ...) ưu tiên
// trước dynamic nên không bị nuốt.
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES, PRODUCTS, stripToSummary } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getCategoryL2Href, getCategoryL1Href } from '@/lib/shop/format';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Không tìm thấy' };
  return {
    title: cat.name,
    description: `${cat.productCount} sản phẩm ${cat.name.toLowerCase()} chính hãng tại PCMS.`,
  };
}

export default function ShopCategoryL1Page({ params }: PageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  // Filter products: khớp với chính L1 hoặc bất kỳ L2 con nào
  // (products lưu L2 ID làm category.id, không phải L1 ID)
  const childIds = new Set(category.children?.map((c) => c.id) ?? []);
  const validIds = new Set([category.id, ...childIds]);
  const products = PRODUCTS.filter((p) => validIds.has(p.category.id))
    .slice(0, 24)
    .map(stripToSummary);
  const hasSubcategories = category.children && category.children.length > 0;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[{ label: category.name }]}
            className="text-accent-100"
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-balance">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-accent-100 font-mono">
            {category.productCount.toLocaleString('vi-VN')} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Filter sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {hasSubcategories && (
                <div className="p-4 bg-white border border-ink-200 rounded-md">
                  <h2 className="text-sm font-semibold text-ink-900 mb-3">Danh mục con</h2>
                  <ul className="space-y-1">
                    {category.children!.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={getCategoryL2Href(category.slug, sub.slug)}
                          className="flex items-center justify-between px-2 py-1.5 text-sm text-ink-700 hover:bg-ink-50 rounded transition-colors"
                        >
                          <span>{sub.name}</span>
                          <span className="text-xs text-ink-500 font-mono">
                            {sub.productCount}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-ink-600">
                Hiển thị <span className="font-mono font-semibold text-ink-900">{products.length}</span> sản phẩm
              </p>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white border border-ink-200 rounded-md">
                <p className="text-sm text-ink-600">Chưa có sản phẩm trong danh mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
