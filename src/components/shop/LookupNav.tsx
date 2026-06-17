// =====================================================
// LookupNav — Tab navigation cho các trang Tra cứu
// Dùng chung cho: tra-cuu-thuoc, tra-cuu-duoc-chat, tra-cuu-duoc-lieu,
//                 tra-thuoc-chinh-hang, bai-viet, benh-thuong-gap, video
// Active state highlight theo `current` prop
// =====================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pill, Beaker, Leaf, ShieldCheck, FileText, Activity, Video } from 'lucide-react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  href: string;
  icon: typeof Pill;
  /** Sub-segment để match active (vd: 'thuoc' match '/tra-cuu-thuoc' và '/tra-cuu-thuoc/...') */
  matchSegment?: string;
}

const TABS: TabItem[] = [
  { label: 'Tra cứu thuốc', href: '/customer/tra-cuu-thuoc', icon: Pill, matchSegment: 'tra-cuu-thuoc' },
  { label: 'Hoạt chất', href: '/customer/tra-cuu-duoc-chat', icon: Beaker, matchSegment: 'tra-cuu-duoc-chat' },
  { label: 'Dược liệu', href: '/customer/tra-cuu-duoc-lieu', icon: Leaf, matchSegment: 'tra-cuu-duoc-lieu' },
  { label: 'Chính hãng', href: '/customer/tra-thuoc-chinh-hang', icon: ShieldCheck, matchSegment: 'tra-thuoc-chinh-hang' },
  { label: 'Bài viết', href: '/customer/bai-viet', icon: FileText, matchSegment: 'bai-viet' },
  { label: 'Bệnh', href: '/customer/benh-thuong-gap', icon: Activity, matchSegment: 'benh-thuong-gap' },
  { label: 'Video', href: '/customer/video', icon: Video, matchSegment: 'video' },
];

interface LookupNavProps {
  /** Override current page slug (vd: 'tra-cuu-thuoc' để highlight tab Thuốc) */
  active?: string;
}

export function LookupNav({ active }: LookupNavProps) {
  const pathname = usePathname();

  // Auto-detect từ pathname nếu không truyền active
  const detectedActive = (() => {
    if (active) return active;
    for (const tab of TABS) {
      if (tab.matchSegment && pathname.includes(`/${tab.matchSegment}`)) {
        return tab.matchSegment;
      }
    }
    return null;
  })();

  return (
    <nav
      className="border-b border-ink-200 bg-white"
      aria-label="Điều hướng tra cứu"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = detectedActive === tab.matchSegment;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  'inline-flex items-center gap-2 px-4 h-12 text-sm font-medium border-b-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  isActive
                    ? 'border-accent-600 text-accent-700'
                    : 'border-transparent text-ink-600 hover:text-ink-900 hover:border-ink-200'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}