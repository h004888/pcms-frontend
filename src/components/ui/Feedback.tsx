// =====================================================
// PCMS - EmptyState, LoadingSpinner, StatCard
// =====================================================

import clsx from 'clsx';
import { ReactNode } from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Không có dữ liệu',
  description,
  action,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="w-12 h-12 text-gray-300 mb-3" />
      <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size];
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-primary-500 border-t-transparent',
          sizeClass
        )}
      ></div>
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'primary',
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  color?: 'primary' | 'medical' | 'warning' | 'danger';
}) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    medical:  'bg-medical-50 text-medical-600',
    warning:  'bg-yellow-50 text-yellow-600',
    danger:   'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={clsx(
              'text-xs mt-1',
              trendDirection === 'up' && 'text-medical-600',
              trendDirection === 'down' && 'text-red-600',
              trendDirection === 'flat' && 'text-gray-500'
            )}>
              {trend}
            </p>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
