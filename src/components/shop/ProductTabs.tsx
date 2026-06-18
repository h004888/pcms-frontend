// =====================================================
// ProductTabs — Tab nội dung PDP (mô tả, công dụng, bảo quản)
// =====================================================

'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface Props {
  tabs: Tab[];
}

export function ProductTabs({ tabs }: Props) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="border-b border-ink-200 overflow-x-auto">
        <div
          role="tablist"
          className="flex gap-1 -mb-px"
          aria-label="Tab thông tin sản phẩm"
        >
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
                'px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                active === idx
                  ? 'border-accent-600 text-accent-700'
                  : 'border-transparent text-ink-600 hover:text-ink-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${tabs[active].id}`}
        aria-labelledby={`tab-${tabs[active].id}`}
        className="py-6 text-sm text-ink-700 leading-relaxed"
      >
        {tabs[active].content}
      </div>
    </div>
  );
}
