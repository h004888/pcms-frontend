// =====================================================
// FormField — wrapper cho input/select/textarea với label + error
// Reuse trong nhiều forms (auth, checkout, reviews, ...)
// =====================================================

import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import clsx from 'clsx';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-ink-900 block mb-1"
      >
        {label}
        {required && <span className="text-danger-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p
          className="mt-1 text-xs text-danger-600 flex items-center gap-1"
          role="alert"
        >
          <X className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}

/** Helper: input className với error styling */
export function inputClass(hasError: boolean, mono = false): string {
  return clsx(
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2',
    mono && 'font-mono',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200'
  );
}