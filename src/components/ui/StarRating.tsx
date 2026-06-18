// =====================================================
// StarRating — hiển thị + tương tác 1-5 sao
// Read-only: dùng cho review list
// Interactive: dùng cho form review/create
// =====================================================

'use client';

import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  /** Giá trị hiện tại 0-5 (0 = chưa rate) */
  value: number;
  /** Số review nếu hiển thị readonly */
  count?: number;
  /** Cho phép click để set rating */
  interactive?: boolean;
  /** Size: sm (12px) | md (16px) | lg (24px) */
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
  /** Label cho mỗi sao (a11y). Default: "N sao" */
  ariaLabel?: (n: number) => string;
  className?: string;
}

const sizeMap = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export function StarRating({
  value,
  count,
  interactive = false,
  size = 'md',
  onChange,
  ariaLabel,
  className,
}: StarRatingProps) {
  const handleClick = (n: number) => {
    if (!interactive || !onChange) return;
    onChange(n);
  };

  return (
    <div className={clsx('inline-flex items-center gap-1', className)}>
      <div
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={
          interactive
            ? 'Chọn số sao'
            : `${value} trên 5 sao${count ? `, ${count} đánh giá` : ''}`
        }
        className="inline-flex gap-0.5"
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          const half = !filled && n - 0.5 <= value;
          return (
            <button
              key={n}
              type="button"
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? value === n : undefined}
              aria-label={ariaLabel ? ariaLabel(n) : `${n} sao`}
              disabled={!interactive}
              onClick={() => handleClick(n)}
              className={clsx(
                'transition-transform',
                interactive && 'hover:scale-110 cursor-pointer',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={clsx(
                  sizeMap[size],
                  filled || half
                    ? 'text-warning-500 fill-warning-500'
                    : 'text-ink-200'
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-ink-500 font-mono">({count})</span>
      )}
    </div>
  );
}