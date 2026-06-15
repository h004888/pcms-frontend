// =====================================================
// PCMS - Top Header with user menu
// =====================================================

'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Hệ thống quản lý chuỗi nhà thuốc
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((o) => !o)}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {state.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{state.user?.fullName || 'Guest'}</p>
            <p className="text-xs text-gray-500">
              {state.user ? ROLE_LABELS[state.user.role] : ''}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{state.user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{state.user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <UserIcon className="w-4 h-4" />
                Thông tin cá nhân
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
