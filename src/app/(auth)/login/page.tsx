// =====================================================
// PCMS - Login Page — DESIGN.md + design-taste-v1
// Palette: ink-900 (navy) + accent-600 (teal) per DESIGN.md
// Asymmetric split 60/40 | stagger reveal CSS
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Pill,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Headphones,
} from 'lucide-react';

import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/api';

// ── Schema ──────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});
type LoginFormData = z.infer<typeof loginSchema>;

// ── Brand data ──────────────────────────────────────────
const STATS = [
  { value: '200K+', label: 'Khách hàng', detail: 'Tin dùng PCMS' },
  { value: '2H', label: 'Giao hàng', detail: 'Nội thành TP.HCM & Hà Nội' },
  { value: '24/7', label: 'Tư vấn', detail: 'Dược sĩ trực tuyến' },
];

const SELLING_POINTS = [
  { icon: ShoppingBag, text: 'Đặt thuốc theo đơn hoặc không cần đơn' },
  { icon: ShieldCheck, text: 'Sản phẩm chính hãng, nguồn gốc rõ ràng' },
  { icon: Truck, text: 'Giao hàng nhanh toàn quốc trong 2-3 ngày' },
  { icon: Headphones, text: 'Tư vấn miễn phí từ đội ngũ dược sĩ' },
];

const CONTACTS = [
  { icon: Phone, text: '1800 6928' },
  { icon: MapPin, text: '379 Lý Thường Kiệt, Q.Tân Bình, TP.HCM' },
  { icon: Clock, text: 'Mở cửa 7:00 — 21:00 mỗi ngày' },
];

// ── Inline style helpers ────────────────────────────────
function stagger(idx: number): React.CSSProperties {
  return { animationDelay: `${100 + idx * 80}ms` } as React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════
// BRAND PANEL — left side, ink-900 background
// ═══════════════════════════════════════════════════════════
function BrandPanel() {
  return (
    <aside
      className="relative overflow-hidden bg-ink-900 text-ink-100 px-8 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16 flex flex-col"
      aria-label="Giới thiệu PCMS"
    >
      {/* Accent stripe top — per DESIGN.md */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-accent-500" />

      {/* Ambient orbs — ink palette, not zinc */}
      <div aria-hidden="true" className="absolute -top-48 -right-48 w-[40rem] h-[40rem] rounded-full bg-accent-600/6 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] rounded-full bg-info-500/4 blur-3xl" />

      {/* Subtle dot pattern — DESIGN.md permitted */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Logo row — stagger 0 ── */}
      <div className="relative flex items-center gap-3" style={stagger(0)}>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-ink-800 to-ink-900 ring-1 ring-ink-700 shadow-lg">
            <Pill className="w-6 h-6 text-accent-400" strokeWidth={2.25} />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-600 rounded-full ring-2 ring-ink-900"
          />
        </div>
        <div className="leading-none">
          <p className="text-base font-bold text-white tracking-tight">PCMS</p>
          <p className="text-xs text-ink-400 mt-0.5">Nhà thuốc trực tuyến</p>
        </div>
        <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.15em] text-ink-600">
          v1.0
        </span>
      </div>

      {/* ── Hero — stagger 1 ── */}
      <div className="relative mt-auto lg:mt-0 lg:flex-1 lg:flex lg:flex-col lg:justify-center pt-14 lg:pt-0">
        <div style={stagger(1)}>
          <div className="inline-flex items-center gap-2 px-3 h-8 bg-accent-500/10 border border-accent-400/20 rounded-full text-xs font-semibold mb-6 text-accent-300">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Hơn 200.000 khách hàng tin dùng
          </div>

          <h1 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.08] max-w-lg">
            Thuốc chính hãng,
            <br />
            <span className="text-accent-400">giao tận nhà.</span>
          </h1>

          <p className="mt-5 text-ink-300 text-base max-w-md leading-relaxed">
            Đặt thuốc online nhanh chóng. Theo dõi đơn hàng, nhắc uống thuốc,
            và nhận tư vấn từ dược sĩ — tất cả trong một ứng dụng.
          </p>
        </div>

        {/* ── Stat pills — stagger 2-4 ── */}
        <div className="mt-10 flex flex-wrap gap-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={stagger(2 + i)}
              className="flex-1 min-w-[120px] p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
            >
              <p className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
                {s.value}
              </p>
              <p className="text-xs font-semibold text-ink-200 mt-1">{s.label}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* ── Selling points — stagger 5 ── */}
        <ul className="mt-8 space-y-3" style={stagger(5)}>
          {SELLING_POINTS.map((sp) => (
            <li key={sp.text} className="flex items-center gap-3">
              <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-ink-800/60 ring-1 ring-ink-700/40">
                <sp.icon className="w-3.5 h-3.5 text-accent-400" aria-hidden="true" />
              </div>
              <span className="text-sm text-ink-300">{sp.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Contact footer — stagger 6 ── */}
      <div
        className="relative mt-10 pt-6 border-t border-white/[0.06] space-y-2.5"
        style={stagger(6)}
      >
        {CONTACTS.map((c) => (
          <div key={c.text} className="flex items-center gap-2.5 text-xs text-ink-400">
            <c.icon className="w-3.5 h-3.5 text-ink-500 shrink-0" aria-hidden="true" />
            <span>{c.text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
// FORM PANEL — right side, white bg per DESIGN.md
// ═══════════════════════════════════════════════════════════
function FormPanel() {
  const router = useRouter();
  const { login, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.hydrated) return;
    if (state.isAuthenticated) router.push('/home');
  }, [state.hydrated, state.isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setLoading(true);
    try {
      await login(data);
      toast.success('Đăng nhập thành công');
      router.push('/home');
    } catch (err) {
      const message = getErrorMessage(err);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center px-6 py-12 sm:px-14 lg:px-20">
      <div className="w-full max-w-sm">
        {/* ── Header — entrance ── */}
        <div className="mb-10 animate-[card-enter_0.5s_cubic-bezier(0.22,1,0.36,1)_200ms_both]">
          <h2 className="text-2xl font-extrabold text-ink-900 tracking-tight">
            Đăng nhập
          </h2>
          <p className="mt-2.5 text-sm text-ink-500 leading-relaxed">
            Đăng nhập để mua thuốc và quản lý sức khỏe của bạn.
          </p>
        </div>

        {/* ── Error — DESIGN.md: danger-600 border ── */}
        {authError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800
                       animate-[card-enter_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
            <span>{authError}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 animate-[card-enter_0.5s_cubic-bezier(0.22,1,0.36,1)_400ms_both]"
        >
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            inputMode="email"
            required
            {...register('email')}
            error={errors.email?.message}
          />

          <div>
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="········"
              autoComplete="current-password"
              required
              {...register('password')}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-ink-400 hover:text-ink-700 transition-colors p-1 -m-1"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              }
            />
          </div>

          {/* Row: remember + forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
              />
              Ghi nhớ
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full h-12 rounded-[10px] bg-accent-600 text-white text-sm font-semibold
                       hover:bg-accent-700 active:scale-[0.98] transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
                       disabled:bg-accent-300 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 overflow-hidden group"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700
                         bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              <>
                Đăng nhập
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* ── Register link ── */}
        <p className="mt-8 text-center text-sm text-ink-500 animate-[card-enter_0.5s_cubic-bezier(0.22,1,0.36,1)_600ms_both]">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
          >
            Tạo tài khoản
          </Link>
        </p>

        {/* ── Demo accounts ── */}
        <details className="mt-6 group animate-[card-enter_0.5s_cubic-bezier(0.22,1,0.36,1)_800ms_both]">
          <summary className="cursor-pointer list-none flex items-center justify-between px-4 py-3 rounded-[10px] bg-ink-50 border border-ink-100 text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors">
            <span>Tài khoản dùng thử</span>
            <span className="text-ink-300 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </summary>
          <div className="mt-2 space-y-1">
            {[
              { role: 'Admin', email: 'admin@pcms.vn', pass: '123456' },
              { role: 'Dược sĩ', email: 'pharmacist.hcm1@pcms.vn', pass: '123456' },
            ].map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => {
                  setValue('email', a.email);
                  setValue('password', a.pass);
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-white border border-ink-100 hover:border-accent-200 hover:bg-accent-50/50 transition-all active:scale-[0.99]"
              >
                <span className="font-semibold text-ink-800">{a.role}</span>
                <span className="text-ink-300 mx-2">·</span>
                <span className="font-mono text-xs text-ink-500">{a.email}</span>
                <span className="text-ink-300 mx-1">/</span>
                <span className="font-mono text-xs text-ink-400">{a.pass}</span>
              </button>
            ))}
            <p className="text-[11px] text-ink-400 pt-1.5 px-1 italic">
              Nhấp để điền tự động
            </p>
          </div>
        </details>

        {/* Mobile footer */}
        <p className="lg:hidden mt-8 text-center text-xs text-ink-400 font-mono">
          &copy; 2026 PCMS &middot; v1.0.0
        </p>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════
export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-white">
      <BrandPanel />
      <FormPanel />
    </div>
  );
}
