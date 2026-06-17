// =====================================================
// [slug]/[subSlug]/[productSlug] — SHOP-PDP: Product Detail Page
// Route: /thuoc/thuoc-giam-dau/paracetamol-500mg, ...
// Hoặc nếu L1 không có L2: /thuoc/paracetamol (handled by [slug]/[slugProduct])
// =====================================================

import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS } from '@/data/shop/catalog';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { ProductInfo } from '@/components/shop/ProductInfo';
import { ProductTabs } from '@/components/shop/ProductTabs';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getCategoryL1Href, getCategoryL2Href } from '@/lib/shop/format';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string; subSlug: string; productSlug: string };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => {
    const directCat = CATEGORIES.find((c) => c.id === p.category.id);
    const parentCat = CATEGORIES.find((c) =>
      c.children?.some((ch) => ch.id === p.category.id)
    );
    const isL2 = Boolean(parentCat);
    if (isL2) {
      return { slug: parentCat!.slug, subSlug: p.category.slug, productSlug: p.slug };
    }
    return { slug: directCat?.slug ?? 'thuoc', subSlug: p.slug, productSlug: p.slug };
  });
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.productSlug);
  if (!product) return { title: 'Không tìm thấy' };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  // Hỗ trợ 2 trường hợp:
  // - L2: /{L1}/{L2}/{productSlug} → match product by slug
  // - L1 trực tiếp: /{L1}/{productSlug} → tìm theo productSlug = subSlug
  let product = PRODUCTS.find((p) => p.slug === params.productSlug);
  let categorySlug: string | undefined;
  let subcategorySlug: string | undefined;

  if (product) {
    // L2: dùng product.category
    const directCat = CATEGORIES.find((c) => c.id === product!.category.id);
    const parentCat = CATEGORIES.find((c) =>
      c.children?.some((ch) => ch.id === product!.category.id)
    );
    if (parentCat) {
      categorySlug = parentCat.slug;
      subcategorySlug = product.category.slug;
    } else {
      categorySlug = directCat?.slug;
      subcategorySlug = product.category.slug;
    }
  } else {
    // L1 trực tiếp: subSlug = productSlug
    product = PRODUCTS.find((p) => p.slug === params.subSlug);
    if (product) {
      categorySlug = params.slug;
      subcategorySlug = product.category.slug;
    }
  }

  if (!product || !categorySlug) notFound();

  const related = PRODUCTS.filter(
    (p) => p.id !== product!.id && p.category.id === product!.category.id
  ).slice(0, 5);

  // L2 hay L1? parentCat tồn tại nếu L2
  const isL2 = CATEGORIES.find((c) =>
    c.children?.some((ch) => ch.id === product!.category.id)
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          items={[
            { label: CATEGORIES.find((c) => c.slug === categorySlug)?.name ?? '', href: getCategoryL1Href(categorySlug) },
            ...(isL2 && subcategorySlug
              ? [{ label: product.category.name, href: getCategoryL2Href(categorySlug, subcategorySlug) }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={product.images} alt={product.name} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-10">
          <ProductTabs
            tabs={[
              {
                id: 'desc',
                label: 'Mô tả',
                content: (
                  <div className="prose prose-sm max-w-none">
                    <p>{product.description}</p>
                    <h4>Thành phần</h4>
                    <p>{product.ingredients}</p>
                    <h4>Hãng sản xuất</h4>
                    <p>{product.manufacturer}</p>
                  </div>
                ),
              },
              {
                id: 'usage',
                label: 'Công dụng & Liều dùng',
                content: (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-ink-900">Công dụng</h4>
                      <p>{product.usage}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-900">Liều dùng</h4>
                      <p>{product.dosage}</p>
                    </div>
                    {product.sideEffects && (
                      <div>
                        <h4 className="font-semibold text-ink-900">Tác dụng phụ</h4>
                        <p>{product.sideEffects}</p>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: 'storage',
                label: 'Bảo quản',
                content: (
                  <div>
                    <p>{product.storage}</p>
                    <p className="mt-2 text-ink-500">
                      Hạn dùng: {product.expiryMonths} tháng từ ngày sản xuất.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink-900 mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
