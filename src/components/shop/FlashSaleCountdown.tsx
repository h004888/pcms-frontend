// =====================================================
// FlashSaleCountdown — đếm ngược thời gian thực
// Hiển thị cho upcoming / live / ended states
// =====================================================

'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { Clock, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  startTime: string;
  endTime: string;
  /** Layout: 'inline' (compact pill) | 'block' (large grid) */
  variant?: 'inline' | 'block';
}

export function FlashSaleCountdown({ startTime, endTime, variant = 'inline' }: Props) {
  const startMs = new Date(startTime).getTime();
  const endMs = new Date(endTime).getTime();
  const toStart = useCountdown(startTime);
  const toEnd = useCountdown(endTime);

  const now = Date.now();
  const isUpcoming = now < startMs;
  const isLive = now >= startMs && now < endMs;
  const isEnded = now >= endMs;

  if (isEnded) {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1 text-xs font-medium text-ink-500',
          variant === 'block' && 'text-sm'
        )}
      >
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        Đã kết thúc
      </span>
    );
  }

  const target = isUpcoming ? toStart : toEnd;
  const label = isUpcoming ? 'Bắt đầu sau' : 'Còn lại';

  if (variant === 'block') {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-2 px-3 py-2 rounded-md',
          isLive ? 'bg-danger-600 text-white' : 'bg-info-50 text-info-700 border border-info-200'
        )}
      >
        <Zap className="w-4 h-4 animate-pulse" aria-hidden="true" />
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">{label}:</span>
          <CountdownDisplay t={target} large />
        </div>
      </div>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 h-6 rounded text-xs font-mono font-semibold',
        isLive ? 'bg-danger-600 text-white' : 'bg-info-100 text-info-700'
      )}
    >
      <Zap className="w-3 h-3" aria-hidden="true" />
      <span className="font-sans font-medium mr-0.5">{label}:</span>
      <CountdownDisplay t={target} />
    </span>
  );
}

function CountdownDisplay({ t, large }: { t: ReturnType<typeof useCountdown>; large?: boolean }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const size = large ? 'text-base' : 'text-xs';
  return (
    <span className={clsx('font-mono tabular-nums', size)}>
      {t.days > 0 && (
        <>
          {t.days}d {pad(t.hours)}:{pad(t.minutes)}
          {t.total < 86400 && `:${pad(t.seconds)}`}
        </>
      )}
      {t.days === 0 && (
        <>
          {pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}
        </>
      )}
    </span>
  );
}
