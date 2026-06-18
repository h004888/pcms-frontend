// =====================================================
// PublicFooter — footer for all B2C pages (vivid edition)
// Thay đổi so với bản cũ:
//   • Brand block nổi bật với wordmark + tagline (ink-900 bg)
//   • Newsletter signup CTA
//   • 4 columns clean (không accordion mobile)
//   • Trust strip ngay trên copyright
// =====================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Phone, Send, Facebook, Youtube, Instagram, Pill, Mail, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

// TikTok icon (lucide-react doesn't ship one yet — use inline SVG)
const Tiktok = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.91a4.85 4.85 0 0 1-1.84-.22z" />
  </svg>
);

const HOTLINES = [
  { label: 'Tư vấn mua hàng', number: '18006928', branch: 'Nhánh 1', hours: '8:00-22:00' },
  { label: 'Tư vấn Tiêm chủng', number: '18006928', branch: 'Nhánh 2', hours: '8:00-22:00' },
  { label: 'Tư vấn Xét nghiệm', number: '18006928', branch: 'Nhánh 3', hours: '8:00-22:00' },
  { label: 'Khiếu nại & CSKH', number: '18006928', branch: 'Nhánh 4', hours: '24/7' },
];

const ABOUT_LINKS = [
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Hệ thống cửa hàng', href: '/he-thong-cua-hang' },
  { label: 'Tuyển dụng', href: '/tuyen-dung' },
  { label: 'Tin tức sự kiện', href: '/tin-tuc-su-kien' },
];

const POLICY_LINKS = [
  { label: 'Chính sách giao hàng', href: '/chinh-sach/giao-hang' },
  { label: 'Chính sách đổi trả', href: '/chinh-sach/doi-tra' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach/bao-mat' },
  { label: 'Điều khoản sử dụng', href: '/chinh-sach/tos' },
];

const CATEGORIES = [
  { label: 'Thuốc', href: '/thuoc' },
  { label: 'Thực phẩm chức năng', href: '/thuc-pham-chuc-nang' },
  { label: 'Dược mỹ phẩm', href: '/duoc-my-pham' },
  { label: 'Chăm sóc cá nhân', href: '/cham-soc-ca-nhan' },
  { label: 'Thiết bị y tế', href: '/thiet-bi-y-te' },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'MoMo', 'ZaloPay', 'VNPay', 'COD'];

export function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-ink-50 border-t border-ink-200 mt-16 pb-16 md:pb-0">
      {/* Hotlines strip */}
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {HOTLINES.map((h) => (
              <a
                key={h.branch}
                href={`tel:${h.number.replace(/\s/g, '')}`}
                className="group flex items-start gap-3 p-3 bg-white border border-ink-200 rounded-lg hover:border-accent-500 hover:bg-accent-50/50 transition-colors"
              >
                <div className="flex-shrink-0 w-9 h-9 bg-accent-50 rounded-md flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                  <Phone className="w-4 h-4 text-accent-700" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink-500 truncate">{h.label}</p>
                  <p className="text-sm font-bold text-ink-900 font-mono">
                    {h.number}
                  </p>
                  <p className="text-xs text-ink-400">
                    {h.branch} · {h.hours}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Brand block + Newsletter */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 pb-8 mb-8 border-b border-ink-200">
          {/* Brand block */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-ink-900 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-accent-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold text-ink-900 tracking-tight">PCMS</p>
                <p className="text-xs text-ink-500 -mt-0.5">Pharmacy Chain</p>
              </div>
            </Link>
            <p className="text-sm text-ink-600 text-pretty leading-relaxed">
              Hệ thống quản lý chuỗi nhà thuốc — tra cứu nhanh, kê đơn an toàn,
              giao tận nơi. Đồng bộ toàn quốc.
            </p>
            {/* Social */}
            <div className="mt-5 flex gap-2">
              {[
                { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
                { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
                { href: 'https://instagram.com', label: 'Instagram', icon: Instagram },
                { href: 'https://tiktok.com', label: 'TikTok', icon: Tiktok },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 bg-white border border-ink-200 rounded-md flex items-center justify-center text-ink-600 hover:text-accent-700 hover:border-accent-500 transition-colors"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white rounded-xl p-6 md:p-7 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent-500/20"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 h-6 bg-accent-600 text-white text-xs font-semibold rounded-full mb-3">
                <Mail className="w-3 h-3" aria-hidden="true" />
                Nhận ưu đãi
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-balance leading-tight">
                Đăng ký nhận bản tin sức khỏe
              </h3>
              <p className="mt-1.5 text-sm text-ink-200 text-pretty">
                Cập nhật sản phẩm mới, khuyến mãi, bài viết sức khỏe từ dược sĩ — 2 email/tháng.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  aria-label="Email đăng ký nhận bản tin"
                  required
                  className="flex-1 h-11 px-3 text-sm bg-white/10 backdrop-blur border border-white/20 rounded-md text-white placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-4 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {subscribed ? 'Đã đăng ký' : 'Đăng ký'}
                </button>
              </form>
              <p className="mt-2 text-xs text-ink-300">
                Chúng tôi cam kết bảo mật email. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              {ABOUT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-600 hover:text-accent-700 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-600 hover:text-accent-700 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-ink-600 hover:text-accent-700 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3">Thanh toán</h3>
            <p className="text-xs text-ink-500 mb-3">Đa dạng hình thức an toàn</p>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m}
                  className="px-2 h-6 bg-white border border-ink-200 rounded text-xs font-medium text-ink-700 flex items-center"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications strip */}
        <div className="mt-8 pt-6 border-t border-ink-200 flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700">
            <ShieldCheck className="w-4 h-4 text-success-600" aria-hidden="true" />
            Đã đăng ký
          </p>
          {['Bộ Y tế', 'Bộ Công Thương', 'ISO 9001:2015', 'GDP thuốc'].map((c) => (
            <span
              key={c}
              className="px-2.5 h-7 bg-white border border-ink-200 rounded text-xs font-medium text-ink-700 flex items-center"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-ink-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <p>© 2007-2026 Công ty Cổ Phần Dược Phẩm FPT Long Châu</p>
          <p className="font-mono">Số ĐKKD 0315275368 · GP-TTĐT 538/2025</p>
        </div>
      </div>
    </footer>
  );
}
