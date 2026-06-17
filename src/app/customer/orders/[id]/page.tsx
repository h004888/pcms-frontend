// =====================================================
// /orders/[id] — SHOP-ORDER-TRACK: Chi tiết đơn hàng
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ORDERS, PAYMENT_LABELS, SHIPPING_LABELS } from '@/data/shop/orders';
import { OrderTimeline } from '@/components/shop/OrderTimeline';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return MOCK_ORDERS.map((o) => ({ id: o.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) return { title: 'Không tìm thấy đơn hàng' };
  return {
    title: `Đơn hàng ${order.code}`,
    description: `Chi tiết đơn hàng ${order.code}`,
  };
}

export default function ShopOrderTrackPage({ params }: PageProps) {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) notFound();

  const subtotal = order.total - order.shippingFee;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Đơn hàng', href: '/customer/orders' },
              { label: order.code },
            ]}
          />
          <h1 className="mt-3 text-xl font-bold text-ink-900 font-mono">
            Đơn hàng #{order.code}
          </h1>
          <p className="text-sm text-ink-500 font-mono">
            Đặt ngày{' '}
            {format(new Date(order.createdAt), "d 'tháng' M, yyyy 'lúc' HH:mm", { locale: vi })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Trạng thái đơn hàng
          </h2>
          <OrderTimeline status={order.status} timeline={order.timeline} />
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Sản phẩm ({order.items.length})
          </h2>
          <ul className="divide-y divide-ink-100">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900 line-clamp-1 text-balance">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-ink-500 font-mono mt-0.5">
                    {item.qty} × {formatVND(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink-900 font-mono">
                  {formatVND(item.unitPrice * item.qty)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">
            Thông tin giao hàng
          </h2>
          <div className="text-sm space-y-1">
            <p>
              <strong>Người nhận:</strong> {order.address.name} · {order.address.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.address.line}, {order.address.province}
            </p>
            <p>
              <strong>Vận chuyển:</strong>{' '}
              {SHIPPING_LABELS[order.shippingMethod] ?? order.shippingMethod}
            </p>
            <p>
              <strong>Thanh toán:</strong>{' '}
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-600">Tạm tính</span>
            <span className="text-sm font-medium text-ink-900 font-mono">
              {formatVND(subtotal)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-600">Phí vận chuyển</span>
            <span className="text-sm font-medium text-ink-900 font-mono">
              {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-ink-200 flex items-center justify-between">
            <span className="text-base font-semibold text-ink-900">Tổng cộng</span>
            <span className="text-xl font-bold text-accent-700 font-mono">
              {formatVND(order.total)}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/customer/orders"
            className="text-sm text-accent-700 hover:underline"
          >
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
