// =====================================================
// InstallmentCalculator — Tính trả góp real-time
// 2 providers, 4 kỳ hạn, fee theo %/năm
// =====================================================

'use client';

import { useState, useMemo, useId } from 'react';
import { formatVND } from '@/lib/shop/format';
import clsx from 'clsx';

const PROVIDERS = [
  { id: 'home_credit', name: 'Home Credit', interestRate: 0, color: 'bg-danger-600' },
  { id: 'fe_credit', name: 'FE Credit', interestRate: 1.5, color: 'bg-primary-600' },
];

const TERMS = [3, 6, 9, 12];

export function InstallmentCalculator() {
  const [amount, setAmount] = useState(2000000);
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [term, setTerm] = useState(6);
  const amountId = useId();

  const selected = PROVIDERS.find((p) => p.id === provider)!;
  const { monthly, totalRepayment } = useMemo(() => {
    const total = amount * (1 + (selected.interestRate / 100) * (term / 12));
    return {
      monthly: Math.round(total / term),
      totalRepayment: Math.round(total),
    };
  }, [amount, selected, term]);

  return (
    <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
      <div>
        <label htmlFor={amountId} className="text-sm font-medium text-ink-900">
          Giá trị đơn hàng (VND)
        </label>
        <input
          id={amountId}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          step={100000}
          min={0}
          className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-ink-900 mb-2">Đơn vị trả góp</p>
        <div className="grid grid-cols-2 gap-2">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProvider(p.id)}
              aria-pressed={provider === p.id}
              className={clsx(
                'p-3 border-2 rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                provider === p.id
                  ? 'border-accent-600 bg-accent-50'
                  : 'border-ink-200 hover:border-ink-300'
              )}
            >
              <div className={clsx('w-2 h-2 rounded-full mb-1', p.color)} aria-hidden="true" />
              <p className="text-sm font-semibold text-ink-900">{p.name}</p>
              <p className="text-xs text-ink-500">
                {p.interestRate === 0 ? '0% lãi suất' : `${p.interestRate}% / năm`}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink-900 mb-2">Kỳ hạn</p>
        <div className="grid grid-cols-4 gap-2">
          {TERMS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTerm(t)}
              aria-pressed={term === t}
              className={clsx(
                'h-10 text-sm font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                term === t
                  ? 'bg-accent-600 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              )}
            >
              {t} tháng
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-md">
        <p className="text-xs text-ink-600">Trả hàng tháng</p>
        <p className="text-3xl font-bold text-accent-700 mt-1 font-mono">
          {formatVND(monthly)}
        </p>
        <div className="mt-3 pt-3 border-t border-accent-200 space-y-1 text-xs text-ink-600">
          <div className="flex justify-between">
            <span>Gốc</span>
            <span className="font-mono">{formatVND(amount)}</span>
          </div>
          {selected.interestRate > 0 && (
            <div className="flex justify-between">
              <span>Lãi ({selected.interestRate}% × {term}/12 tháng)</span>
              <span className="font-mono">{formatVND(totalRepayment - amount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink-900">
            <span>Tổng phải trả</span>
            <span className="font-mono">{formatVND(totalRepayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
