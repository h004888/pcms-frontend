// =====================================================
// /rx-console/cross-sell — RX-CROSS-SELL
// Đề xuất sản phẩm liên quan cho khách
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Package, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cross-sell',
  description: 'Đề xuất sản phẩm liên quan theo lịch sử mua hàng.',
};

// Mock: 1 customer vừa mua Paracetamol → đề xuất Vitamin C, Omega-3, Vitamin D
const MOCK_HISTORY = ['paracetamol-500-mg-20'];
const RECOMMENDED = PRODUCTS.filter((p) =>
  ['vitamin-c-1000-mg-30', 'omega-3-1000-mg-60', 'cal-d3-600-mg-60'].includes(p.slug)
);

export default function CrossSellPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Cross-sell' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Đề xuất sản phẩm</h1>
          <p className="text-sm text-ink-600 mt-1">Sản phẩm liên quan cho đơn hàng hiện tại</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="p-5 bg-ink-50 border border-ink-200 rounded-md">
          <h2 className="text-sm font-semibold text-ink-900 mb-2 flex items-center gap-1.5">
            <Package className="w-4 h-4" aria-hidden="true" />
            Khách vừa mua
          </h2>
          <div className="flex gap-2 flex-wrap">
            {MOCK_HISTORY.map((slug) => {
              const p = PRODUCTS.find((x) => x.slug === slug);
              return p ? (
                <span
                  key={slug}
                  className="px-3 h-8 inline-flex items-center bg-white border border-ink-200 rounded-md text-sm"
                >
                  {p.name}
                </span>
              ) : null;
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-600" aria-hidden="true" />
            Đề xuất cho khách
          </h2>
          <div className="space-y-2">
            {RECOMMENDED.map((p, idx) => (
              <article
                key={p.id}
                className="flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <span className="w-7 h-7 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-500">{p.shortDescription}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-accent-700 font-mono">
                    {formatVND(p.price)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <div className="p-4 bg-info-50 border border-info-200 rounded-md text-xs text-info-800">
          💡 Thuật toán: dựa trên sản phẩm thường được mua cùng + lịch sử cá nhân + tương đồng nhóm điều trị.
        </div>
      </div>
    </>
  );
}