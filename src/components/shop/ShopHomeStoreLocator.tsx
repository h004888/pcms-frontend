// =====================================================
// ShopHomeStoreLocator — Banner tìm nhà thuốc
// PCMS portal nội bộ: link vào hệ thống nhà thuốc, không marketing
// =====================================================

import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

export function ShopHomeStoreLocator() {
  return (
    <section
      className="bg-gradient-to-br from-success-50 to-success-100/50 py-10"
      aria-labelledby="store-locator-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 h-6 bg-success-600 text-white text-xs font-semibold rounded-full mb-2">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              Quản lý chuỗi
            </div>
            <h2
              id="store-locator-title"
              className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance"
            >
              Hệ thống nhà thuốc trên toàn quốc
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink-600 text-pretty">
              Tra cứu nhà thuốc gần bạn, tình trạng tồn kho theo chi nhánh,
              lịch sử đơn hàng từng cửa hàng.
            </p>
            <div className="mt-6">
              <Link
                href="/he-thong-cua-hang"
                className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-success-600 text-white text-sm font-semibold rounded-md hover:bg-success-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Tra cứu nhà thuốc
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="relative h-64 bg-white border border-ink-200 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-br from-success-100 to-info-100 flex items-center justify-center"
              aria-label="Bản đồ nhà thuốc (placeholder)"
            >
              <MapPin className="w-12 h-12 text-success-600" aria-hidden="true" />
              <p className="ml-3 text-sm font-medium text-ink-700">Bản đồ tương tác</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
