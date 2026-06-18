// =====================================================
// ShopHomeHero — Hero trang chủ B2C (vivid edition)
// Tầng layers (back → front):
//   1. Gradient nền ink-900 → accent-800 (brand surface)
//   2. Subtle dot pattern (texture)
//   3. Ambient color orbs (depth, không shadow)
//   4. Content: badge, H1, search, quick actions
// Tone PCMS portal: dược sĩ, tra cứu, kê đơn, POS
// (không phải marketing Long Châu)
// =====================================================

import Link from 'next/link';
import {
  Search,
  FileText,
  Pill,
  MessageCircle,
  MapPin,
  Calendar,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search, accent: 'from-info-500 to-info-600' },
  { label: 'Đặt thuốc theo toa', href: '/upload-toa', icon: FileText, accent: 'from-warning-500 to-warning-600' },
  { label: 'Tư vấn dược sĩ', href: '/ai/chat', icon: MessageCircle, accent: 'from-accent-500 to-accent-600' },
  { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin, accent: 'from-success-500 to-success-600' },
  { label: 'Tiêm chủng', href: '/tiem-chung', icon: Calendar, accent: 'from-danger-500 to-danger-600' },
  { label: 'Bài kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra', icon: Stethoscope, accent: 'from-ink-700 to-ink-800' },
];

export function ShopHomeHero() {
  return (
    <section
      className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Layer 2 — subtle dot pattern texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      {/* Layer 3 — ambient color orbs (vivid depth without shadow) */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent-500/25"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-info-500/15"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-accent-300/10"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-accent-100 mb-5 md:mb-6">
            <Pill className="w-3 h-3" aria-hidden="true" />
            PCMS — Dành cho dược sĩ
          </div>
          <h1
            id="hero-title"
            className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-[1.1]"
          >
            Tra cứu thuốc, kê đơn,
            <br className="hidden md:inline" />{' '}
            <span className="text-accent-300">quản lý tồn kho</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-accent-100 text-pretty max-w-2xl mx-auto">
            Công cụ làm việc hằng ngày cho dược sĩ: tra cứu nhanh, kê đơn an toàn,
            POS tiện lợi — đồng bộ toàn chuỗi nhà thuốc.
          </p>
          <form
            action="/tim-kiem"
            method="get"
            className="mt-8 max-w-2xl mx-auto"
            role="search"
          >
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none transition-colors group-focus-within:text-accent-600"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Tìm theo tên thuốc, hoạt chất, triệu chứng..."
                aria-label="Tra cứu sản phẩm"
                className="w-full h-14 pl-12 pr-32 text-base bg-white text-ink-900 rounded-lg shadow-2xl shadow-ink-900/40 focus:outline-none focus:ring-2 focus:ring-accent-400 transition-shadow"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-ink-900 text-white text-sm font-semibold rounded-md hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                Tìm kiếm
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-300">
              <span className="text-ink-400">Phổ biến:</span>
              {['Paracetamol', 'Vitamin C', 'Omega-3', 'Khẩu trang', 'Siro ho'].map((kw) => (
                <Link
                  key={kw}
                  href={`/tim-kiem?q=${encodeURIComponent(kw)}`}
                  className="px-2.5 h-6 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </form>
        </div>

        {/* Quick actions grid — vivid icon containers */}
        <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative flex flex-col items-center gap-2 p-3 md:p-4 bg-white/10 backdrop-blur border border-white/15 rounded-lg hover:bg-white/20 hover:border-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <div
                  className={`relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${action.accent} rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-150 ring-2 ring-white/20`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-sm" aria-hidden="true" />
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-white text-balance leading-tight">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
