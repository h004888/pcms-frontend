// =====================================================
// /cart — SHOP-CART: Giỏ hàng
// Dùng useCart() từ CartContext
// force-dynamic: cart state là client-side (localStorage)
// =====================================================

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/shop/cart-context';
import { CartItemRow } from '@/components/shop/CartItemRow';
import { EmptyState } from '@/components/ui/Feedback';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatVND } from '@/lib/shop/format';
import { ShoppingCart, ArrowRight, Tag, Truck } from 'lucide-react';
const FREE_SHIPPING_THRESHOLD = 200000;
const SHIPPING_FEE = 30000;

export default function ShopCartPage() {
  const { items, subtotal, hydrated } = useCart();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-3">
        <Skeleton height="32px" width="200px" />
        <Skeleton height="120px" />
        <Skeleton height="120px" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingCart}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng."
          action={
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
            >
              Khám phá sản phẩm
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          }
        />
      </div>
    );
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const freeShipNeed = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">
            {items.length} sản phẩm
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Cart items */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
              <h2 className="text-base font-semibold text-ink-900">Tóm tắt đơn hàng</h2>

              {/* Voucher input (UI mock, không apply thật) */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    aria-label="Mã giảm giá"
                    className="w-full h-9 pl-9 pr-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 h-9 bg-ink-100 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-600">Tạm tính</span>
                  <span className="font-medium text-ink-900 font-mono">
                    {formatVND(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Phí vận chuyển</span>
                  <span className="font-medium text-ink-900 font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-success-700">Miễn phí</span>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-ink-200 flex justify-between items-baseline">
                  <span className="text-base font-semibold text-ink-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-accent-700 font-mono">
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/customer/checkout')}
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {freeShipNeed > 0 ? (
                <p className="text-xs text-ink-500 text-center flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                  Mua thêm{' '}
                  <span className="font-mono font-semibold text-accent-700">
                    {formatVND(freeShipNeed)}
                  </span>{' '}
                  để được miễn phí vận chuyển
                </p>
              ) : (
                <p className="text-xs text-success-700 text-center flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                  Đơn hàng được miễn phí vận chuyển
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
