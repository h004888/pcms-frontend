// =====================================================
// Chip — filter/tag chip với variant
// Dùng cho filter pills, tag selection
// =====================================================

'use client';

import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type Size = 'sm' | 'md';

interface ChipProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  /** ARIA role override. Mặc định 'button' nếu onClick, 'status' nếu read-only. */
  role?: 'button' | 'status';
  ariaLabel?: string;
}

const variantMap: Record<Variant, { base: string; selected: string; removable: string }> = {
  default: {
    base: 'bg-ink-100 text-ink-700 border border-ink-200',
    selected: 'bg-ink-900 text-white border-ink-900',
    removable: 'bg-ink-100 text-ink-700 border border-ink-200 pr-1',
  },
  primary: {
    base: 'bg-primary-50 text-primary-700 border border-primary-200',
    selected: 'bg-primary-600 text-white border-primary-600',
    removable: 'bg-primary-50 text-primary-700 border border-primary-200 pr-1',
  },
  success: {
    base: 'bg-success-50 text-success-700 border border-success-200',
    selected: 'bg-success-600 text-white border-success-600',
    removable: 'bg-success-50 text-success-700 border border-success-200 pr-1',
  },
  warning: {
    base: 'bg-warning-50 text-warning-700 border border-warning-200',
    selected: 'bg-warning-600 text-white border-warning-600',
    removable: 'bg-warning-50 text-warning-700 border border-warning-200 pr-1',
  },
  danger: {
    base: 'bg-danger-50 text-danger-700 border border-danger-200',
    selected: 'bg-danger-600 text-white border-danger-600',
    removable: 'bg-danger-50 text-danger-700 border border-danger-200 pr-1',
  },
  info: {
    base: 'bg-info-50 text-info-700 border border-info-200',
    selected: 'bg-info-600 text-white border-info-600',
    removable: 'bg-info-50 text-info-700 border border-info-200 pr-1',
  },
};

const sizeMap: Record<Size, string> = {
  sm: 'h-6 px-2 text-[10px]',
  md: 'h-8 px-3 text-xs',
};

export function Chip({
  children,
  variant = 'default',
  size = 'md',
  selected,
  removable,
  onClick,
  onRemove,
  className,
  role,
  ariaLabel,
}: ChipProps) {
  const isInteractive = !!onClick || !!onRemove;
  const inferredRole = role ?? (isInteractive ? 'button' : 'status');
  const styles = variantMap[variant];

  const isSelected = !!selected;
  const currentVariant = isSelected ? styles.selected : removable ? styles.removable : styles.base;

  const Component = isInteractive ? 'button' : 'span';

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      onClick={onClick}
      role={inferredRole}
      aria-pressed={isInteractive ? isSelected : undefined}
      aria-label={ariaLabel}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        sizeMap[size],
        currentVariant,
        onClick && !isSelected && 'hover:opacity-80 cursor-pointer',
        className
      )}
    >
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Xóa"
          className="ml-0.5 -mr-1 w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
    </Component>
  );
}