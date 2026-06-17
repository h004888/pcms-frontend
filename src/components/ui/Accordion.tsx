// =====================================================
// Accordion — collapsible section
// Dùng cho FAQ, policy sections, chi tiết đơn hàng
// =====================================================

'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  /** Optional subtitle/below title */
  subtitle?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Cho phép mở nhiều section cùng lúc */
  multiple?: boolean;
  /** Section mở mặc định (id hoặc array id nếu multiple) */
  defaultOpen?: string | string[];
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen,
  className,
}: AccordionProps) {
  const initial = Array.isArray(defaultOpen)
    ? defaultOpen
    : defaultOpen
      ? [defaultOpen]
      : [];
  const [openIds, setOpenIds] = useState<string[]>(initial);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return multiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="bg-white border border-ink-200 rounded-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-ink-500 mt-0.5">{item.subtitle}</p>
                )}
              </div>
              <ChevronDown
                className={clsx(
                  'w-4 h-4 text-ink-500 transition-transform flex-shrink-0',
                  isOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={`accordion-${item.id}`}
              role="region"
              aria-hidden={!isOpen}
              className={clsx(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-4 pb-4 pt-1 text-sm text-ink-700 border-t border-ink-100">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}