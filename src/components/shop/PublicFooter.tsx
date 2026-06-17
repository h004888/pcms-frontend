// =====================================================
// PublicFooter — footer for all B2C pages
// 4-column layout (desktop) / accordion (mobile)
// Contains: hotline, payment, social, certifications, legal
// =====================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Phone, ChevronDown, Facebook, Youtube, Instagram } from 'lucide-react';
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
  { label: 'Thuốc', href: '/shop/thuoc' },
  { label: 'Thực phẩm chức năng', href: '/shop/thuc-pham-chuc-nang' },
  { label: 'Dược mỹ phẩm', href: '/shop/duoc-my-pham' },
  { label: 'Chăm sóc cá nhân', href: '/shop/cham-soc-ca-nhan' },
  { label: 'Thiết bị y tế', href: '/shop/thiet-bi-y-te' },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'MoMo', 'ZaloPay', 'VNPay', 'COD'];

const FooterColumn = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b md:border-b-0 border-ink-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="md:cursor-default flex items-center justify-between w-full py-3 md:py-0 md:mb-4 text-left"
        aria-expanded={open}
      >
        <h3 className="text-sm font-semibold text-ink-900 tracking-wide uppercase">{title}</h3>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-ink-500 md:hidden transition-transform',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={clsx(
          'pb-4 md:pb-0 space-y-2',
          !open && 'hidden md:block'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export function PublicFooter() {
  return (
    <footer className="bg-ink-50 border-t border-ink-200 mt-16 pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Hotlines strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pb-8 mb-8 border-b border-ink-200">
          {HOTLINES.map((h) => (
            <a
              key={h.branch}
              href={`tel:${h.number.replace(/\s/g, '')}`}
              className="group flex items-start gap-3 p-3 bg-white border border-ink-200 rounded-md hover:border-accent-500 hover:bg-accent-50 transition-colors"
            >
              <div className="flex-shrink-0 w-9 h-9 bg-accent-50 rounded-md flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                <Phone className="w-4 h-4 text-accent-700" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-500 truncate">{h.label}</p>
                <p className="text-sm font-bold text-ink-900 font-mono">
                  {h.number}
                </p>
                <p className="text-[10px] text-ink-400">
                  {h.branch} · {h.hours}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <FooterColumn title="Về chúng tôi" defaultOpen>
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
          </FooterColumn>

          <FooterColumn title="Danh mục">
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
          </FooterColumn>

          <FooterColumn title="Chính sách">
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
          </FooterColumn>

          <FooterColumn title="Kết nối với chúng tôi">
            <div className="flex gap-2 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 bg-white border border-ink-200 rounded-md flex items-center justify-center text-ink-600 hover:text-accent-700 hover:border-accent-500 transition-colors"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 bg-white border border-ink-200 rounded-md flex items-center justify-center text-ink-600 hover:text-accent-700 hover:border-accent-500 transition-colors"
              >
                <Youtube className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white border border-ink-200 rounded-md flex items-center justify-center text-ink-600 hover:text-accent-700 hover:border-accent-500 transition-colors"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 bg-white border border-ink-200 rounded-md flex items-center justify-center text-ink-600 hover:text-accent-700 hover:border-accent-500 transition-colors"
              >
                <Tiktok className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <p className="text-xs text-ink-500 mb-3">Hỗ trợ thanh toán</p>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m}
                  className="px-2 h-6 bg-white border border-ink-200 rounded text-[10px] font-medium text-ink-700 flex items-center"
                >
                  {m}
                </span>
              ))}
            </div>
          </FooterColumn>
        </div>

        {/* Certifications strip */}
        <div className="mt-8 pt-6 border-t border-ink-200 flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
          <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold">
            Đã đăng ký:
          </p>
          <span className="px-2.5 h-7 bg-white border border-ink-200 rounded text-xs font-medium text-ink-700 flex items-center">
            Bộ Y tế
          </span>
          <span className="px-2.5 h-7 bg-white border border-ink-200 rounded text-xs font-medium text-ink-700 flex items-center">
            Đã thông báo Bộ Công Thương
          </span>
          <span className="px-2.5 h-7 bg-white border border-ink-200 rounded text-xs font-medium text-ink-700 flex items-center">
            ISO 9001:2015
          </span>
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
