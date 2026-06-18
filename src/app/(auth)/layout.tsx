// =====================================================
// AuthLayout — wrapper cho customer account routes
// AuthGuard: nếu chưa login, hiển thị placeholder yêu cầu đăng nhập
// Exception: /login page KHÔNG qua guard (để user thấy form đăng nhập)
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Heart, MapPin, Wallet, FileText, Star, Bell, Users, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const ACCOUNT_NAV = [
  { href: '/profile', label: 'Hồ sơ', icon: User },
  { href: '/addresses', label: 'Sổ địa chỉ', icon: MapPin },
  { href: '/family', label: 'Hồ sơ gia đình', icon: Users },
  { href: '/wallet', label: 'Ví sức khỏe', icon: Wallet },
  { href: '/prescriptions', label: 'Đơn thuốc', icon: FileText },
  { href: '/points', label: 'Điểm thưởng', icon: Star },
  { href: '/favorites', label: 'Yêu thích', icon: Heart },
  { href: '/notifications', label: 'Thông báo', icon: Bell },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useAuth();

  // /login KHÔNG qua auth guard — user cần thấy form đăng nhập
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Trong khi chưa hydrate, return null để tránh flash placeholder rồi mới
  // show content khi user thật sự đã login.
  if (!state.hydrated) {
    return null;
  }

  // Chưa login → placeholder yêu cầu đăng nhập
  if (!state.isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-accent-50 rounded-full flex items-center justify-center">
          <LogIn className="w-8 h-8 text-accent-700" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-ink-900">Vui lòng đăng nhập</h1>
        <p className="mt-2 text-sm text-ink-600">
          Đăng nhập để truy cập hồ sơ, đơn hàng, điểm thưởng và các tiện ích khác.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <LogIn className="w-4 h-4" aria-hidden="true" />
          Đăng nhập / Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="hidden lg:block">
            <nav aria-label="Menu tài khoản" className="space-y-1">
              {ACCOUNT_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-white hover:border-accent-500 border border-transparent rounded transition-colors"
                  >
                    <Icon className="w-4 h-4 text-ink-400" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
