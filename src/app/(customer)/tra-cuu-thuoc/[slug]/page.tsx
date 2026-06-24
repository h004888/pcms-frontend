// =====================================================
// /tra-cuu-thuoc/[slug] — SHOP-LOOKUP-DRUG detail (real API)
// /api/v1/shop/pdp/:id (customer-portal-service)
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Pill,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  Package,
} from 'lucide-react';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { formatVND } from '@/lib/shop/format';
import { fetchShopPDP, searchShop } from '@/features/shop';

interface PageProps {
  params: { slug: string };
}

interface ProductDetailLite {
  id: string;
  name: string;
  sku?: string;
  brand?: string;
  country?: string;
  manufacturer?: string;
  unit?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  shortDescription?: string;
  description?: string;
  ingredients?: string;
  usage?: string;
  dosage?: string;
  sideEffects?: string;
  storage?: string;
  expiryMonths?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  prescriptionRequired?: boolean;
  tags?: string[];
}

async function loadProduct(slug: string): Promise<ProductDetailLite | null> {
  try {
    // Try PDP by id/slug first
    const pdp = await fetchShopPDP(slug);
    if (pdp && typeof pdp === 'object') {
      return pdp as ProductDetailLite;
    }
  } catch {
    // fallback: search then match
    try {
      const search = await searchShop(slug);
      const found = search.products.find(
        (p) => p.slug === slug || p.id === slug
      );
      if (found) {
        return {
          id: found.id,
          name: found.name,
          price: found.price,
          manufacturer: found.manufacturer,
        };
      }
    } catch {
      return null;
    }
  }
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await loadProduct(params.slug);
  if (!product) return { title: 'Không tìm thấy' };
  return {
    title: `${product.name} — Tra cứu`,
    description: product.shortDescription ?? product.description ?? product.name,
  };
}

export default async function TraCuuThuocDetailPage({ params }: PageProps) {
  const product = await loadProduct(params.slug);
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
                {product.brand ?? product.manufacturer ?? '—'}
                {product.country && ` · ${product.country}`}
                {product.sku && (
                  <>
                    {' · '}
                    <span className="font-mono">SKU: {product.sku}</span>
                  </>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.stockStatus && (
                  <Badge variant={stockVariant}>
                    {product.stockStatus === 'in_stock'
                      ? 'Còn hàng'
                      : product.stockStatus === 'low_stock'
                        ? 'Sắp hết'
                        : 'Hết hàng'}
                  </Badge>
                )}
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
        <section className="grid sm:grid-cols-3 gap-3" aria-label="Thông tin nhanh">
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1">Giá tham khảo</p>
            <p className="text-xl font-bold text-accent-700 font-mono">
              {formatVND(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-ink-400 line-through font-mono mt-0.5">
                {formatVND(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1 flex items-center gap-1">
              <Package className="w-3 h-3" aria-hidden="true" /> Đơn vị
            </p>
            <p className="text-sm font-medium text-ink-900">
              {product.unit ?? '—'}
            </p>
          </div>
          <div className="p-4 bg-white border border-ink-200 rounded-md">
            <p className="text-xs text-ink-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" /> Hạn dùng
            </p>
            <p className="text-sm font-medium text-ink-900">
              {product.expiryMonths ? `${product.expiryMonths} tháng từ NSX` : '—'}
            </p>
          </div>
        </section>

        {product.shortDescription && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Mô tả ngắn</h2>
            <p className="text-sm text-ink-700 text-pretty">
              {product.shortDescription}
            </p>
          </section>
        )}

        {product.description && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">
              Thông tin chi tiết
            </h2>
            <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line text-pretty">
              {product.description}
            </p>
          </section>
        )}

        {product.ingredients && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Thành phần</h2>
            <p className="text-sm text-ink-700 text-pretty">{product.ingredients}</p>
            {product.manufacturer && (
              <p className="mt-2 text-xs text-ink-500">
                Sản xuất bởi: {product.manufacturer}
              </p>
            )}
          </section>
        )}

        {(product.usage || product.dosage || product.sideEffects) && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">
              Công dụng & Liều dùng
            </h2>
            <dl className="space-y-3">
              {product.usage && (
                <div>
                  <dt className="text-sm font-medium text-ink-900">Công dụng</dt>
                  <dd className="text-sm text-ink-700 text-pretty">{product.usage}</dd>
                </div>
              )}
              {product.dosage && (
                <div>
                  <dt className="text-sm font-medium text-ink-900">Liều dùng</dt>
                  <dd className="text-sm text-ink-700 text-pretty">{product.dosage}</dd>
                </div>
              )}
              {product.sideEffects && (
                <div>
                  <dt className="text-sm font-medium text-warning-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" aria-hidden="true" /> Tác dụng phụ
                  </dt>
                  <dd className="text-sm text-ink-700 text-pretty">
                    {product.sideEffects}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {product.storage && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-2">Bảo quản</h2>
            <p className="text-sm text-ink-700 text-pretty">{product.storage}</p>
          </section>
        )}

        <div className="flex justify-between items-center text-sm">
          <Link href="/tra-cuu-thuoc" className="text-accent-700 hover:underline">
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