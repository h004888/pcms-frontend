// =====================================================
// /flash-sale — SHOP-FLASH-SALE list (real API)
// /api/v1/ecom-ops/flash-sales/active + /admin/flash-sales
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Zap, ArrowRight, Tag } from 'lucide-react';
import { FlashSaleCountdown } from '@/components/shop/FlashSaleCountdown';
import { fetchFlashSalesActive } from '@/features/flash-sales';
import { apiClient } from '@/lib/api';
import type { FlashSale } from '@/features/flash-sales';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flash sale',
  description: 'Khuyến mãi giờ vàng — giảm giá sốc trong thời gian giới hạn.',
};

async function loadAll(): Promise<FlashSale[]> {
  try {
    const res = await apiClient.get<{ sales?: FlashSale[] } | FlashSale[]>(
      '/admin/flash-sales'
    );
    const body = res.data;
    if (Array.isArray(body)) return body;
    return body?.sales ?? [];
  } catch {
    try {
      const active = await fetchFlashSalesActive();
      return active;
    } catch {
      return [];
    }
  }
}

export default async function FlashSaleListPage() {
  const flashSales = await loadAll();

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
        {flashSales.length === 0 ? (
          <p className="text-sm text-ink-500 py-6 text-center">
            Chưa có flash sale nào đang diễn ra.
          </p>
        ) : (
          flashSales.map((fs) => {
            const startTime = fs.startTime ?? new Date().toISOString();
            const endTime = fs.endTime ?? new Date(Date.now() + 86400000).toISOString();
            const discount = fs.products?.reduce(
              (max, p) => Math.max(max, p.discountPercent ?? 0),
              0
            ) ?? 0;
            return (
              <Link
                key={fs.id}
                href={`/flash-sale/${fs.id}`}
                className="block p-4 bg-white border border-ink-200 rounded-md hover:border-danger-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {discount > 0 && (
                        <span className="px-2 h-6 bg-danger-50 text-danger-700 text-xs font-bold rounded uppercase">
                          -{discount}%
                        </span>
                      )}
                      <FlashSaleCountdown
                        startTime={startTime}
                        endTime={endTime}
                        variant="inline"
                      />
                    </div>
                    <h2 className="text-base font-semibold text-ink-900 text-balance mt-1">
                      {fs.name ?? `Flash sale #${fs.id}`}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-xs text-ink-600 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        {new Date(startTime).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                        {' → '}
                        {new Date(endTime).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                      {fs.products && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" aria-hidden="true" />
                          {fs.products.length} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-ink-400 flex-shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}