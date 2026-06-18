// =====================================================
// ShopTrustStrip — Trust signals ngay sau hero
// Phá vỡ pattern "4 thẻ icon + heading + text" identical:
//   • 3 stat cards (số liệu thật) bên trái
//   • 1 CTA hotline lớn bên phải
// Mục đích: dược sĩ / khách hàng thấy uy tín ngay khi vào trang.
// =====================================================

import { Phone, Award, Users, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { icon: Building2, value: '2.678', label: 'Nhà thuốc', accent: 'text-accent-700' },
  { icon: Users, value: '12.4M', label: 'Khách phục vụ / năm', accent: 'text-info-700' },
  { icon: Award, value: '20+', label: 'Năm uy tín ngành dược', accent: 'text-success-700' },
];

export function ShopTrustStrip() {
  return (
    <section
      className="border-y border-ink-200 bg-white"
      aria-label="Uy tín và hỗ trợ"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-ink-50 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${s.accent}`} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg md:text-2xl font-bold text-ink-900 font-mono leading-none">
                      {s.value}
                    </p>
                    <p className="text-xs text-ink-500 mt-1 line-clamp-2">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hotline CTA — visually distinct */}
          <a
            href="tel:18006928"
            className="group flex items-center gap-4 p-4 md:p-5 bg-gradient-to-br from-accent-600 to-accent-700 text-white rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
          >
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/15 backdrop-blur rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-accent-100 font-medium">Hotline tư vấn miễn phí</p>
              <p className="text-2xl md:text-3xl font-bold font-mono tracking-tight">1800 6928</p>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" aria-hidden="true" />
          </a>
        </div>

        {/* Certifications row */}
        <div className="mt-5 pt-5 border-t border-ink-200 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink-700">
            <ShieldCheck className="w-4 h-4 text-success-600" aria-hidden="true" />
            Đã đăng ký Bộ Y tế
          </span>
          <span className="hidden sm:inline text-ink-300">·</span>
          <span>Đã thông báo Bộ Công Thương</span>
          <span className="hidden sm:inline text-ink-300">·</span>
          <span>Đạt chuẩn GDP thuốc</span>
          <span className="hidden sm:inline text-ink-300">·</span>
          <span>Chứng nhận ISO 9001:2015</span>
        </div>
      </div>
    </section>
  );
}
