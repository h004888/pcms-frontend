// =====================================================
// Avatar — user avatar với fallback initials
// =====================================================

import clsx from 'clsx';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Color = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

interface AvatarProps {
  name: string;
  src?: string;
  alt?: string;
  size?: Size;
  color?: Color;
  /** Online indicator dot */
  online?: boolean;
  className?: string;
}

const sizeMap: Record<Size, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-2xl' },
};

const colorMap: Record<Color, string> = {
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  info: 'bg-info-100 text-info-700',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({
  name,
  src,
  alt,
  size = 'md',
  color = 'accent',
  online,
  className,
}: AvatarProps) {
  const sizes = sizeMap[size];
  const colors = colorMap[color];

  return (
    <div className={clsx('relative flex-shrink-0', className)}>
      <div
        className={clsx(
          'rounded-full overflow-hidden flex items-center justify-center font-bold',
          sizes.container,
          sizes.text,
          colors
        )}
        aria-label={alt ?? name}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name} className="w-full h-full object-cover" />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <span
          aria-label="Đang trực tuyến"
          className={clsx(
            'absolute -bottom-0.5 -right-0.5 border-2 border-white rounded-full bg-success-500',
            size === 'xs' ? 'w-2 h-2' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
}