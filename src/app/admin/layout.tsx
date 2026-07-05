'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, hasRole, logout } from '@/lib/auth/auth';
import type { AuthUser } from '@/types';

const NAV = [
  { href: '/admin/home-banners', label: 'Home Banners' },
  { href: '/', label: '← Về trang chủ' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (!u) {
      router.replace(`/login?return=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasRole(u, ['ADMIN'])) {
      router.replace('/?error=forbidden');
      return;
    }
    setLoading(false);
  }, [pathname, router]);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  if (loading) return <div className="p-10 text-slate-500">Đang kiểm tra quyền...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-56 bg-slate-900 text-white p-4 shrink-0 hidden md:block">
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-3">Admin PCMS</div>
        <div className="font-bold mb-4">{user?.email}</div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block px-3 py-2 rounded text-sm hover:bg-slate-800 transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 text-xs text-slate-400 hover:text-white transition"
        >
          Đăng xuất
        </button>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
