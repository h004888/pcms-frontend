// =====================================================
// PCMS - Select / Textarea / Checkbox components
// =====================================================

'use client';

import { SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import clsx from 'clsx';

// === Select ===
interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, required, placeholder, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-ink-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'block w-full rounded-md border bg-white py-2 pl-3 pr-8 text-sm text-ink-900',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-ink-50 disabled:text-ink-500',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-ink-300 focus:border-accent-500 focus:ring-accent-200',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
        {!error && hint && <p id={`${selectId}-hint`} className="mt-1 text-xs text-ink-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// === Textarea ===
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const taId = id || `ta-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={taId} className="block text-sm font-medium text-ink-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={taId}
          className={clsx(
            'block w-full rounded-md border bg-white py-2 px-3 text-sm text-ink-900 placeholder:text-ink-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-ink-50',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-ink-300 focus:border-accent-500 focus:ring-accent-200',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${taId}-error` : hint ? `${taId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${taId}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
        {!error && hint && <p id={`${taId}-hint`} className="mt-1 text-xs text-ink-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// === Checkbox ===
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const cbId = id || `cb-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <label htmlFor={cbId} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          id={cbId}
          type="checkbox"
          className={clsx(
            'h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-1',
            className
          )}
          {...props}
        />
        {label && <span className="text-sm text-ink-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
