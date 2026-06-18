// =====================================================
// Breadcrumb — accessible breadcrumb nav
// Schema: nav > ol > li > a/span
// Last item is current page (span, not link)
// =====================================================

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

export interface BreadcrumbItem {
  label: string;
  href?: string; // last item typically has no href
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Show "Trang chủ" first item with home icon. Default true. */
  showHomeIcon?: boolean;
  /** Home href. Default "/" */
  homeHref?: string;
  className?: string;
}

export function Breadcrumb({
  items,
  showHomeIcon = true,
  homeHref = '/',
  className,
}: BreadcrumbProps) {
  // Prepend home if requested
  const allItems: BreadcrumbItem[] = showHomeIcon
    ? [{ label: 'Trang chủ', href: homeHref }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={clsx('text-sm', className)}>
      <ol className="flex items-center gap-1 flex-wrap">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          const isHome = showHomeIcon && idx === 0;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-ink-600 hover:text-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
                >
                  {isHome ? (
                    <Home className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Link>
              ) : (
                <span
                  className="text-ink-900 font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isHome ? <Home className="w-3.5 h-3.5" aria-hidden="true" /> : item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-ink-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
