// =====================================================
// /flash-sale — SHOP-FLASH-SALE list
// Danh sách chương trình flash sale
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Zap, Clock, ArrowRight, Tag } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flash sale',
  description: 'Khuyến mãi giờ vàng — giảm giá sốc trong thời gian giới hạn.',
};

const FLASH_SALES = [
  {
    id: 'fs-1',
    title: 'Vitamin & TPCN giảm đến 50%',
    startTime: '2026-06-20 09:00',
    endTime: '2026-06-20 12:00',
    productCount: 24,
    maxDiscount: 50,
    status: 'upcoming',
  },
  {
    id: 'fs-2',
    title: 'Thuốc cảm cúm — Flash 3 giờ',
    startTime: '2026-06-18 14:00',
    endTime: '2026-06-18 17:00',
    productCount: 12,
    maxDiscount: 35,
    status: 'live',
  },
  {
    id: 'fs-3',
    title: 'Chăm sóc da mùa hè',
    startTime: '2026-06-15 09:00',
    endTime: '2026-06-15 18:00',
    productCount: 18,
    maxDiscount: 40,
    status: 'ended',
  },
];

const STATUS_BADGE = {
  upcoming: { label: 'Sắp diễn ra', class: 'bg-info-100 text-info-700' },
  live: { label: 'ĐANG DIỄN RA', class: 'bg-danger-600 text-white' },
  ended: { label: 'Đã kết thúc', class: 'bg-ink-100 text-ink-700' },
} as const;

export default function FlashSaleListPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-danger-500 to-warning-500 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Flash sale' }]} className="text-white/80" />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-white text-danger-600 text-xs font-bold rounded-full">
            <Zap className="w-3 h-3" aria-hidden="true" />
            FLASH SALE
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-balance">
            Khuyến mãi giờ vàng
          </h1>
          <p className="mt-1 text-base text-white/90 text-pretty">
            Giảm giá sốc trong thời gian giới hạn — nhanh tay kẻo lỡ!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {FLASH_SALES.map((fs) => {
          const badge = STATUS_BADGE[fs.status as keyof typeof STATUS_BADGE];
          return (
            <Link
              key={fs.id}
              href={`/flash-sale/${fs.id}`}
              className="block p-4 bg-white border border-ink-200 rounded-md hover:border-danger-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 h-5 inline-flex items-center text-xs font-bold rounded ${badge.class}`}
                    >
                      {badge.label}
                    </span>
                    <span className="px-2 h-5 bg-danger-50 text-danger-700 text-xs font-bold rounded uppercase">
                      -{fs.maxDiscount}%
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-ink-900 text-balance">
                    {fs.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-600 flex-wrap">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {new Date(fs.startTime).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                      {' → '}
                      {new Date(fs.endTime).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" aria-hidden="true" />
                      {fs.productCount} sản phẩm
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}