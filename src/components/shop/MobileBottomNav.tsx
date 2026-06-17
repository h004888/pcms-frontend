// =====================================================
// MobileBottomNav — fixed bottom tab bar (mobile < 768px only)
// 5 tabs: Home / Search / Cart / Reminders / Account
// Hidden via container query on desktop
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, Bell, User } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { href: '/', label: 'Trang chủ', icon: Home, exact: true },
  { href: '/tra-cuu-thuoc', label: 'Tra cứu', icon: Search },
  { href: '/cart', label: 'Giỏ hàng', icon: ShoppingCart, badge: 0 }, // TODO: read from cart store
  { href: '/reminders', label: 'Nhắc thuốc', icon: Bell },
  { href: '/login', label: 'Tài khoản', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu dưới cùng"
      className="mobile-bottom-nav fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-ink-200 z-40 safe-area-inset-bottom"
    >
      <ul className="grid grid-cols-5 h-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/');
          const hasBadge = tab.badge !== undefined && tab.badge > 0;

          return (
            <li key={tab.href} className="h-full">
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
                className={clsx(
                  'flex flex-col items-center justify-center h-full px-1 text-[10px] font-medium transition-colors relative',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-inset',
                  isActive ? 'text-accent-700' : 'text-ink-500 hover:text-ink-700'
                )}
              >
                <div className="relative">
                  <Icon
                    className={clsx(
                      'w-5 h-5 transition-transform',
                      isActive && 'scale-110'
                    )}
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {hasBadge && (
                    <span
                      aria-label={`${tab.badge} mục`}
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-danger-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 truncate">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
