// =====================================================
// /checkout — SHOP-CHECKOUT (polished)
// Full validation cho 4 steps + persist state localStorage
// =====================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/shop/cart-context';
import { CheckoutStepper } from '@/components/shop/CheckoutStepper';
import { checkoutConfirm, checkoutPreview } from '@/features/cart';
import { useAuth } from '@/lib/auth/auth-context';
import { formatVND } from '@/lib/shop/format';
import { MapPin, Truck, CreditCard, Check, ChevronRight, ChevronLeft, Wallet, Banknote, CreditCard as CardIcon, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Link from 'next/link';

const STEPS = ['Địa chỉ', 'Vận chuyển', 'Thanh toán', 'Xác nhận'];

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Tiêu chuẩn', desc: '2–3 ngày', fee: 30000, icon: Truck },
  { id: 'express', label: 'Nhanh', desc: 'Trong ngày (HCM/HN)', fee: 60000, icon: Truck },
  { id: 'pickup', label: 'Nhận tại nhà thuốc', desc: 'Miễn phí', fee: 0, icon: MapPin },
];

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Tiền mặt (COD)', icon: Banknote },
  { id: 'card', label: 'Thẻ tín dụng/ghi nợ', icon: CardIcon },
  { id: 'qr', label: 'QR Pay (VietQR, MoMo)', icon: QrCode },
  { id: 'wallet', label: 'Ví điện tử', icon: Wallet },
  { id: 'installment', label: 'Trả góp 0%', icon: CreditCard },
];

const STORAGE_KEY = 'pcms-checkout-draft';

interface CheckoutDraft {
  address: { name: string; phone: string; line: string; province: string };
  shipping: string;
  payment: string;
  voucherCode?: string;
}

const EMPTY_DRAFT: CheckoutDraft = {
  address: { name: '', phone: '', line: '', province: '' },
  shipping: 'standard',
  payment: 'cod',
};

export default function ShopCheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated, cart } = useCart();
  const { state: { user } } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CheckoutDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; line?: string; province?: string }>({});
  const [preview, setPreview] = useState<{ subtotal: number; shipping: number; discount: number; total: number } | null>(null);

  // Restore draft + pre-fill name from auth
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as CheckoutDraft;
        setDraft(saved);
      } else if (user) {
        setDraft((d) => ({
          ...d,
          address: { ...d.address, name: user.fullName ?? '' },
        }));
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Persist draft
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [draft, hydrated]);

  // Cleanup after successful order
  const cleanup = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Fetch checkout preview when shipping/voucher changes
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        const p = await checkoutPreview({
          shippingMethod: draft.shipping,
          voucherCode: cart.voucherCode,
        });
        setPreview(p);
      } catch {
        // fallback: local calculation
        const fee = SHIPPING_METHODS.find((m) => m.id === draft.shipping)?.fee ?? 0;
        setPreview({ subtotal, shipping: fee, discount: cart.voucherDiscount ?? 0, total: subtotal + fee - (cart.voucherDiscount ?? 0) });
      }
    })();
  }, [hydrated, draft.shipping, cart.voucherCode, cart.voucherDiscount, subtotal]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-8 w-32 bg-ink-200 rounded animate-pulse" aria-label="Đang tải thanh toán" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink-900 mb-3">Thanh toán</h1>
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

  const shipFee = preview?.shipping ?? SHIPPING_METHODS.find((m) => m.id === draft.shipping)!.fee;
  const total = preview?.total ?? subtotal + shipFee;

  const validateAddress = (): boolean => {
    const e: typeof errors = {};
    if (!draft.address.name.trim()) e.name = 'Vui lòng nhập họ tên';
    else if (draft.address.name.trim().length < 2) e.name = 'Họ tên quá ngắn';

    if (!draft.address.phone.trim()) e.phone = 'Vui lòng nhập SĐT';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(draft.address.phone.replace(/\s/g, '')))
      e.phone = 'SĐT không hợp lệ (VD: 0901234567)';

    if (!draft.address.line.trim()) e.line = 'Vui lòng nhập địa chỉ';
    if (!draft.address.province.trim()) e.province = 'Vui lòng nhập tỉnh/TP';

    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return false;
    }
    return true;
  };

  const next = async () => {
    if (step === 0 && !validateAddress()) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // Place order via backend
    try {
      const voucherCode = cart.voucherCode ?? draft.voucherCode;
      await checkoutConfirm({
        shippingMethod: draft.shipping,
        paymentMethod: draft.payment,
        voucherCode,
        address: draft.address,
      });
      toast.success('Đặt hàng thành công!');
      await clear();
      cleanup();
      router.push('/don-hang');
    } catch {
      toast.error('Không thể đặt hàng, thử lại');
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateAddress = <K extends keyof CheckoutDraft['address']>(
    key: K,
    value: string
  ) => {
    setDraft((d) => ({ ...d, address: { ...d.address, [key]: value } }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
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
                <Field label="Họ tên *" error={errors.name}>
                  <input
                    type="text"
                    value={draft.address.name}
                    onChange={(e) => updateAddress('name', e.target.value)}
                    className={inputClass(!!errors.name)}
                    placeholder="Nguyễn Văn A"
                  />
                </Field>
                <Field label="Số điện thoại *" error={errors.phone}>
                  <input
                    type="tel"
                    value={draft.address.phone}
                    onChange={(e) => updateAddress('phone', e.target.value)}
                    className={inputClass(!!errors.phone)}
                    placeholder="0901234567"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Địa chỉ *" error={errors.line}>
                    <input
                      type="text"
                      value={draft.address.line}
                      onChange={(e) => updateAddress('line', e.target.value)}
                      className={inputClass(!!errors.line)}
                      placeholder="Số nhà, đường, phường/xã"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Tỉnh/Thành phố *" error={errors.province}>
                    <input
                      type="text"
                      value={draft.address.province}
                      onChange={(e) => updateAddress('province', e.target.value)}
                      className={inputClass(!!errors.province)}
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </Field>
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
                {SHIPPING_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, shipping: m.id }))}
                      aria-pressed={draft.shipping === m.id}
                      className={clsx(
                        'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                        draft.shipping === m.id
                          ? 'border-accent-600 bg-accent-50'
                          : 'border-ink-200 hover:border-ink-300'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0',
                          draft.shipping === m.id ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700'
                        )}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink-900">{m.label}</p>
                        <p className="text-xs text-ink-500">{m.desc}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink-900 font-mono">
                        {m.fee === 0 ? 'Miễn phí' : formatVND(m.fee)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-4">
                <CreditCard className="w-4 h-4" aria-hidden="true" /> Phương thức thanh toán
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, payment: m.id }))}
                      aria-pressed={draft.payment === m.id}
                      className={clsx(
                        'w-full flex items-center gap-3 p-3 border rounded-md text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                        draft.payment === m.id
                          ? 'border-accent-600 bg-accent-50'
                          : 'border-ink-200 hover:border-ink-300'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0',
                          draft.payment === m.id ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700'
                        )}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-ink-900">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-16 h-16 mx-auto bg-success-50 rounded-full flex items-center justify-center mb-2">
                  <Check className="w-8 h-8 text-success-600" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold text-ink-900">Xác nhận đơn hàng</h2>
                <p className="mt-1 text-sm text-ink-600 text-pretty">
                  Vui lòng kiểm tra thông tin trước khi đặt hàng.
                </p>
              </div>

              <div className="space-y-3">
                <ConfirmBlock icon={MapPin} title="Giao đến">
                  <p className="font-medium">{draft.address.name} · {draft.address.phone}</p>
                  <p className="text-ink-600">{draft.address.line}, {draft.address.province}</p>
                </ConfirmBlock>

                <ConfirmBlock icon={Truck} title="Vận chuyển">
                  <p className="font-medium">
                    {SHIPPING_METHODS.find((m) => m.id === draft.shipping)?.label}
                  </p>
                  <p className="text-ink-600">
                    {SHIPPING_METHODS.find((m) => m.id === draft.shipping)?.desc} ·{' '}
                    <span className="font-mono">
                      {SHIPPING_METHODS.find((m) => m.id === draft.shipping)?.fee === 0
                        ? 'Miễn phí'
                        : formatVND(SHIPPING_METHODS.find((m) => m.id === draft.shipping)?.fee ?? 0)}
                    </span>
                  </p>
                </ConfirmBlock>

                <ConfirmBlock icon={CreditCard} title="Thanh toán">
                  <p className="font-medium">
                    {PAYMENT_METHODS.find((m) => m.id === draft.payment)?.label}
                  </p>
                </ConfirmBlock>

                <ConfirmBlock icon={Wallet} title="Sản phẩm">
                  <p className="font-mono font-medium">
                    {items.length} món · {items.reduce((s, i) => s + i.qty, 0)} đơn vị
                  </p>
                  <ul className="text-sm text-ink-600 mt-1 space-y-0.5">
                    {items.slice(0, 3).map((it) => (
                      <li key={it.medicineId} className="flex justify-between">
                        <span className="truncate">
                          {it.name} × {it.qty}
                        </span>
                        <span className="font-mono text-xs">{formatVND(it.price * it.qty)}</span>
                      </li>
                    ))}
                    {items.length > 3 && (
                      <li className="text-xs italic text-ink-500">
                        + {items.length - 3} sản phẩm khác
                      </li>
                    )}
                  </ul>
                </ConfirmBlock>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-ink-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1 px-4 h-10 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Quay lại
            </button>
            <div className="text-right">
              <p className="text-xs text-ink-500">Tổng cộng</p>
              <p className="text-lg font-bold text-accent-700 font-mono">{formatVND(total)}</p>
            </div>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1 px-5 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-900 block mb-1">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-danger-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

function ConfirmBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-ink-50 rounded-md flex items-start gap-3">
      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-ink-700" aria-hidden="true" />
      </div>
      <div className="text-sm flex-1 min-w-0">
        <p className="text-xs font-semibold text-ink-500">{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full h-10 px-3 text-sm border rounded-md focus:outline-none focus:ring-2 font-mono',
    hasError
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-200'
      : 'border-ink-200 focus:border-accent-500 focus:ring-accent-200',
  ].join(' ');
}