// =====================================================
// /he-thong-cua-hang/[province]/[id] — STORE-DETAIL
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PROVINCES, getStoreById, getStoresByProvince } from '@/data/shop/stores';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

interface PageProps {
  params: { province: string; id: string };
}

export function generateStaticParams() {
  const params: Array<{ province: string; id: string }> = [];
  PROVINCES.forEach((p) => {
    getStoresByProvince(p.slug).forEach((s) => {
      params.push({ province: p.slug, id: s.id });
    });
  });
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const store = getStoreById(params.id);
  if (!store) return { title: 'Không tìm thấy' };
  return { title: store.name, description: `${store.name} — ${store.address}` };
}

export default function StoreDetailPage({ params }: PageProps) {
  const store = getStoreById(params.id);
  if (!store) notFound();

  const lat = store.lat;
  const lng = store.lng;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang' },
              { label: store.provinceName, href: `/he-thong-cua-hang/${store.province}` },
              { label: store.name },
            ]}
          />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {store.isFlagship && (
              <span className="px-2 h-5 bg-accent-600 text-white text-[10px] font-bold rounded uppercase">
                Flagship
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {store.name}
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">
            {store.address}, {store.district}, {store.provinceName}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
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
        </div>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <Clock className="w-4 h-4" aria-hidden="true" /> Giờ mở cửa
          </h2>
          <div className="grid grid-cols-7 gap-2 text-xs">
            {store.hours.map((h) => (
              <div
                key={h.day}
                className="flex flex-col items-center p-2 bg-ink-50 rounded"
              >
                <span className="font-semibold text-ink-700">{h.day}</span>
                <span className="mt-0.5 text-ink-600 font-mono">
                  {h.open}–{h.close}
                </span>
              </div>
            ))}
          </div>
        </section>

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