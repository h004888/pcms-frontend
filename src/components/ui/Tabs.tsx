// =====================================================
// Tabs — accessible tab navigation (role=tablist)
// =====================================================

'use client';

import { useState, type ReactNode } from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  /** Optional badge count hiển thị bên cạnh label */
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActive?: number;
  className?: string;
}

export function Tabs({ tabs, defaultActive = 0, className }: TabsProps) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className={className}>
      <div className="border-b border-ink-200 overflow-x-auto">
        <div role="tablist" aria-label="Tabs" className="flex gap-1 -mb-px">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === idx}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(idx)}
              className={clsx(
                'px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                active === idx
                  ? 'border-accent-600 text-accent-700'
                  : 'border-transparent text-ink-600 hover:text-ink-900'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 h-5 inline-flex items-center justify-center text-[10px] font-bold rounded-full font-mono',
                    active === idx
                      ? 'bg-accent-600 text-white'
                      : 'bg-ink-100 text-ink-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {tabs[active] && (
        <div
          role="tabpanel"
          id={`tabpanel-${tabs[active].id}`}
          aria-labelledby={`tab-${tabs[active].id}`}
          className="py-4"
        >
          {tabs[active].content}
        </div>
      )}
    </div>
  );
}