'use client';

// =====================================================
// LongChauMobileBottomNav — fixed bottom tab bar (mobile only)
// 4 tabs: Trang chủ / Tra cứu / Giỏ hàng / Tài khoản
// Hidden via md:hidden (Tailwind breakpoint 768px)
// =====================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import clsx from 'clsx';

const TABS = [
  { href: '/', label: 'Trang chủ', icon: Home, exact: true },
  { href: '/tra-cuu-thuoc', label: 'Tra cứu', icon: Search },
  { href: '/cart', label: 'Giỏ hàng', icon: ShoppingCart },
  { href: '/profile', label: 'Tài khoản', icon: User, authHref: '/login' },
];

export function LongChauMobileBottomNav() {
  const pathname = usePathname();
  const { state } = useAuth();
  const isLoggedIn = state.hydrated && state.isAuthenticated;

  return (
    <nav
      aria-label="Menu dưới cùng"
      className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4 h-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const href = tab.authHref && !isLoggedIn ? tab.authHref : tab.href;
          const isActive = tab.exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/');

          return (
            <li key={tab.href} className="h-full">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
                className={clsx(
                  'flex flex-col items-center justify-center h-full px-1 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                  aria-hidden="true"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="mt-0.5 truncate">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
