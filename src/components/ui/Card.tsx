// =====================================================
// PCMS - Card, Badge, Alert components (vivid edition)
// Upgrades:
//   • Card có `tone` prop để accent với full border + bg tint (không dùng border-left)
//   • Card hover variant nâng cao
// =====================================================

import clsx from 'clsx';
import { HTMLAttributes, ReactNode, useId } from 'react';

// === Card ===
type CardTone = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'ink';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  bodyClassName?: string;
  /**
   * Tone màu cho Card — dùng để nhấn mạnh semantic (success/danger/warning).
   * Áp dụng full border + bg tint, không dùng border-left stripe (banned).
   */
  tone?: CardTone;
  /**
   * Hover lift effect — dùng cho cards cần click (vd: dashboard tile).
   * Bật: card nhô lên nhẹ + border đậm hơn khi hover.
   */
  interactive?: boolean;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4';
}

const cardToneClasses: Record<CardTone, string> = {
  default: 'bg-white border-ink-200',
  accent:  'bg-accent-50/30 border-accent-200',
  info:    'bg-info-50/30 border-info-200',
  success: 'bg-success-50/30 border-success-200',
  warning: 'bg-warning-50/30 border-warning-200',
  danger:  'bg-danger-50/30 border-danger-200',
  ink:     'bg-ink-50/30 border-ink-300',
};

export function Card({
  title, subtitle, actions, bodyClassName, className, children, id, titleAs = 'h3',
  tone = 'default', interactive = false, ...props
}: CardProps) {
  const generatedId = useId();
  const titleId = id ?? `card-title-${generatedId}`;
  const isRegion = Boolean(title);

  const renderTitle = () => {
    if (!title) return null;
    const cn = 'text-base font-semibold text-ink-900';
    switch (titleAs) {
      case 'h1': return <h1 id={titleId} className={clsx(cn, 'text-2xl tracking-tight')}>{title}</h1>;
      case 'h2': return <h2 id={titleId} className={clsx(cn, 'text-xl tracking-tight')}>{title}</h2>;
      case 'h4': return <h4 id={titleId} className={cn}>{title}</h4>;
      case 'h3':
      default:   return <h3 id={titleId} className={cn}>{title}</h3>;
    }
  };

  return (
    <div
      className={clsx(
        'rounded-lg border',
        cardToneClasses[tone],
        interactive && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5 cursor-pointer',
        className
      )}
      role={isRegion ? 'region' : undefined}
      aria-labelledby={isRegion ? titleId : undefined}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200/70">
          <div>
            {renderTitle()}
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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'accent';
}

const badgeVariants = {
  default: 'bg-ink-100 text-ink-800',
  success: 'bg-accent-100 text-accent-800',
  warning: 'bg-warning-100 text-warning-800',
  danger:  'bg-danger-100 text-danger-700',
  info:    'bg-info-100 text-info-800',
  gray:    'bg-ink-100 text-ink-700',
  accent:  'bg-accent-600 text-white',
};

const statusVariants = new Set(['success', 'warning', 'danger', 'info', 'default', 'accent']);

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const isStatus = statusVariants.has(variant);
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 h-5 rounded text-xs font-medium',
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
  info:    'bg-info-50 border-info-200 text-info-800',
  success: 'bg-accent-50 border-accent-200 text-accent-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  danger:  'bg-danger-50 border-danger-200 text-danger-800',
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
