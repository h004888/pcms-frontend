// =====================================================
// AuthLayout — wrapper cho customer account routes
// AuthGuard mock: nếu chưa login, hiển thị placeholder yêu cầu đăng nhập
// Trong production: check AuthProvider.session
// =====================================================

import Link from 'next/link';
import { User, Heart, MapPin, Wallet, FileText, Star, Bell, Users } from 'lucide-react';
import { LogIn } from 'lucide-react';

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
  // Mock AuthGuard — trong prod sẽ check session
  const isLoggedIn = false;

  if (!isLoggedIn) {
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
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
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