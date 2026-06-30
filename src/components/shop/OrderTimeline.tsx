// =====================================================
// OrderTimeline — Visual timeline cho order detail
// Status: PENDING → CONFIRMED → SHIPPING → DELIVERED
// Special: CANCELLED riêng
// SPRINT 4 - T12: types moved to @/types/order (OrderTimelineStatus, OrderTimelineEntry)
// =====================================================

import { Check, Clock, Truck, Package, X } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { OrderTimelineStatus, OrderTimelineEntry } from '@/types/order';

const STEPS: { id: OrderTimelineStatus; label: string; icon: typeof Check }[] = [
  { id: 'PENDING', label: 'Đã đặt', icon: Clock },
  { id: 'CONFIRMED', label: 'Xác nhận', icon: Check },
  { id: 'SHIPPING', label: 'Đang giao', icon: Truck },
  { id: 'DELIVERED', label: 'Hoàn tất', icon: Package },
];

export function OrderTimeline({
  status,
  timeline,
}: {
  status: OrderTimelineStatus;
  timeline: OrderTimelineEntry[];
}) {
  if (status === 'CANCELLED') {
    const cancelled = timeline.find((t) => t.status === 'CANCELLED')!;
    return (
      <div className="p-4 bg-danger-50 border border-danger-200 rounded-md flex items-start gap-3">
        <X className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-danger-900">Đơn hàng đã bị hủy</p>
          {cancelled.note && (
            <p className="text-xs text-danger-700 mt-0.5">{cancelled.note}</p>
          )}
          <p className="text-xs text-danger-600 mt-1 font-mono">
            {format(new Date(cancelled.at), "d 'tháng' M, yyyy 'lúc' HH:mm", { locale: vi })}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.id === status);

  return (
    <ol className="space-y-3" aria-label="Lịch sử trạng thái đơn hàng">
      {STEPS.map((step, idx) => {
        const reached = idx <= currentIdx;
        const event = timeline.find((t) => t.status === step.id);
        const Icon = step.icon;
        return (
          <li key={step.id} className="flex items-start gap-3">
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                reached ? 'bg-success-600 text-white' : 'bg-ink-100 text-ink-400'
              )}
              aria-hidden="true"
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-2 border-b border-ink-100 last:border-0">
              <p
                className={clsx('text-sm font-medium', reached ? 'text-ink-900' : 'text-ink-500')}
              >
                {step.label}
              </p>
              {event && (
                <p className="text-xs text-ink-500 mt-0.5 font-mono">
                  {format(new Date(event.at), "d 'tháng' M, yyyy 'lúc' HH:mm", { locale: vi })}
                  {event.note && ` · ${event.note}`}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
