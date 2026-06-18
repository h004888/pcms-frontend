// =====================================================
// /tra-cuu-thuoc/[slug] — SHOP-LOOKUP-DRUG detail
// Reuse ProductDetail từ catalog + thêm professional lookup view
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Pill, AlertTriangle, FileText, Building2, Calendar, Package } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { formatVND } from '@/lib/shop/format';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Không tìm thấy' };
  return {
    title: `${product.name} — Tra cứu`,
    description: `${product.name}: ${product.shortDescription}`,
  };
}

export default function TraCuuThuocDetailPage({ params }: PageProps) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const stockVariant =
    product.stockStatus === 'in_stock'
      ? 'success'
      : product.stockStatus === 'low_stock'
        ? 'warning'
        : 'danger';

  return (
    <>
      <LookupNav active="tra-cuu-thuoc" />

      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc' },
              { label: product.name },
            ]}
          />

          <div className="mt-3 flex items-start gap-3 flex-wrap">
            <Pill className="w-8 h-8 text-accent-600 flex-shrink-0 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-ink-900 text-balance">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-ink-600">
                <Building2 className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
                {product.brand} · {product.country} ·{' '}
                <span className="font-mono">SKU: {product.sku}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={stockVariant}>
                  {product.stockStatus === 'in_stock'
                    ? 'Còn hàng'
                    : product.stockStatus === 'low_stock'
                      ? 'Sắp hết'
                      : 'Hết hàng'}
                </Badge>
                {product.prescriptionRequired && (
                  <Badge variant="warning">⚕️ Thuốc kê đơn</Badge>
                )}
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick facts */}
        <section
          className="grid sm:grid-cols-3 gap-3"
          aria-label="Thông tin nhanh"
        >
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1">Giá tham khảo</p>
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              variant="inline"
            />
          </div>
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1 flex items-center gap-1">
              <Package className="w-3 h-3" aria-hidden="true" /> Đơn vị
            </p>
            <p className="text-sm font-medium text-ink-900">{product.unit}</p>
          </div>
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" /> Hạn dùng
            </p>
            <p className="text-sm font-medium text-ink-900">
              {product.expiryMonths} tháng từ NSX
            </p>
          </div>
        </section>

        {/* Tóm tắt */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả ngắn</h2>
          <p className="text-sm text-ink-700 text-pretty">{product.shortDescription}</p>
        </section>

        {/* Mô tả đầy đủ */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Thông tin chi tiết</h2>
          <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line text-pretty">
            {product.description}
          </p>
        </section>

        {/* Thành phần */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Thành phần</h2>
          <p className="text-sm text-ink-700 text-pretty">{product.ingredients}</p>
          <p className="mt-2 text-xs text-ink-500">
            Sản xuất bởi: {product.manufacturer}
          </p>
        </section>

        {/* Công dụng & Liều dùng */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">
            Công dụng & Liều dùng
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-ink-900">Công dụng</dt>
              <dd className="text-sm text-ink-700 text-pretty">{product.usage}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink-900">Liều dùng</dt>
              <dd className="text-sm text-ink-700 text-pretty">{product.dosage}</dd>
            </div>
            {product.sideEffects && (
              <div>
                <dt className="text-sm font-medium text-warning-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Tác dụng phụ
                </dt>
                <dd className="text-sm text-ink-700 text-pretty">{product.sideEffects}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Bảo quản */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-2">Bảo quản</h2>
          <p className="text-sm text-ink-700 text-pretty">{product.storage}</p>
        </section>

        {/* Liên kết */}
        <div className="flex justify-between items-center text-sm">
          <Link
            href="/tra-cuu-thuoc"
            className="text-accent-700 hover:underline"
          >
            ← Quay lại danh sách thuốc
          </Link>
          <Link
            href="/tra-thuoc-chinh-hang"
            className="inline-flex items-center gap-1.5 text-accent-700 hover:underline"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            Xác minh chính hãng
          </Link>
        </div>
      </div>
    </>
  );
}