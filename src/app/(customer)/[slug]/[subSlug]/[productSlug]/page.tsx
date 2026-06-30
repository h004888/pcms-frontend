// =====================================================
// [slug]/[subSlug]/[productSlug] — SHOP-PDP: Product Detail Page (real API)
// Route: /thuoc/thuoc-giam-dau/paracetamol-500mg, ...
// Hoặc nếu L1 không có L2: /thuoc/{productSlug} (params.subSlug chứa productSlug)
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Package } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import { fetchMedicineBySlug } from '@/features/medicines';
import { fetchCategoryBySlug } from '@/features/categories';
import { AddToCartButton } from '@/components/shop/AddToCartButton';

interface PageProps {
  params: Promise<{ slug: string; subSlug: string; productSlug: string }>;
}

async function loadProduct(slug: string) {
  try {
    return await fetchMedicineBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await loadProduct((await params).productSlug);
  if (!product) return { title: 'Không tìm thấy' };
  return {
    title: product.name,
    description: `Mua ${product.name} chính hãng tại PCMS.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await loadProduct((await params).productSlug);

  // Fallback: nếu /{L1}/{productSlug} trực tiếp, (await params).subSlug chứa productSlug
  const resolved = product ?? (await loadProduct((await params).subSlug));
  if (!resolved) notFound();

  const category = resolved.categoryId
    ? await fetchCategoryBySlug(resolved.categoryId).catch(() => null)
    : null;

  const breadcrumbs = [
    ...(category
      ? [{ label: category.name, href: `/${category.slug ?? resolved.categoryId}` }]
      : []),
    { label: resolved.name },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-ink-50 border border-ink-200 rounded-md flex items-center justify-center overflow-hidden">
            {resolved.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolved.imageUrl}
                alt={resolved.name}
                className="object-contain w-full h-full"
              />
            ) : (
              <Package className="w-16 h-16 text-ink-300" aria-hidden="true" />
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
              {resolved.name}
            </h1>
            {resolved.sku && (
              <p className="mt-1 text-xs text-ink-500 font-mono">SKU: {resolved.sku}</p>
            )}
            <p className="mt-4 text-3xl font-bold text-accent-700 font-mono">
              {formatVND(resolved.price)}
              {resolved.unit && (
                <span className="ml-1 text-base font-normal text-ink-500">
                  / {resolved.unit}
                </span>
              )}
            </p>

            {resolved.prescriptionRequired && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 h-7 bg-warning-50 border border-warning-200 rounded-full text-xs text-warning-800">
                Thuốc kê đơn — cần đơn của bác sĩ
              </div>
            )}

            <AddToCartButton
              medicineId={resolved.id}
              medicineName={resolved.name}
              unit={resolved.unit ?? ''}
              prescriptionRequired={Boolean(resolved.prescriptionRequired)}
            />

            {category && (
              <p className="mt-6 text-sm text-ink-600">
                Danh mục:{' '}
                <Link
                  href={`/${category.slug ?? resolved.categoryId}`}
                  className="text-accent-700 hover:underline"
                >
                  {category.name}
                </Link>
              </p>
            )}
          </div>
        </div>

        {resolved.description && (
          <section className="mt-10 p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-lg font-semibold text-ink-900 mb-2">Mô tả</h2>
            <p className="text-sm text-ink-700 text-pretty whitespace-pre-line">
              {resolved.description}
            </p>
          </section>
        )}

        {resolved.usage && (
          <section className="mt-4 p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-lg font-semibold text-ink-900 mb-2">Công dụng &amp; cách dùng</h2>
            <p className="text-sm text-ink-700 text-pretty whitespace-pre-line">
              {resolved.usage}
            </p>
          </section>
        )}

        {resolved.ingredients && resolved.ingredients.trim().length > 0 && (
          <section className="mt-4 p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-lg font-semibold text-ink-900 mb-2">Thành phần</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-ink-700">
              {resolved.ingredients
                .split(/[;,\n]/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
                .map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
