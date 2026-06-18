// =====================================================
// /he-thong-cua-hang — STORE-LOCATOR
// Tra cứu nhà thuốc theo tỉnh/quận
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PROVINCES, STORES } from '@/data/shop/stores';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hệ thống nhà thuốc',
  description: 'Tra cứu nhà thuốc PCMS gần bạn trên toàn quốc.',
};

export default function HeThongCuaHangPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Hệ thống nhà thuốc' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-success-600 text-white text-xs font-semibold rounded-full">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            {STORES.length} nhà thuốc
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Hệ thống nhà thuốc PCMS
          </h1>
          <p className="mt-2 text-base text-ink-600 text-pretty">
            Tra cứu nhà thuốc theo tỉnh thành, xem giờ mở cửa, dịch vụ và đường đi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-ink-900 mb-3">Chọn tỉnh thành</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {PROVINCES.map((p) => (
              <Link
                key={p.slug}
                href={`/he-thong-cua-hang/${p.slug}`}
                className="group flex items-center justify-between p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                  <p className="mt-0.5 text-xs text-ink-500 font-mono">
                    {p.count} nhà thuốc
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-accent-600" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink-900 mb-3">
            Nhà thuốc nổi bật
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STORES.filter((s) => s.isFlagship).map((store) => (
              <Link
                key={store.id}
                href={`/he-thong-cua-hang/${store.province}/${store.id}`}
                className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{store.name}</p>
                    <p className="text-xs text-ink-500">{store.address}, {store.district}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-ink-600">
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3" aria-hidden="true" />
                    {store.phone}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    06:00 — 23:00 hằng ngày
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}