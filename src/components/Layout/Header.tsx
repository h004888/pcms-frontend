// =====================================================
// PCMS - Top Header với search bar + user menu (vivid edition)
// Upgrades:
//   • Search bar tích hợp (tra cứu nhanh từ header)
//   • Notifications icon + badge
//   • Branch context (current shift + branch name)
//   • User avatar với online status dot
// =====================================================

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/utils';
import {
  LogOut,
  User as UserIcon,
  ChevronDown,
  Search,
  Bell,
  HelpCircle,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export function Header() {
  const { state, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const q = input?.value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const branchName = state.user?.branchId ? 'Chi nhánh Quận 1' : 'Tổng hệ thống';
  const firstName = state.user?.fullName?.split(' ').slice(-1)[0] || 'bạn';

  return (
    <header className="h-16 bg-white border-b border-ink-200 flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-10">
      {/* Left: branch context */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 h-8 bg-ink-50 rounded-md text-ink-700">
          <Building2 className="w-3.5 h-3.5 text-ink-500" aria-hidden="true" />
          <span className="font-medium truncate max-w-[140px]">{branchName}</span>
        </div>
        <span className="text-ink-300">·</span>
        <span className="text-ink-600">Xin chào, <span className="font-semibold text-ink-900">{firstName}</span></span>
      </div>

      {/* Center: search bar */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-md hidden sm:block"
        role="search"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Tìm thuốc, khách hàng, đơn hàng..."
            aria-label="Tìm kiếm nhanh"
            className="w-full h-9 pl-9 pr-3 text-sm bg-ink-50 border border-transparent rounded-md text-ink-900 placeholder:text-ink-400 focus:bg-white focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200 transition-colors"
          />
        </div>
      </form>

      {/* Right: actions + user menu */}
      <div className="flex items-center gap-1.5">
        {/* Help */}
        <Link
          href="/help"
          className="hidden md:inline-flex items-center justify-center w-9 h-9 text-ink-500 hover:text-ink-900 hover:bg-ink-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          aria-label="Trợ giúp"
        >
          <HelpCircle className="w-4.5 h-4.5 w-[18px] h-[18px]" aria-hidden="true" />
        </Link>
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative inline-flex items-center justify-center w-9 h-9 text-ink-500 hover:text-ink-900 hover:bg-ink-50 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          aria-label="Thông báo (3 chưa đọc)"
        >
          <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-danger-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono ring-2 ring-white"
          >
            3
          </span>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label={`Tài khoản: ${state.user?.fullName || 'Guest'}`}
            className={clsx(
              'flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-md hover:bg-ink-50 transition-colors ml-1',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2'
            )}
          >
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white"
                aria-hidden="true"
              >
                {state.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full ring-2 ring-white"
              />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-ink-900 leading-tight truncate max-w-[140px]">
                {state.user?.fullName || 'Guest'}
              </p>
              <p className="text-[11px] text-ink-500 leading-tight">
                {state.user ? ROLE_LABELS[state.user.role] : ''}
              </p>
            </div>
            <ChevronDown
              className={clsx(
                'w-3.5 h-3.5 text-ink-400 transition-transform',
                isMenuOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                className="absolute right-0 mt-2 w-60 bg-white rounded-lg border border-ink-200 py-1.5 z-20 overflow-hidden"
                role="menu"
              >
                <div className="px-4 py-2.5 border-b border-ink-100 bg-gradient-to-b from-ink-50/50 to-transparent">
                  <p className="text-sm font-semibold text-ink-900 truncate">{state.user?.fullName}</p>
                  <p className="text-xs text-ink-500 truncate">{state.user?.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 px-1.5 h-5 bg-accent-50 text-accent-700 text-[10px] font-bold rounded uppercase tracking-wider">
                    {state.user ? ROLE_LABELS[state.user.role] : ''}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-ink-400" aria-hidden="true" />
                  Thông tin cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 focus-visible:outline-none focus-visible:bg-danger-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
