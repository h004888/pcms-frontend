// =====================================================
// PCMS - Card, Badge, Alert components
// =====================================================

import clsx from 'clsx';
import { HTMLAttributes, ReactNode, useId } from 'react';

// === Card ===
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  bodyClassName?: string;
}

export function Card({ title, subtitle, actions, bodyClassName, className, children, id, ...props }: CardProps) {
  // Stable id for aria-labelledby when title is provided
  const generatedId = useId();
  const titleId = id ?? `card-title-${generatedId}`;
  const isRegion = Boolean(title);

  return (
    <div
      className={clsx('bg-white rounded-lg border border-ink-200', className)}
      role={isRegion ? 'region' : undefined}
      aria-labelledby={isRegion ? titleId : undefined}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200">
          <div>
            {title && <h3 id={titleId} className="text-base font-semibold text-ink-900">{title}</h3>}
            {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx('px-5 py-4', bodyClassName)}>{children}</div>
    </div>
  );
}

// === Badge ===
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
}

const badgeVariants = {
  default: 'bg-ink-100 text-ink-800',
  success: 'bg-accent-100 text-accent-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger:  'bg-red-100 text-red-800',
  info:    'bg-blue-100 text-blue-800',
  gray:    'bg-ink-100 text-ink-700',
};

// Variants that communicate a status to assistive tech
const statusVariants = new Set(['success', 'warning', 'danger', 'info', 'default']);

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const isStatus = statusVariants.has(variant);
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        badgeVariants[variant],
        className
      )}
      role={isStatus ? 'status' : undefined}
      {...props}
    >
      {children}
    </span>
  );
}

// === Alert ===
interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  onClose?: () => void;
}

const alertVariants = {
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-accent-50 border-accent-200 text-accent-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  danger:  'bg-red-50 border-red-200 text-red-800',
};

const alertIcon = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  danger:  '⛔',
};

export function Alert({ variant = 'info', title, onClose, className, children, ...props }: AlertProps) {
  return (
    <div
      className={clsx('flex items-start gap-3 px-4 py-3 rounded-md border', alertVariants[variant], className)}
      role="alert"
      {...props}
    >
      <span className="text-xl leading-none" aria-hidden="true">{alertIcon[variant]}</span>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="text-current opacity-60 hover:opacity-100 -m-2 p-2 rounded transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1"
        >
          ✕
        </button>
      )}
    </div>
  );
}
