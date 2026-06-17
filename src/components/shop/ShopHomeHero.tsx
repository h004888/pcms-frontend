// =====================================================
// ShopHomeHero — Hero trang chủ B2C
// Tone PCMS portal: dược sĩ, tra cứu, kê đơn, POS
// (không phải marketing Long Châu)
// =====================================================

import Link from 'next/link';
import { Search, FileText, Pill, MessageCircle, MapPin, Calendar, Stethoscope } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search, accent: 'from-info-500 to-info-600' },
  { label: 'Đặt thuốc theo toa', href: '/prescriptions/upload', icon: FileText, accent: 'from-warning-500 to-warning-600' },
  { label: 'Tư vấn dược sĩ', href: '/ai/chat', icon: MessageCircle, accent: 'from-accent-500 to-accent-600' },
  { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin, accent: 'from-success-500 to-success-600' },
  { label: 'Tiêm chủng', href: '/tiem-chung', icon: Calendar, accent: 'from-danger-500 to-danger-600' },
  { label: 'Bài kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra', icon: Stethoscope, accent: 'from-primary-500 to-primary-600' },
];

export function ShopHomeHero() {
  return (
    <section
      className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-accent-100 mb-5">
            <Pill className="w-3 h-3" aria-hidden="true" />
            PCMS — Dành cho dược sĩ
          </div>
          <h1
            id="hero-title"
            className="text-3xl md:text-5xl font-bold tracking-tight text-balance"
          >
            Tra cứu thuốc, kê đơn, quản lý tồn kho
          </h1>
          <p className="mt-4 text-base md:text-lg text-accent-100 text-pretty">
            Công cụ làm việc hằng ngày cho dược sĩ: tra cứu nhanh, kê đơn an toàn,
            POS tiện lợi — đồng bộ toàn chuỗi nhà thuốc.
          </p>
          <form
            action="/search"
            method="get"
            className="mt-8 max-w-2xl mx-auto"
            role="search"
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Tìm theo tên thuốc, hoạt chất, triệu chứng..."
                aria-label="Tra cứu sản phẩm"
                className="w-full h-12 pl-12 pr-4 text-base bg-white text-ink-900 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
          </form>
        </div>

        {/* Quick actions grid */}
        <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-center gap-2 p-3 md:p-4 bg-white/10 backdrop-blur border border-white/20 rounded-md hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${action.accent} rounded-md flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-white text-balance">
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
