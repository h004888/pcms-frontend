// =====================================================
// /he-thong-cua-hang/[province] — STORE-LIST-PROVINCE (real API)
// /api/v1/store/locator?province=...
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { fetchStores } from '@/features/stores';
import type { StoreLocation } from '@/features/stores';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/Feedback';

interface PageProps {
  params: { province: string };
}

const PROVINCE_NAMES: Record<string, string> = {
  'tp-hcm': 'TP. Hồ Chí Minh',
  'ha-noi': 'Hà Nội',
  'da-nang': 'Đà Nẵng',
  'hai-phong': 'Hải Phòng',
  'can-tho': 'Cần Thơ',
  'binh-duong': 'Bình Dương',
  'dong-nai': 'Đồng Nai',
};

async function loadStoresByProvince(slug: string): Promise<{
  stores: StoreLocation[];
  provinceName: string;
}> {
  try {
    const res = await fetchStores();
    const stores = res.stores.filter((s) => {
      if (!s.province) return false;
      const normalized = s.province.toLowerCase().replace(/\s+/g, '-');
      return normalized.includes(slug) || slug.includes(normalized);
    });
    return { stores, provinceName: PROVINCE_NAMES[slug] ?? slug };
  } catch {
    return { stores: [], provinceName: PROVINCE_NAMES[slug] ?? slug };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provinceName } = await loadStoresByProvince(params.province);
  return {
    title: `Nhà thuốc tại ${provinceName}`,
    description: 'Danh sách nhà thuốc PCMS theo tỉnh thành.',
  };
}

export default async function StoreListProvincePage({ params }: PageProps) {
  const { stores, provinceName } = await loadStoresByProvince(params.province);

  if (!provinceName && stores.length === 0) notFound();

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang' },
              { label: provinceName },
            ]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Nhà thuốc tại {provinceName}
          </h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">
            {stores.length} nhà thuốc
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {stores.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Chưa có nhà thuốc"
            description={`Hệ thống chưa có nhà thuốc nào tại ${provinceName}.`}
          />
        ) : (
          stores.map((store) => (
            <Link
              key={store.id}
              href={`/he-thong-cua-hang/${params.province}/${store.id}`}
              className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent-700" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{store.name}</p>
                  <p className="mt-0.5 text-xs text-ink-600">{store.address}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-500 flex-wrap">
                    {store.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" aria-hidden="true" />
                        {store.phone}
                      </span>
                    )}
                    {store.openingHours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {store.openingHours}
                      </span>
                    )}
                    {store.services && store.services.length > 0 && (
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
                    )}
                  </div>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-ink-400 flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}