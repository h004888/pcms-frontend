// =====================================================
// PublicHeader — sticky header for all B2C pages
// Brand: PCMS (Pharmacy Chain Management System) portal nội bộ
// Routes theo main plan: /thuoc, /thuoc/[slug], /search, /cart, /orders
// (không có prefix /shop/ — đó là path lỗi của code cũ)
// =====================================================

'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Pill,
  Heart,
  Stethoscope,
  Baby,
  FlaskConical,
  MapPin,
  Calendar,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import clsx from 'clsx';
// CartContext sẽ được thêm ở Task 1 (Cart infrastructure).
// Trước đó, cart badge trong header hiển thị local state.
// Sau Task 1, refactor thành useCart() từ context.

const CATEGORIES = [
  { label: 'Thuốc', href: '/thuoc', icon: Pill },
  { label: 'Thực phẩm chức năng', href: '/thuc-pham-chuc-nang', icon: Heart },
  { label: 'Dược mỹ phẩm', href: '/duoc-my-pham', icon: Stethoscope },
  { label: 'Chăm sóc cá nhân', href: '/cham-soc-ca-nhan', icon: Baby },
  { label: 'Thiết bị y tế', href: '/thiet-bi-y-te', icon: FlaskConical },
];

const QUICK_LINKS = [
  { label: 'Tra cứu thuốc', href: '/tra-cuu-thuoc', icon: Search },
  { label: 'Đặt thuốc theo toa', href: '/prescriptions/upload', icon: Pill },
  { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang', icon: MapPin },
  { label: 'Tiêm chủng', href: '/tiem-chung', icon: Calendar },
  { label: 'Tư vấn dược sĩ', href: '/ai/chat', icon: MessageCircle },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      window.location.href = `/search?q=${encodeURIComponent(q)}`;
    }
  };

  return (
    <header
      ref={headerRef}
      className={clsx(
        'sticky top-0 z-30 w-full bg-white transition-shadow',
        scrolled && 'shadow-sm border-b border-ink-200'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 -ml-2 text-ink-700 hover:text-ink-900 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            aria-label="Trang chủ PCMS"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <div className="w-8 h-8 bg-ink-900 rounded-md flex items-center justify-center transition-transform group-hover:scale-105">
              <Pill className="w-4 h-4 text-accent-400" aria-hidden="true" />
            </div>
            <span className="text-base font-bold text-ink-900 hidden sm:inline-block tracking-tight">
              PCMS
            </span>
          </Link>

          {/* Categories dropdown (desktop) */}
          <div className="hidden lg:block relative group">
            <button
              aria-haspopup="menu"
              className="flex items-center gap-1 px-3 h-9 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-ink-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Danh mục
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <div
              role="menu"
              className="absolute left-0 top-full mt-1 w-64 bg-white border border-ink-200 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all shadow-lg py-2 z-40"
              style={{ boxShadow: '0 4px 12px rgba(15, 29, 61, 0.08)' }}
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    role="menuitem"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-ink-400" aria-hidden="true" />
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm theo tên thuốc, triệu chứng, dược chất..."
                aria-label="Tìm kiếm sản phẩm"
                className="w-full h-9 pl-9 pr-4 text-sm bg-ink-50 border border-transparent rounded-md text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 transition-colors"
              />
            </div>
          </form>

          {/* Quick links (desktop) */}
          <div className="hidden xl:flex items-center gap-1 ml-2">
            <Link
              href="/tra-cuu-thuoc"
              className="px-2 py-1.5 text-xs font-medium text-ink-600 hover:text-ink-900 rounded transition-colors"
            >
              Tra cứu
            </Link>
          </div>

          {/* Hotline removed: PCMS portal nội bộ, không phải tổng đài marketing */}

          {/* Right side: Cart + Account (always visible) */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search trigger */}
            <Link
              href="/search"
              aria-label="Tìm kiếm"
              className="md:hidden p-2 text-ink-700 hover:text-ink-900 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Giỏ hàng (0 sản phẩm)"
              className="relative p-2 text-ink-700 hover:text-ink-900 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-danger-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                0
              </span>
            </Link>

            {/* Account */}
            <Link
              href="/login"
              aria-label="Tài khoản"
              className="p-2 text-ink-700 hover:text-ink-900 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Quick links bar (desktop only) */}
        <div className="hidden md:flex items-center gap-1 h-9 -mt-1">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-2.5 h-7 text-xs font-medium text-ink-600 hover:text-accent-700 hover:bg-accent-50 rounded transition-colors"
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink-900/50 animate-in fade-in-0 duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Mobile drawer header (logo + close) */}
            <div className="flex items-center justify-between p-4 border-b border-ink-200">
              {/* Mobile drawer logo */}
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 bg-ink-900 rounded-md flex items-center justify-center">
                  <Pill className="w-4 h-4 text-accent-400" aria-hidden="true" />
                </div>
                <span className="text-base font-bold text-ink-900">PCMS</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng menu"
                className="p-2 text-ink-700 hover:text-ink-900 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6" aria-label="Menu chính">
              <div>
                <h2 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Danh mục
                </h2>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-2 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded transition-colors"
                        >
                          <Icon className="w-4 h-4 text-ink-400" aria-hidden="true" />
                          {cat.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h2 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Tiện ích
                </h2>
                <ul className="space-y-1">
                  {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-2 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded transition-colors"
                        >
                          <Icon className="w-4 h-4 text-ink-400" aria-hidden="true" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* Hotline removed: PCMS portal nội bộ */}
          </div>
        </div>
      )}
    </header>
  );
}
