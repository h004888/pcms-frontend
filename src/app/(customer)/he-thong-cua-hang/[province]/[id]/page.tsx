// =====================================================
// /he-thong-cua-hang/[province]/[id] — STORE-DETAIL (real API)
// /api/v1/store/locator/:branchId
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { fetchStoreDetail } from '@/features/stores';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

interface PageProps {
  params: Promise<{ province: string; id: string }>;
}

async function loadStore(id: string) {
  try {
    return await fetchStoreDetail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const store = await loadStore((await params).id);
  if (!store) return { title: 'Không tìm thấy' };
  return { title: store.name, description: `${store.name} — ${store.address}` };
}

export default async function StoreDetailPage({ params }: PageProps) {
  const store = await loadStore((await params).id);
  if (!store) notFound();

  const lat = store.latitude ?? 0;
  const lng = store.longitude ?? 0;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang' },
              {
                label: store.province ?? (await params).province,
                href: `/he-thong-cua-hang/${(await params).province}`,
              },
              { label: store.name },
            ]}
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {store.name}
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">
            {store.address}
            {store.district && `, ${store.district}`}
            {store.province && `, ${store.province}`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {store.phone && (
            <a
              href={`tel:${store.phone}`}
              className="flex items-center gap-3 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
            >
              <Phone className="w-5 h-5 text-accent-600 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-ink-500">Điện thoại</p>
                <p className="text-sm font-mono font-medium text-ink-900">{store.phone}</p>
              </div>
            </a>
          )}
          {lat !== 0 && lng !== 0 && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
            >
              <Navigation className="w-5 h-5 text-accent-600 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-ink-500">Chỉ đường</p>
                <p className="text-sm font-medium text-accent-700">Mở Google Maps →</p>
              </div>
            </a>
          )}
        </div>

        {store.openingHours && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
              <Clock className="w-4 h-4" aria-hidden="true" /> Giờ mở cửa
            </h2>
            <p className="text-sm text-ink-700 font-mono">{store.openingHours}</p>
          </section>
        )}

        {store.services && store.services.length > 0 && (
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <h2 className="text-base font-semibold text-ink-900 mb-3">Dịch vụ</h2>
            <div className="flex gap-2 flex-wrap">
              {store.services.map((s) => (
                <span
                  key={s}
                  className="px-3 h-7 inline-flex items-center bg-success-50 text-success-700 text-xs font-medium rounded-full capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="p-5 bg-ink-50 border border-ink-200 rounded-md text-center">
          <MapPin className="w-8 h-8 mx-auto text-ink-400" aria-hidden="true" />
          <p className="mt-2 text-xs text-ink-500 font-mono">
            Tọa độ: {lat}, {lng}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            Bản đồ tương tác sẽ tích hợp trong phiên bản tiếp theo.
          </p>
        </div>
      </div>
    </>
  );
}