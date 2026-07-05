'use client';

// =====================================================
// LongChauHeaderClient — Header Long Châu có hamburger drawer cho mobile
// Mobile (<md): logo nhỏ + hamburger menu
// Desktop (≥md): logo + search + location + hotline + auth buttons
// =====================================================

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Danh mục', href: '#' },
  { label: 'Hệ thống nhà thuốc', href: '/he-thong-cua-hang' },
  { label: 'Tra cứu', href: '/tra-cuu-thuoc' },
  { label: 'Thực phẩm chức năng', href: '#' },
  { label: 'Sức khỏe', href: '/bai-viet' },
  { label: 'Thiết bị y tế', href: '#' },
  { label: 'Làm đẹp', href: '#' },
  { label: 'Voucher', href: '/voucher' },
  { label: 'Mẹ & bé', href: '#' },
];

export function LongChauHeaderClient() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useAuth();
  const isLoggedIn = state.hydrated && state.isAuthenticated;
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const q = input?.value.trim();
    if (q) router.push(`/tra-cuu-thuoc?q=${encodeURIComponent(q)}`);
  };

  // Lock body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="bg-white border-b border-slate-200">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {/* Logo — luôn hiển thị */}
          <Link href="/" className="flex items-center gap-2 text-white shrink-0" aria-label="Trang chủ Long Châu">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-blue-900 font-extrabold text-base md:text-xl">
                L
              </div>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-[10px] font-bold tracking-wide">NHÀ THUỐC</div>
              <div className="text-base font-extrabold tracking-wider">LONG CHÂU</div>
            </div>
          </Link>

          {/* Mobile: chỉ hamburger + search */}
          <div className="flex-1 flex items-center gap-2 md:hidden">
            <form onSubmit={handleSearch} className="flex-1" role="search">
              <div className="flex items-center bg-white rounded-full px-3 py-2 gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm thuốc, hoạt chất..."
                  aria-label="Tìm kiếm"
                  className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent min-w-0"
                />
              </div>
            </form>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
              aria-expanded={mobileOpen}
              className="p-2 text-white hover:bg-white/10 rounded transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop: search + location + hotline + auth */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center bg-white rounded-full px-4 py-2.5 gap-2 max-w-2xl" role="search">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên thuốc, hoạt chất, bệnh lý, sản phẩm..."
              className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
            />
          </form>

          {/* Desktop: location */}
          <div className="hidden lg:flex items-center gap-3 text-sm shrink-0">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">Miền Bắc</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="opacity-80">Hà Nội</span>
              <span className="opacity-50">|</span>
              <span className="opacity-80">Tp.HCM</span>
              <span className="opacity-50">|</span>
              <span className="opacity-80">Miền Trung</span>
            </div>
          </div>

          {/* Desktop: hotline */}
          <div className="hidden md:flex items-center gap-2 text-sm shrink-0">
            <Phone className="w-4 h-4" />
            <div className="leading-tight">
              <div className="text-[10px] opacity-90">Tổng đài tư vấn</div>
              <div className="font-bold">1800 6928</div>
            </div>
          </div>

          {/* Desktop: auth buttons */}
          {isLoggedIn ? (
            <Link
              href="/profile"
              className="hidden md:flex items-center gap-1.5 text-white text-sm font-semibold hover:text-yellow-300 transition-colors shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {state.user?.fullName?.charAt(0)?.toUpperCase() || 'K'}
              </div>
              <span className="max-w-[100px] truncate">{state.user?.fullName?.split(' ').pop()}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline text-white text-sm font-semibold hover:text-yellow-300 transition-colors shrink-0"
            >
              Đăng nhập
            </Link>
          )}
          <button className="hidden md:inline bg-yellow-400 hover:bg-yellow-500 transition text-blue-900 px-4 py-2 rounded-full text-sm font-bold shrink-0">
            Đăng hàng
          </button>
        </div>
      </div>

      {/* Nav strip — desktop */}
      <nav className="hidden md:block bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 text-sm overflow-x-auto whitespace-nowrap py-3">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <Link href={item.href} className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                  {i === 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[10px] flex items-center justify-center">
                      ☰
                    </span>
                  )}
                  {item.label}
                  {i === 0 && <ChevronDown className="w-3 h-3" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-blue-900 font-extrabold">
                    L
                  </div>
                </div>
                <div className="leading-tight">
                  <div className="text-[9px] font-bold tracking-wide">NHÀ THUỐC</div>
                  <div className="text-sm font-extrabold tracking-wider">LONG CHÂU</div>
                </div>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng menu"
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location + hotline */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-700" />
                <span className="font-semibold">Miền Bắc</span>
                <span className="text-slate-400">•</span>
                <span>Hà Nội | Tp.HCM | Miền Trung</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-blue-700">1800 6928</span>
                <span className="text-slate-500">— Tổng đài tư vấn</span>
              </div>
            </div>

            {/* Auth row */}
            <div className="px-4 py-3 grid grid-cols-3 gap-2 border-b border-slate-200">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-center bg-slate-100 hover:bg-slate-200 transition text-slate-800 font-semibold text-xs py-2 rounded col-span-2"
                >
                  {state.user?.fullName || 'Tài khoản'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center bg-slate-100 hover:bg-slate-200 transition text-slate-800 font-semibold text-xs py-2 rounded"
                >
                  Đăng nhập
                </Link>
              )}
              <Link
                href="#"
                onClick={() => setMobileOpen(false)}
                className="text-center bg-yellow-400 hover:bg-yellow-500 transition text-blue-900 font-bold text-xs py-2 rounded"
              >
                Đăng hàng
              </Link>
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu chính">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 px-2">
                Danh mục
              </div>
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-2 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
