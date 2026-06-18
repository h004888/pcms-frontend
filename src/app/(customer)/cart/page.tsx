// =====================================================
// /cart — SHOP-CART (polished)
// Apply voucher thật (logic), free-ship progress, qty controls
// =====================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/shop/cart-context';
import { CartItemRow } from '@/components/shop/CartItemRow';
import { EmptyState } from '@/components/ui/Feedback';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatVND } from '@/lib/shop/format';
import {
  ShoppingCart,
  ArrowRight,
  Tag,
  Truck,
  X,
  Check,
  ChevronRight,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 200000;
const SHIPPING_FEE = 30000;

// Voucher catalog (mock)
const VOUCHERS = {
  WELCOME10: { type: 'percent' as const, value: 10, minSpend: 200000 },
  FREESHIP50K: { type: 'fixed' as const, value: 50000, minSpend: 300000 },
  SUMMER25: { type: 'percent' as const, value: 25, minSpend: 0 },
};

export default function ShopCartPage() {
  const { items, subtotal, hydrated } = useCart();
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState('');

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
  const freeShipNeed = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Voucher discount
  let discount = 0;
  if (appliedVoucher && VOUCHERS[appliedVoucher as keyof typeof VOUCHERS]) {
    const v = VOUCHERS[appliedVoucher as keyof typeof VOUCHERS];
    if (subtotal >= v.minSpend) {
      discount = v.type === 'percent' ? Math.round((subtotal * v.value) / 100) : v.value;
    }
  }

  const total = subtotal + shippingFee - discount;

  const applyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    setVoucherError('');
    if (!code) {
      setVoucherError('Vui lòng nhập mã');
      return;
    }
    const v = VOUCHERS[code as keyof typeof VOUCHERS];
    if (!v) {
      setVoucherError('Mã không hợp lệ hoặc đã hết hạn');
      toast.error('Mã voucher không hợp lệ');
      return;
    }
    if (subtotal < v.minSpend) {
      setVoucherError(
        `Đơn tối thiểu ${formatVND(v.minSpend)} để dùng mã này`
      );
      toast.error('Chưa đủ điều kiện');
      return;
    }
    setAppliedVoucher(code);
    setVoucherCode('');
    toast.success(`Áp dụng mã ${code} thành công`);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
    toast.success('Đã bỏ mã voucher');
  };

  const checkout = () => {
    toast.success('Đang chuyển sang thanh toán...');
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 500);
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-ink-900 text-balance">Giỏ hàng của bạn</h1>
          <p className="mt-1 text-sm text-ink-600 font-mono">
            {items.length} sản phẩm · {items.reduce((s, i) => s + i.qty, 0)} đơn vị
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

            {/* Continue shopping */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-accent-700 hover:text-accent-800"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
              <h2 className="text-base font-semibold text-ink-900">Tóm tắt đơn hàng</h2>

              {/* Voucher input */}
              <div>
                <label htmlFor="voucher" className="text-sm font-medium text-ink-900 block mb-1">
                  Mã giảm giá
                </label>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between gap-2 p-2 bg-success-50 border border-success-200 rounded-md">
                    <div className="flex items-center gap-2 min-w-0">
                      <Check className="w-4 h-4 text-success-700 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm font-mono font-semibold text-success-900 truncate">
                        {appliedVoucher}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      aria-label="Bỏ mã voucher"
                      className="p-1 text-success-700 hover:text-danger-600 rounded"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                          aria-hidden="true"
                        />
                        <input
                          id="voucher"
                          type="text"
                          value={voucherCode}
                          onChange={(e) => {
                            setVoucherCode(e.target.value);
                            setVoucherError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              applyVoucher();
                            }
                          }}
                          placeholder="WELCOME10, FREESHIP50K..."
                          className={`w-full h-9 pl-9 pr-3 text-sm font-mono border rounded-md focus:outline-none focus:ring-2 ${
                            voucherError
                              ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
                              : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200'
                          }`}
                          aria-invalid={!!voucherError}
                          aria-describedby={voucherError ? 'voucher-err' : undefined}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={applyVoucher}
                        className="px-3 h-9 bg-ink-900 text-white text-sm font-medium rounded-md hover:bg-ink-800 transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {voucherError && (
                      <p id="voucher-err" className="mt-1 text-xs text-danger-600 flex items-center gap-1">
                        <X className="w-3 h-3" aria-hidden="true" />
                        {voucherError}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-ink-500">
                      Thử: <code className="font-mono">WELCOME10</code>,{' '}
                      <code className="font-mono">FREESHIP50K</code>,{' '}
                      <code className="font-mono">SUMMER25</code>
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <Row label="Tạm tính" value={formatVND(subtotal)} />
                <Row
                  label="Phí vận chuyển"
                  value={
                    shippingFee === 0 ? (
                      <span className="text-success-700 font-medium">Miễn phí</span>
                    ) : (
                      formatVND(shippingFee)
                    )
                  }
                />
                {discount > 0 && (
                  <Row
                    label={
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3" aria-hidden="true" />
                        Giảm giá ({appliedVoucher})
                      </span>
                    }
                    value={
                      <span className="text-success-700">−{formatVND(discount)}</span>
                    }
                  />
                )}
                <div className="pt-3 border-t border-ink-200 flex justify-between items-baseline">
                  <span className="text-base font-semibold text-ink-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-accent-700 font-mono">
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={checkout}
                className="w-full h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                Tiến hành thanh toán
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {freeShipNeed > 0 ? (
                <div>
                  <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full transition-all"
                      style={{ width: `${freeShipProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-500 text-center flex items-center justify-center gap-1">
                    <Truck className="w-3 h-3" aria-hidden="true" />
                    Mua thêm{' '}
                    <span className="font-mono font-semibold text-accent-700">
                      {formatVND(freeShipNeed)}
                    </span>{' '}
                    để được miễn phí vận chuyển
                  </p>
                </div>
              ) : (
                <p className="text-xs text-success-700 text-center flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3" aria-hidden="true" />
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

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-600">{label}</span>
      <span className="font-medium text-ink-900 font-mono">{value}</span>
    </div>
  );
}