// =====================================================
// /orders — SHOP-ORDER-HISTORY: Danh sách đơn hàng
// =====================================================

import Link from 'next/link';
import {
  MOCK_ORDERS,
  STATUS_LABELS,
  PAYMENT_LABELS,
  type OrderStatus,
} from '@/data/shop/orders';
import { EmptyState } from '@/components/ui/Feedback';
import { Package, ChevronRight, Clock, Check, Truck, X } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatVND } from '@/lib/shop/format';
import clsx from 'clsx';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi',
  description: 'Lịch sử và trạng thái đơn hàng PCMS.',
};

const ICON_MAP = { clock: Clock, check: Check, truck: Truck, package: Package, x: X };

export default function ShopOrderHistoryPage() {
  const orders = MOCK_ORDERS;

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={Package}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm."
          action={
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">Đơn hàng của tôi</h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {orders.map((order) => {
          const badge = STATUS_LABELS[order.status as OrderStatus];
          const Icon = ICON_MAP[badge.icon];
          const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
          return (
            <Link
              key={order.id}
              href={`/don-hang/${order.id}`}
              className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900 font-mono">
                    #{order.code}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5 font-mono">
                    {format(new Date(order.createdAt), "d 'tháng' M, yyyy", { locale: vi })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-2.5 h-6 rounded-full text-xs font-semibold',
                      badge.class
                    )}
                  >
                    <Icon className="w-3 h-3" aria-hidden="true" />
                    {badge.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-ink-400" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-ink-100">
                <p className="text-sm text-ink-600">
                  <span className="font-mono font-semibold text-ink-900">
                    {order.items.length}
                  </span>{' '}
                  sản phẩm ·{' '}
                  <span className="font-mono">
                    {totalQty}
                  </span>{' '}
                  đơn vị
                </p>
                <p className="text-base font-bold text-accent-700 font-mono">
                  {formatVND(order.total)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
