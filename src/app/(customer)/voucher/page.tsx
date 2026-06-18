// =====================================================
// /voucher — SHOP-VOUCHER
// Kho voucher & mã giảm giá
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Tag, Copy, Calendar, Gift, Check } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voucher của tôi',
  description: 'Mã giảm giá, voucher quà tặng và chương trình khuyến mãi.',
};

const VOUCHERS = [
  {
    id: 'v-1',
    code: 'WELCOME10',
    title: 'Giảm 10% đơn hàng đầu tiên',
    discount: 10,
    discountType: 'percent',
    minSpend: 200000,
    expiresAt: '2026-12-31',
    status: 'available',
  },
  {
    id: 'v-2',
    code: 'FREESHIP50K',
    title: 'Giảm 50K phí vận chuyển',
    discount: 50000,
    discountType: 'fixed',
    minSpend: 300000,
    expiresAt: '2026-08-31',
    status: 'available',
  },
  {
    id: 'v-3',
    code: 'SUMMER25',
    title: 'Giảm 25% thuốc không kê đơn',
    discount: 25,
    discountType: 'percent',
    minSpend: 0,
    expiresAt: '2026-07-31',
    status: 'available',
  },
];

const PROGRAMS = [
  {
    id: 'p-1',
    title: 'Tích điểm đổi quà',
    desc: 'Mỗi 10.000đ chi tiêu = 1 điểm. Đổi 500 điểm = voucher 50K.',
    icon: Gift,
  },
];

export default function VoucherPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Voucher của tôi' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">Voucher</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Mã giảm giá còn hiệu lực và chương trình khuyến mãi
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        <h2 className="text-base font-semibold text-ink-900">
          Voucher khả dụng ({VOUCHERS.length})
        </h2>

        {VOUCHERS.map((v) => (
          <article
            key={v.id}
            className="flex items-stretch bg-white border border-ink-200 rounded-md overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center w-24 bg-accent-600 text-white px-3">
              {v.discountType === 'percent' ? (
                <span className="text-2xl font-bold">-{v.discount}%</span>
              ) : (
                <span className="text-lg font-bold">-{formatVND(v.discount)}</span>
              )}
              <span className="text-xs">OFF</span>
            </div>
            <div className="flex-1 p-4">
              <p className="text-sm font-semibold text-ink-900">{v.title}</p>
              <p className="mt-1 text-xs text-ink-500 font-mono">Mã: {v.code}</p>
              {v.minSpend > 0 && (
                <p className="text-xs text-ink-600 mt-1">
                  Đơn tối thiểu {formatVND(v.minSpend)}
                </p>
              )}
              <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                HSD: {new Date(v.expiresAt).toLocaleDateString('vi-VN')}
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 px-2.5 h-7 text-xs font-medium bg-accent-50 text-accent-700 rounded hover:bg-accent-100"
              >
                <Copy className="w-3 h-3" aria-hidden="true" />
                Sao chép mã
              </button>
            </div>
          </article>
        ))}

        <h2 className="text-base font-semibold text-ink-900 mt-6">
          Chương trình ưu đãi
        </h2>
        {PROGRAMS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="p-4 bg-success-50 border border-success-200 rounded-md flex items-start gap-3"
            >
              <div className="w-10 h-10 bg-success-600 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-success-900">{p.title}</h3>
                <p className="mt-1 text-sm text-success-800">{p.desc}</p>
              </div>
            </div>
          );
        })}

        <div className="p-4 bg-info-50 border border-info-200 rounded-md text-xs text-info-800 flex items-start gap-2">
          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Áp dụng voucher khi thanh toán. Mỗi đơn chỉ dùng được 1 voucher.
          </p>
        </div>
      </div>
    </>
  );
}