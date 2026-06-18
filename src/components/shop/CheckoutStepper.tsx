// =====================================================
// CheckoutStepper — Visual progress cho 4-step checkout
// =====================================================

import { Check } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  current: number; // 0..N-1
  steps: string[];
}

export function CheckoutStepper({ current, steps }: Props) {
  return (
    <ol
      className="flex items-center justify-between gap-1 overflow-x-auto pb-2"
      aria-label="Các bước thanh toán"
    >
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <li
            key={step}
            className="flex items-center flex-1 min-w-0"
            aria-current={active ? 'step' : undefined}
          >
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0',
                  done && 'bg-success-600 text-white',
                  active && 'bg-accent-600 text-white',
                  !done && !active && 'bg-ink-100 text-ink-500'
                )}
              >
                {done ? <Check className="w-4 h-4" aria-hidden="true" /> : idx + 1}
              </div>
              <span
                className={clsx(
                  'text-xs font-medium text-center whitespace-nowrap',
                  active ? 'text-ink-900' : 'text-ink-500'
                )}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={clsx(
                  'flex-1 h-0.5 mx-1 mt-[-20px]',
                  idx < current ? 'bg-success-600' : 'bg-ink-200'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
