// =====================================================
// AuthLayout — wrapper cho customer account routes
// AuthGuard: nếu chưa login → redirect /login
// Exception: /login, /register, /forgot-password bypass guard
// =====================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  Heart,
  MapPin,
  Wallet,
  FileText,
  Star,
  Bell,
  Users,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const ACCOUNT_NAV = [
  { href: '/profile', label: 'Hồ sơ của tôi', icon: User },
  { href: '/orders/history', label: 'Đơn hàng của tôi', icon: ShoppingBag },
  { href: '/addresses', label: 'Sổ địa chỉ', icon: MapPin },
  { href: '/family', label: 'Hồ sơ gia đình', icon: Users },
  { href: '/prescriptions', label: 'Đơn thuốc', icon: FileText },
  { href: '/favorites', label: 'Yêu thích', icon: Heart },
  { href: '/wallet', label: 'Ví sức khỏe', icon: Wallet },
  { href: '/points', label: 'Điểm thưởng', icon: Star },
  { href: '/notifications', label: 'Thông báo', icon: Bell },
];

// Các trang không cần auth guard
const PUBLIC_AUTH_PAGES = ['/login', '/register', '/forgot-password'];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useAuth();

  const isPublicPage = PUBLIC_AUTH_PAGES.includes(pathname);

  // Auth guard for non-public pages
  useEffect(() => {
    if (isPublicPage) return;
    if (!state.hydrated) return;
    if (!state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.hydrated, state.isAuthenticated, isPublicPage, router]);

  // Public auth pages (login, register, forgot-password) — render without layout
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Loading state
  if (!state.hydrated) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ink-200" />
          <div className="h-4 w-32 bg-ink-200 rounded" />
        </div>
      </div>
    );
  }

  // Chưa login → render null (redirect đã trigger ở useEffect)
  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* === Mobile header === */}
      <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-ink-100">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/home" className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-ink-900">
              <span className="text-accent-400 text-sm font-bold">P</span>
            </div>
            <span className="text-sm font-bold text-ink-900">PCMS</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-red-600 transition-colors"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
          {/* === Sidebar (desktop) === */}
          <aside className="hidden lg:block">
            {/* User card */}
            <div className="bg-white rounded-xl border border-ink-100 p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-sm">
                  {state.user?.fullName?.charAt(0)?.toUpperCase() || 'K'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">
                    {state.user?.fullName || 'Khách hàng'}
                  </p>
                  <p className="text-xs text-ink-500 truncate">{state.user?.email}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between text-xs">
                <span className="text-ink-500">Điểm thưởng</span>
                <span className="font-semibold text-ink-900">0</span>
              </div>
            </div>

            {/* Navigation */}
            <nav aria-label="Menu tài khoản" className="space-y-0.5">
              {ACCOUNT_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent-50 text-accent-700 font-medium'
                        : 'text-ink-700 hover:bg-white hover:border-ink-200 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-accent-600' : 'text-ink-400'}`} aria-hidden="true" />
                      {item.label}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-accent-400' : 'text-ink-300'}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </aside>

          {/* === Main content === */}
          <main className="min-h-[60vh]">{children}</main>
        </div>
      </div>

      {/* === Mobile bottom nav tabs === */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-ink-100 flex justify-around py-1.5 safe-area-bottom">
        {[
          { href: '/home', label: 'Trang chủ', icon: ShoppingBag },
          { href: '/profile', label: 'Tài khoản', icon: User },
          { href: '/orders/history', label: 'Đơn hàng', icon: FileText },
          { href: '/favorites', label: 'Yêu thích', icon: Heart },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] ${
                isActive ? 'text-accent-600' : 'text-ink-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-accent-600' : 'text-ink-400'}`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-16" />
    </div>
  );
}
