// =====================================================
// PCMS - Top Header with user menu
// =====================================================

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/utils';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const { state, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-ink-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">
          Hệ thống quản lý chuỗi nhà thuốc
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Mở menu tài khoản"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
        >
          <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-800 font-semibold text-sm">
            {state.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-ink-900">{state.user?.fullName || 'Guest'}</p>
            <p className="text-xs text-ink-500">
              {state.user ? ROLE_LABELS[state.user.role] : ''}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-ink-400" aria-hidden="true" />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-md border border-ink-200 py-1 z-20"
              role="menu"
            >
              <div className="px-4 py-2 border-b border-ink-100">
                <p className="text-sm font-medium text-ink-900">{state.user?.fullName}</p>
                <p className="text-xs text-ink-500 truncate">{state.user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50"
              >
                <UserIcon className="w-4 h-4" aria-hidden="true" />
                Thông tin cá nhân
              </Link>
              <button
                onClick={handleLogout}
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:bg-red-50"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
