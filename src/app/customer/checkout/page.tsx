// =====================================================
// /checkout — SHOP-CHECKOUT: 4-step flow
// 0. Address → 1. Shipping → 2. Payment → 3. Confirm
// Dùng useCart() context, clear cart khi đặt hàng
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/shop/cart-context';
import { CheckoutStepper } from '@/components/shop/CheckoutStepper';
import { formatVND } from '@/lib/shop/format';
import { MapPin, Truck, CreditCard, Check, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Link from 'next/link';

const STEPS = ['Địa chỉ', 'Vận chuyển', 'Thanh toán', 'Xác nhận'];

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Tiêu chuẩn', desc: '2–3 ngày', fee: 30000 },
  { id: 'express', label: 'Nhanh', desc: 'Trong ngày (HCM/HN)', fee: 60000 },
  { id: 'pickup', label: 'Nhận tại nhà thuốc', desc: 'Miễn phí', fee: 0 },
];

const PAYMENT_METHODS: Record<string, string> = {
  cod: 'Tiền mặt (COD)',
  card: 'Thẻ tín dụng/ghi nợ',
  qr: 'QR Pay (VietQR, MoMo)',
  wallet: 'Ví điện tử',
};

const PAYMENT_ICONS: Record<string, string> = {
  cod: '💵',
  card: '💳',
  qr: '📱',
  wallet: '👛',
};

export default function ShopCheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    line: '',
    province: '',
  });

  // Pre-hydration: render skeleton
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-8 w-32 bg-ink-200 rounded animate-pulse" />
      </div>
    );
  }

  // Empty cart: trỏ về giỏ
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-ink-600 mb-4">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const shipFee = SHIPPING_METHODS.find((m) => m.id === shipping)!.fee;
  const total = subtotal + shipFee;

  const handleNext = () => {
    if (step === 0) {
      if (!address.name || !address.phone || !address.line || !address.province) {
        toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
        return;
      }
    }
    if (step < 3) setStep(step + 1);
    else {
      // Place order
      toast.success('Đặt hàng thành công!');
      clear();
      router.push('/customer/orders');
    }
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl font-bold text-ink-900 text-balance">Thanh toán</h1>
          <div className="mt-4">
            <CheckoutStepper current={step} steps={STEPS} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-5 bg-white border border-ink-200 rounded-md">
          {step === 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <MapPin className="w-4 h-4" aria-hidden="true" /> Địa chỉ giao hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: 'name', label: 'Họ tên *', placeholder: 'Nguyễn Văn A' },
                  { key: 'phone', label: 'Số điện thoại *', placeholder: '0901234567' },
                ].map((f) => (
                  <div key={f.key}>
                    <label htmlFor={f.key} className="text-sm font-medium text-ink-900">
                      {f.label}
                    </label>
                    <input
                      id={f.key}
                      value={(address as Record<string, string>)[f.key]}
                      onChange={(e) =>
                        setAddress({ ...address, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="line" className="text-sm font-medium text-ink-900">
                    Địa chỉ *
                  </label>
                  <input
                    id="line"
                    value={address.line}
                    onChange={(e) => setAddress({ ...address, line: e.target.value })}
                    placeholder="Số nhà, đường, phường/xã"
                    className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="province" className="text-sm font-medium text-ink-900">
                    Tỉnh/Thành phố *
                  </label>
                  <input
                    id="province"
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    placeholder="TP. Hồ Chí Minh"
                    className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <Truck className="w-4 h-4" aria-hidden="true" /> Phương thức vận chuyển
              </h2>
              <div className="space-y-2">
                {SHIPPING_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setShipping(m.id)}
                    aria-pressed={shipping === m.id}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                      shipping === m.id
                        ? 'border-accent-600 bg-accent-50'
                        : 'border-ink-200 hover:border-ink-300'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-4 h-4 rounded-full border-2 flex-shrink-0',
                        shipping === m.id
                          ? 'border-accent-600 bg-accent-600'
                          : 'border-ink-300'
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{m.label}</p>
                      <p className="text-xs text-ink-500">{m.desc}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink-900 font-mono">
                      {m.fee === 0 ? 'Miễn phí' : formatVND(m.fee)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <CreditCard className="w-4 h-4" aria-hidden="true" /> Phương thức thanh toán
              </h2>
              <div className="space-y-2">
                {Object.entries(PAYMENT_METHODS).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    aria-pressed={payment === id}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                      payment === id
                        ? 'border-accent-600 bg-accent-50'
                        : 'border-ink-200 hover:border-ink-300'
                    )}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {PAYMENT_ICONS[id]}
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink-900">
                      {label}
                    </span>
                    <div
                      className={clsx(
                        'w-4 h-4 rounded-full border-2 flex-shrink-0',
                        payment === id
                          ? 'border-accent-600 bg-accent-600'
                          : 'border-ink-300'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto bg-success-50 rounded-full flex items-center justify-center mb-3">
                <Check className="w-8 h-8 text-success-600" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-ink-900">Xác nhận đơn hàng</h2>
              <p className="mt-2 text-sm text-ink-600 text-pretty">
                Đơn hàng của bạn đã sẵn sàng. Nhấn &quot;Đặt hàng&quot; để hoàn tất.
              </p>
              <div className="mt-4 p-3 bg-ink-50 rounded-md text-left text-sm space-y-1">
                <p>
                  <strong>Giao đến:</strong> {address.name} · {address.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {address.line}, {address.province}
                </p>
                <p>
                  <strong>Vận chuyển:</strong>{' '}
                  {SHIPPING_METHODS.find((m) => m.id === shipping)!.label}
                </p>
                <p>
                  <strong>Thanh toán:</strong> {PAYMENT_METHODS[payment]}
                </p>
                <p>
                  <strong>Sản phẩm:</strong>{' '}
                  <span className="font-mono">{items.length}</span> món,{' '}
                  <span className="font-mono">{items.reduce((s, i) => s + i.qty, 0)}</span> đơn vị
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-ink-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 h-10 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Quay lại
            </button>
            <div className="text-right">
              <p className="text-xs text-ink-500">Tổng cộng</p>
              <p className="text-lg font-bold text-accent-700 font-mono">
                {formatVND(total)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              {step === 3 ? 'Đặt hàng' : 'Tiếp tục'}
              {step < 3 && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
