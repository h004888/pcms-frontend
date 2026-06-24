// =====================================================
// /orders — SHOP-ORDER-HISTORY (real API)
// Lịch sử đơn hàng — /api/v1/orders/history
// =====================================================

import Link from 'next/link';
import { fetchCustomerOrderHistory } from '@/features/customer-orders';
import type { Order, OrderStatus } from '@/features/customer-orders';
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

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-warning-50 text-warning-700', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-info-50 text-info-700', icon: Check },
  SHIPPING: { label: 'Đang giao', color: 'bg-accent-50 text-accent-700', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'bg-success-50 text-success-700', icon: Check },
  CANCELLED: { label: 'Đã hủy', color: 'bg-danger-50 text-danger-700', icon: X },
};

async function loadOrders(): Promise<Order[]> {
  try {
    const res = await fetchCustomerOrderHistory();
    return res.orders;
  } catch {
    return [];
  }
}

export default async function ShopOrderHistoryPage() {
  const orders = await loadOrders();

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
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-ink-900 mb-4">Đơn hàng của tôi</h1>
      <ul className="space-y-3">
        {orders.map((order) => {
          const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
          const Icon = meta.icon;
          return (
            <li key={order.id}>
              <Link
                href={`/don-hang/${order.id}`}
                className="block p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 font-mono">
                      #{order.code}
                    </p>
                    <p className="mt-1 text-xs text-ink-500 font-mono">
                      {format(new Date(order.createdAt), "d 'tháng' M, yyyy", {
                        locale: vi,
                      })}
                      {' · '}
                      {order.items.length} sản phẩm
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-2 h-6 text-xs font-semibold rounded',
                        meta.color
                      )}
                    >
                      <Icon className="w-3 h-3" aria-hidden="true" />
                      {meta.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-ink-500">Tổng cộng</span>
                  <span className="text-base font-bold text-accent-700 font-mono">
                    {formatVND(order.total)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}