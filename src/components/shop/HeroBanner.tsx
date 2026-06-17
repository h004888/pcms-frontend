// =====================================================
// HeroBanner — SHOP-HOME hero
// Gradient bg (ink-900 → accent-800), big H1, 2 CTAs
// Responsive: full-height on desktop, 30vh on mobile
// =====================================================

import Link from 'next/link';
import { Search, FileText, Pill, Sparkles } from 'lucide-react';

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string; icon?: React.ReactNode };
  secondaryCta?: { label: string; href: string; icon?: React.ReactNode };
  variant?: 'home' | 'compact';
}

export function HeroBanner({
  title = 'Đặt thuốc theo toa, mua thuốc online, nhắc uống thuốc đúng giờ',
  subtitle = 'Hơn 2,678 nhà thuốc trên toàn quốc. Giao hàng tận nơi. Tư vấn miễn phí với dược sĩ 24/7.',
  primaryCta = {
    label: 'Tìm thuốc',
    href: '/shop/search',
    icon: <Search className="w-4 h-4" aria-hidden="true" />,
  },
  secondaryCta = {
    label: 'Đặt thuốc theo toa',
    href: '/prescriptions/upload',
    icon: <FileText className="w-4 h-4" aria-hidden="true" />,
  },
  variant = 'home',
}: HeroBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white"
      aria-label="Hero"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-72 h-72 bg-accent-700/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-medium text-accent-100 mb-5 md:mb-6">
          <Pill className="w-3 h-3" aria-hidden="true" />
          FPT Long Châu — Dược phẩm chính hãnh
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-4xl mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 md:mt-5 text-base md:text-lg text-accent-100 max-w-2xl mx-auto text-pretty">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-7 md:mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            {primaryCta.icon}
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 px-5 h-11 bg-white text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
          >
            {secondaryCta.icon}
            {secondaryCta.label}
          </Link>
        </div>

        {variant === 'home' && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-accent-200">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Miễn phí vận chuyển từ 300K
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Tư vấn dược sĩ 24/7
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Đổi trả trong 30 ngày
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
