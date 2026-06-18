// =====================================================
// ShopHomeStoreLocator — Banner tìm nhà thuốc (vivid edition)
// Layout phá vỡ "1 cột text + 1 cột map":
//   • Trái (60%): copy + CTA + 3 mini-stat
//   • Phải (40%): map placeholder với mock markers động
//   • Background: gradient nhẹ
// =====================================================

import Link from 'next/link';
import { MapPin, ArrowRight, Navigation, Clock, Phone } from 'lucide-react';

const MOCK_BRANCHES = [
  { name: 'Quận 1 — 35 Nguyễn Huệ', dist: '0.8 km' },
  { name: 'Quận 3 — 184 Lê Văn Sỹ', dist: '1.5 km' },
  { name: 'Quận 7 — 102 Nguyễn Văn Linh', dist: '3.2 km' },
];

export function ShopHomeStoreLocator() {
  return (
    <section
      className="relative bg-gradient-to-br from-success-50 via-white to-info-50 py-12 md:py-16"
      aria-labelledby="store-locator-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          {/* Left: copy + CTA + stats */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-700 mb-2">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              2.678 nhà thuốc trên toàn quốc
            </div>
            <h2
              id="store-locator-title"
              className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance leading-tight"
            >
              Hệ thống nhà thuốc gần bạn
            </h2>
            <p className="mt-3 text-sm md:text-base text-ink-600 text-pretty max-w-xl">
              Tra cứu nhà thuốc, xem tồn kho theo chi nhánh, đặt lịch nhận thuốc — tất cả trong 1 cú click.
            </p>

            {/* Mini stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
              <div className="p-3 bg-white border border-ink-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-success-700 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  24/7
                </div>
                <p className="mt-1 text-xs text-ink-600">Mở cửa cả đêm</p>
              </div>
              <div className="p-3 bg-white border border-ink-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-info-700 text-xs font-semibold">
                  <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                  5 km
                </div>
                <p className="mt-1 text-xs text-ink-600">Bán kính trung bình</p>
              </div>
              <div className="p-3 bg-white border border-ink-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-accent-700 text-xs font-semibold">
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  Gọi
                </div>
                <p className="mt-1 text-xs text-ink-600">Đặt lịch tư vấn</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/he-thong-cua-hang"
                className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-ink-900 text-white text-sm font-semibold rounded-md hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                Tìm nhà thuốc gần bạn
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/he-thong-cua-hang/ho-chi-minh"
                className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-white text-ink-700 text-sm font-semibold rounded-md border border-ink-200 hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Hồ Chí Minh
              </Link>
            </div>
          </div>

          {/* Right: map placeholder với mock markers */}
          <div className="relative h-72 md:h-80 bg-gradient-to-br from-info-100 via-white to-success-50 border border-ink-200 rounded-xl overflow-hidden">
            {/* Mock map pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(13, 148, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 148, 136, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Mock pins */}
            {MOCK_BRANCHES.map((b, i) => (
              <div
                key={b.name}
                className="absolute group/pin"
                style={{
                  top: `${20 + i * 25}%`,
                  left: `${15 + i * 28}%`,
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-accent-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="relative w-9 h-9 bg-accent-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg group-hover/pin:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-white fill-current" aria-hidden="true" />
                  </div>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-ink-900 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-ink-300 text-[10px]">{b.dist} · Mở cửa</p>
                </div>
              </div>
            ))}
            {/* Map attribution */}
            <div className="absolute bottom-2 right-2 px-2 h-6 bg-white/80 backdrop-blur border border-ink-200 rounded text-[10px] text-ink-500 font-medium flex items-center">
              Bản đồ tương tác
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
