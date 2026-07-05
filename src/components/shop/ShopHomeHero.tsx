// =====================================================
// ShopHomeHero — Hero trang chủ (compact, merged trust strip)
// ink-900 solid bg · search bar · quick-action pills · 3 stats
// =====================================================

import Link from 'next/link';
import { Search, FileText, MessageCircle, MapPin, Calendar, Stethoscope, Building2, Users, Award } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search },
  { label: 'Đặt thuốc theo toa', href: '/upload-toa', icon: FileText },
  { label: 'Tư vấn dược sĩ', href: '/ai/chat', icon: MessageCircle },
  { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin },
  { label: 'Tiêm chủng', href: '/tiem-chung', icon: Calendar },
  { label: 'Bài kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra', icon: Stethoscope },
];

const STATS = [
  { icon: Building2, value: '2.678', label: 'Nhà thuốc', accent: 'text-accent-400' },
  { icon: Users, value: '12.4M', label: 'Khách phục vụ / năm', accent: 'text-info-400' },
  { icon: Award, value: '20+', label: 'Năm uy tín', accent: 'text-success-400' },
];

export function ShopHomeHero() {
  return (
    <section className="relative bg-ink-900 text-white overflow-hidden" aria-labelledby="hero-title">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-accent-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400" aria-hidden="true" />
            PCMS — Dành cho dược sĩ
          </div>

          <h1 id="hero-title" className="text-3xl md:text-4xl font-bold tracking-tight text-balance leading-tight">
            Tra cứu thuốc, kê đơn, quản lý tồn kho
          </h1>

          <p className="mt-3 text-sm md:text-base text-ink-300 text-pretty max-w-xl mx-auto">
            Công cụ làm việc hằng ngày cho dược sĩ: tra cứu nhanh, kê đơn an toàn, POS tiện lợi — đồng bộ toàn chuỗi nhà thuốc.
          </p>

          <form action="/tim-kiem" method="get" role="search" className="mt-6 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search" name="q"
                placeholder="Tìm theo tên thuốc, hoạt chất, triệu chứng..."
                aria-label="Tra cứu sản phẩm"
                className="w-full h-11 pl-10 pr-28 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-colors"
              />
              <button type="submit" className="press absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3.5 bg-accent-600 text-white text-xs font-semibold rounded hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
                Tìm kiếm
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-400">
              <span>Phổ biến:</span>
              {['Paracetamol', 'Vitamin C', 'Omega-3', 'Khẩu trang', 'Siro ho'].map((kw) => (
                <Link key={kw} href={`/tim-kiem?q=${encodeURIComponent(kw)}`}
                  className="press-sm px-2.5 h-6 inline-flex items-center bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-ink-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </form>

          {/* Quick actions — pills uniform */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}
                  className="press inline-flex items-center gap-1.5 px-3.5 h-9 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <Icon className="w-3.5 h-3.5 text-accent-300" aria-hidden="true" />
                  {action.label}
                </Link>
              );
            })}
          </div>

          {/* Stats — merged from TrustStrip */}
          <div className="mt-8 pt-6 border-t border-ink-800">
            <div className="flex items-center justify-center gap-6 md:gap-10">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${s.accent}`} aria-hidden="true" />
                    <div className="text-left">
                      <p className="text-sm font-bold font-mono leading-none text-white">{s.value}</p>
                      <p className="text-[10px] text-ink-400 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
