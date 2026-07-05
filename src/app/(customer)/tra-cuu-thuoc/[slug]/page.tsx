'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Pill, AlertTriangle, FileText, Building2, Calendar, Package,
} from 'lucide-react';
import { LookupNav } from '@/components/shop/LookupNav';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Card';
import { formatVND } from '@/lib/shop/format';

const API_BASE = 'http://localhost:8080/api/v1';

interface ProductDetailLite {
  id: string; name: string; sku?: string; brand?: string; country?: string;
  manufacturer?: string; unit?: string; price: number; originalPrice?: number;
  discountPercent?: number; shortDescription?: string; description?: string;
  ingredients?: string; usage?: string; dosage?: string; sideEffects?: string;
  storage?: string; expiryMonths?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  prescriptionRequired?: boolean; tags?: string[];
}

export default function TraCuuThuocDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<ProductDetailLite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const lookupRes = await fetch(`${API_BASE}/shop/lookup/drug?q=${encodeURIComponent(slug)}&size=5`);
        if (!lookupRes.ok) { if (!cancelled) setError(true); return; }
        const lookupData = await lookupRes.json();
        const products = lookupData?.data ?? [];
        const found = products.find((p: any) => p.slug === slug || p.id === slug);
        if (!found?.id) { if (!cancelled) setError(true); return; }

        const pdpRes = await fetch(`${API_BASE}/shop/pdp/${found.id}`);
        if (!pdpRes.ok) { if (!cancelled) setError(true); return; }
        const pdp = await pdpRes.json();
        if (!cancelled) setProduct(pdp as ProductDetailLite);
      } catch { if (!cancelled) setError(true); }
      finally { if (!cancelled) setLoading(false); }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải...</div>;
  if (error || !product) return <div className="p-8 text-center text-slate-500">Không tìm thấy sản phẩm</div>;

  const stockVariant = product.stockStatus === 'in_stock' ? 'success' :
    product.stockStatus === 'low_stock' ? 'warning' : 'danger';

  return (
    <>
      <LookupNav active="tra-cuu-thuoc" />
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc' }, { label: product.name }]} />
          <div className="mt-3 flex items-start gap-3 flex-wrap">
            <Pill className="w-8 h-8 text-accent-600 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-ink-900">{product.name}</h1>
              <p className="mt-2 text-sm text-ink-600">
                <Building2 className="inline w-3.5 h-3.5 mr-1" />
                {product.manufacturer ?? '—'}{product.country && ` · ${product.country}`}
                {product.sku && <span className="font-mono"> · SKU: {product.sku}</span>}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.stockStatus && <Badge variant={stockVariant}>{product.stockStatus === 'in_stock' ? 'Còn hàng' : product.stockStatus === 'low_stock' ? 'Sắp hết' : 'Hết hàng'}</Badge>}
                {product.prescriptionRequired && <Badge variant="warning">⚕️ Thuốc kê đơn</Badge>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 pb-8 space-y-6">
        <section className="grid sm:grid-cols-3 gap-3 mt-6">
          <div className="p-4 bg-white border rounded-md"><p className="text-xs text-ink-500 mb-1">Giá tham khảo</p><p className="text-xl font-bold text-accent-700 font-mono">{formatVND(product.price)}</p></div>
          <div className="p-4 bg-white border rounded-md"><p className="text-xs text-ink-500 mb-1">Đơn vị</p><p className="text-sm font-medium">{product.unit ?? '—'}</p></div>
          <div className="p-4 bg-white border rounded-md"><p className="text-xs text-ink-500 mb-1">Hạn dùng</p><p className="text-sm font-medium">{product.expiryMonths ? `${product.expiryMonths} tháng` : '—'}</p></div>
        </section>
        {product.description && <section className="p-5 bg-white border rounded-md"><h2 className="font-semibold mb-2">Thông tin chi tiết</h2><p className="text-sm whitespace-pre-line">{product.description}</p></section>}
        {product.usage && <section className="p-5 bg-white border rounded-md"><h2 className="font-semibold mb-2">Công dụng</h2><p className="text-sm">{product.usage}</p></section>}
        <div className="flex justify-between text-sm pt-4">
          <Link href="/tra-cuu-thuoc" className="text-accent-700 hover:underline">← Quay lại danh sách thuốc</Link>
          <Link href="/tra-thuoc-chinh-hang" className="text-accent-700 hover:underline"><FileText className="w-4 h-4 inline mr-1" />Xác minh chính hãng</Link>
        </div>
      </div>
    </>
  );
}
