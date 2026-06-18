// =====================================================
// ConfirmDialog — modal xác nhận thay thế window.confirm()
// Mobile-friendly, accessible, keyboard support
// =====================================================

'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import clsx from 'clsx';

type Variant = 'default' | 'danger' | 'warning';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: Variant;
  /** Loading state cho confirm button */
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: null,
    iconClass: '',
    buttonClass: '',
  },
  danger: {
    icon: AlertTriangle,
    iconClass: 'bg-danger-100 text-danger-600',
    buttonClass: 'bg-danger-600 hover:bg-danger-700',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-warning-100 text-warning-600',
    buttonClass: 'bg-warning-600 hover:bg-warning-700',
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Huỷ',
  variant = 'default',
  loading,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl">
        <div className="flex items-start gap-3 p-5">
          {Icon && (
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                cfg.iconClass
              )}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-ink-900">
              {title}
            </h2>
            {description && (
              <div id="confirm-desc" className="mt-1 text-sm text-ink-600">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-1 text-ink-400 hover:text-ink-700 rounded"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex gap-2 p-4 border-t border-ink-200 justify-end">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              'px-4 h-10 text-sm font-semibold text-white rounded-md transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
              cfg.buttonClass || 'bg-accent-600 hover:bg-accent-700'
            )}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}