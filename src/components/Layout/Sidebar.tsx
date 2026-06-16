// =====================================================
// PCMS - Sidebar Navigation with role-based menu
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth';
import { getMenuForRole, type MenuItem } from '@/lib/config';
import { Pill } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useAuth();
  const menuGroups = getMenuForRole(state.user?.role);

  return (
    <aside className="w-64 bg-white border-r border-ink-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-ink-200 flex items-center gap-2">
        <div className="p-2 bg-accent-100 rounded-lg">
          <Pill className="w-5 h-5 text-accent-700" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-ink-900 leading-none">PCMS</h1>
          <p className="text-xs text-ink-500 mt-0.5">Pharmacy Chain</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3" aria-label="Menu chính">
        {menuGroups.map((group) => (
          <div key={group.title} className="px-3 mb-4">
            <p className="px-2 mb-1 text-xs font-semibold text-ink-500">
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
                      aria-current={isActive ? 'page' : undefined}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1',
                        isActive
                          ? 'bg-accent-50 text-accent-800 font-medium'
                          : 'text-ink-700 hover:bg-ink-50'
                      )}
                    >
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-accent-700' : 'text-ink-400')} aria-hidden="true" />
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
      <div className="px-5 py-3 border-t border-ink-200 text-xs text-ink-500">
        <p>Phiên bản 1.0.0</p>
        <p>© 2026 PCMS</p>
      </div>
    </aside>
  );
}
