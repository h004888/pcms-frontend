// =====================================================
// /flash-sale/[id] — SHOP-FLASH-SALE detail (polished)
// Big countdown + product grid
// =====================================================

import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Zap, Tag, Clock } from 'lucide-react';
import { PRODUCTS } from '@/data/shop/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { FlashSaleCountdown } from '@/components/shop/FlashSaleCountdown';
import type { Metadata } from 'next';

const NOW = Date.now();
const hour = 3600 * 1000;

const FLASH_SALES = [
  {
    id: 'fs-1',
    title: 'Vitamin & TPCN giảm đến 50%',
    startTime: new Date(NOW + 24 * hour).toISOString(),
    endTime: new Date(NOW + 27 * hour).toISOString(),
    productSlugs: ['vitamin-c-1000-mg-30', 'omega-3-1000-mg-60', 'cal-d3-600-mg-60'],
  },
  {
    id: 'fs-2',
    title: 'Thuốc cảm cúm — Flash 3 giờ',
    startTime: new Date(NOW - 30 * 60 * 1000).toISOString(),
    endTime: new Date(NOW + 2.5 * hour).toISOString(),
    productSlugs: ['paracetamol-500-mg-20', 'ibuprofen-400mg', 'cetirizine-10mg'],
  },
];

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return FLASH_SALES.map((fs) => ({ id: fs.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const fs = FLASH_SALES.find((x) => x.id === params.id);
  return { title: fs?.title ?? 'Flash sale', description: fs?.title };
}

export default function FlashSaleDetailPage({ params }: PageProps) {
  const fs = FLASH_SALES.find((x) => x.id === params.id);
  if (!fs) notFound();

  const products = PRODUCTS.filter((p) => fs.productSlugs.includes(p.slug));

  return (
    <>
      <div className="bg-gradient-to-br from-danger-500 to-warning-500 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Flash sale', href: '/flash-sale' }, { label: fs.title }]} className="text-white/80" />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-white text-danger-600 text-xs font-bold rounded-full">
            <Zap className="w-3 h-3" aria-hidden="true" />
            FLASH SALE
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-balance">{fs.title}</h1>

          {/* Big countdown */}
          <div className="mt-4">
            <FlashSaleCountdown
              startTime={fs.startTime}
              endTime={fs.endTime}
              variant="block"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-white/90 flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {new Date(fs.startTime).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
              {' → '}
              {new Date(fs.endTime).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" aria-hidden="true" />
              {products.length} sản phẩm
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-sm text-ink-500 py-8">
            Sản phẩm sẽ được cập nhật khi flash sale bắt đầu.
          </p>
        )}
      </div>
    </>
  );
}