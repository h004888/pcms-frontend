// =====================================================
// Skeleton — loading placeholder
// Variants: text, circle, block, card
// =====================================================

import clsx from 'clsx';

export interface SkeletonProps {
  className?: string;
  /** Width (CSS value). Default '100%'. */
  width?: string | number;
  /** Height (CSS value). Default '1em' (text-like). */
  height?: string | number;
  /** Border radius variant. Default 'md'. */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const radiusMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  className,
  width,
  height = '1em',
  rounded = 'md',
}: SkeletonProps) {
  return (
    <span
      role="status"
      aria-label="Đang tải"
      className={clsx(
        'inline-block bg-ink-200 animate-pulse',
        radiusMap[rounded],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// === Composite skeletons ===

/** Skeleton cho dòng text (paragraph). */
export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  );
}

/** Skeleton cho card. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'p-4 bg-white border border-ink-200 rounded-md space-y-3',
        className
      )}
    >
      <Skeleton width="100%" height="160px" rounded="md" />
      <SkeletonText lines={2} />
      <Skeleton width="40%" height="1.25rem" />
    </div>
  );
}

/** Skeleton cho ProductCard. */
export function SkeletonProductCard() {
  return (
    <div className="bg-white border border-ink-200 rounded-md overflow-hidden">
      <Skeleton width="100%" height="180px" rounded="none" />
      <div className="p-3 space-y-2">
        <Skeleton width="60%" height="0.75rem" />
        <SkeletonText lines={2} />
        <Skeleton width="40%" height="1.125rem" />
      </div>
    </div>
  );
}
