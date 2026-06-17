// =====================================================
// PriceDisplay — VND price with optional original + discount badge
// Variants: default (large), compact (small), inline (text-only)
// =====================================================

import clsx from 'clsx';
import { formatVND } from '@/lib/shop/format';

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  /** Unit label shown below price (e.g. "/ Hộp") */
  unit?: string;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  /** Show discount % badge. Default true khi có originalPrice. */
  showDiscount?: boolean;
}

export function PriceDisplay({
  price,
  originalPrice,
  discountPercent,
  unit,
  variant = 'default',
  className,
  showDiscount = true,
}: PriceDisplayProps) {
  const hasOriginal = originalPrice !== undefined && originalPrice > price;
  const discount =
    discountPercent ??
    (hasOriginal ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0);

  if (variant === 'inline') {
    return (
      <span className={clsx('inline-flex items-baseline gap-2 font-mono', className)}>
        <span className="font-semibold text-accent-700">{formatVND(price)}</span>
        {hasOriginal && (
          <span className="text-xs text-ink-400 line-through">{formatVND(originalPrice!)}</span>
        )}
      </span>
    );
  }

  const compact = variant === 'compact';

  return (
    <div className={clsx('flex items-baseline gap-2 flex-wrap', className)}>
      <span
        className={clsx(
          'font-bold text-accent-700 font-mono',
          compact ? 'text-base' : 'text-2xl md:text-3xl'
        )}
      >
        {formatVND(price)}
      </span>
      {hasOriginal && (
        <span
          className={clsx(
            'text-ink-400 line-through font-mono',
            compact ? 'text-xs' : 'text-sm'
          )}
        >
          {formatVND(originalPrice!)}
        </span>
      )}
      {showDiscount && hasOriginal && discount > 0 && (
        <span
          className={clsx(
            'inline-flex items-center bg-danger-600 text-white font-semibold rounded',
            compact ? 'px-1.5 h-5 text-[10px]' : 'px-2 h-6 text-xs'
          )}
        >
          -{discount}%
        </span>
      )}
      {unit && (
        <span className={clsx('text-ink-500', compact ? 'text-[10px]' : 'text-xs')}>
          / {unit}
        </span>
      )}
    </div>
  );
}
