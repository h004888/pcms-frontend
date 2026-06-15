// =====================================================
// PCMS - Sidebar Navigation with role-based menu
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth-context';
import { getMenuForRole } from '@/lib/menu';
import { Pill } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useAuth();
  const menuGroups = getMenuForRole(state.user?.role);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Pill className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-none">PCMS</h1>
          <p className="text-xs text-gray-500 mt-0.5">Pharmacy Chain</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {menuGroups.map((group) => (
          <div key={group.title} className="px-3 mb-4">
            <p className="px-2 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.title}
            </p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-primary-600' : 'text-gray-400')} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
        <p>Phiên bản 1.0.0</p>
        <p>© 2026 PCMS</p>
      </div>
    </aside>
  );
}
