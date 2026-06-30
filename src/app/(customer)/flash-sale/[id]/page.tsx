// =====================================================
// /flash-sale/[id] — SHOP-FLASH-SALE detail (real API)
// /api/v1/ecom-ops/flash-sales/:id
// =====================================================

import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Zap, Clock } from 'lucide-react';
import { FlashSaleCountdown } from '@/components/shop/FlashSaleCountdown';
import { fetchFlashSaleDetail } from '@/features/flash-sales';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadFlashSale(id: string) {
  try {
    return await fetchFlashSaleDetail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const fs = await loadFlashSale((await params).id);
  return {
    title: fs?.name ?? 'Flash sale',
    description: fs?.name,
  };
}

export default async function FlashSaleDetailPage({ params }: PageProps) {
  const fs = await loadFlashSale((await params).id);
  if (!fs) notFound();

  const startTime = fs.startTime ?? new Date().toISOString();
  const endTime = fs.endTime ?? new Date(Date.now() + 86400000).toISOString();

  return (
    <>
      <div className="bg-gradient-to-br from-danger-500 to-warning-500 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb
            items={[
              { label: 'Flash sale', href: '/flash-sale' },
              { label: fs.name ?? 'Chi tiết' },
            ]}
            className="text-white/80"
          />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-white text-danger-600 text-xs font-bold rounded-full">
            <Zap className="w-3 h-3" aria-hidden="true" />
            FLASH SALE
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-balance">
            {fs.name ?? `Flash sale #${fs.id}`}
          </h1>

          <div className="mt-4">
            <FlashSaleCountdown
              startTime={startTime}
              endTime={endTime}
              variant="block"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-white/90 flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-4 h-4" aria-hidden="true" />
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
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {fs.products && fs.products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fs.products.map((p) => (
              <article
                key={p.id}
                className="p-4 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink-900 text-balance">
                    {p.name}
                  </h3>
                  <span className="px-2 h-5 bg-danger-600 text-white text-[10px] font-bold rounded uppercase flex-shrink-0">
                    -{p.discountPercent}%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-accent-700 font-mono">
                    {formatVND(p.price)}
                  </span>
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="text-xs text-ink-400 line-through font-mono">
                      {formatVND(p.oldPrice)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-500 py-6 text-center">
            Chưa có sản phẩm nào trong flash sale này.
          </p>
        )}
      </div>
    </>
  );
}