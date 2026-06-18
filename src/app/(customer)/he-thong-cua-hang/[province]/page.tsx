// =====================================================
// /he-thong-cua-hang/[province] — STORE-LIST-PROVINCE
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PROVINCES, getStoresByProvince } from '@/data/shop/stores';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

interface PageProps {
  params: { province: string };
}

export function generateStaticParams() {
  return PROVINCES.map((p) => ({ province: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const p = PROVINCES.find((x) => x.slug === params.province);
  return {
    title: p ? `Nhà thuốc tại ${p.name}` : 'Không tìm thấy tỉnh',
    description: 'Danh sách nhà thuốc PCMS theo tỉnh thành.',
  };
}

export default function StoreListProvincePage({ params }: PageProps) {
  const province = PROVINCES.find((p) => p.slug === params.province);
  if (!province) notFound();

  const stores = getStoresByProvince(params.province);

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang' },
              { label: province.name },
            ]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Nhà thuốc tại {province.name}
          </h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">
            {stores.length} nhà thuốc
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/he-thong-cua-hang/${store.province}/${store.id}`}
            className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent-700" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-ink-900">{store.name}</p>
                  {store.isFlagship && (
                    <span className="px-1.5 h-5 bg-accent-600 text-white text-[10px] font-bold rounded uppercase">
                      Flagship
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-ink-600">{store.address}, {store.district}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" aria-hidden="true" />
                    {store.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    06:00 — 23:00
                  </span>
                  <span className="flex items-center gap-1 flex-wrap">
                    {store.services.map((s) => (
                      <span
                        key={s}
                        className="px-1.5 h-5 inline-flex items-center bg-info-50 text-info-700 text-[10px] font-medium rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}