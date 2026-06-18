// =====================================================
// PCMS - Login Page (SCR-LOGIN) — Brand-led
// Surface brand theo PRODUCT.md §Hybrid register.
// Bố cục: panel trái = brand storytelling (ink-navy),
//          panel phải = form đăng nhập (white).
// Mobile: stack dọc, brand thu gọn phía trên.
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Pill, Eye, EyeOff, LogIn, AlertCircle, PillBottle, ClipboardList, BarChart3 } from 'lucide-react';

import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const VALUE_PROPS = [
  {
    icon: PillBottle,
    title: 'Bán thuốc có đơn chính xác',
    body: 'Đơn thuốc có chữ ký số, kiểm tra tương tác, cảnh báo liều ngay tại quầy.',
  },
  {
    icon: ClipboardList,
    title: 'Tồn kho theo lô và hạn dùng',
    body: 'FIFO theo lô, cảnh báo lô sắp hết hạn trước khi thành hàng tồn.',
  },
  {
    icon: BarChart3,
    title: 'Báo cáo theo ca và chi nhánh',
    body: 'Cuối ca đóng sổ trong 30 giây. Quản lý nhìn doanh thu theo thời gian thực.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Nếu đã đăng nhập, chuyển về dashboard
  // Chờ `hydrated` trước khi redirect để tránh flash / redirect sai
  // trong initial render.
  useEffect(() => {
    if (!state.hydrated) return;
    if (state.isAuthenticated) {
      router.push('/home');
    }
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
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-[--pcms-bg]">
      {/* === BRAND PANEL (left on desktop, top on mobile) === */}
      <aside
        className="relative bg-ink-900 text-ink-100 px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16 flex flex-col"
        aria-label="Giới thiệu PCMS"
      >
        {/* Subtle teal accent stripe at top — no gradient, single solid */}
        <div
          className="absolute top-0 left-0 right-0 h-px bg-accent-500"
          aria-hidden="true"
        />
        {/* Ambient glows for depth without shadow */}
        <div aria-hidden="true" className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent-500/20" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-info-500/10" />
        {/* Subtle dot pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Logo block */}
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-ink-800 to-ink-900 ring-1 ring-ink-700 shadow-lg"
              aria-hidden="true"
            >
              <Pill className="w-6 h-6 text-accent-400" strokeWidth={2.25} />
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full ring-2 ring-ink-900"
            />
          </div>
          <div className="leading-none">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-400">PCMS</p>
            <p className="text-[11px] text-ink-300 mt-1">v1.0.0 · 2026</p>
          </div>
        </div>

        {/* Brand headline — lg+ only */}
        <div className="relative mt-auto pt-12 lg:pt-0 lg:mt-0 lg:flex-1 lg:flex lg:flex-col lg:justify-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-accent-500/20 backdrop-blur border border-accent-400/30 rounded-full text-xs font-semibold mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" aria-hidden="true" />
            Hệ thống đang hoạt động
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white text-balance leading-[1.1]">
            Bàn điều khiển
            <br />
            <span className="text-accent-400">của dược sĩ.</span>
          </h1>
          <p className="mt-5 text-ink-200 text-base sm:text-lg max-w-md leading-relaxed">
            Hệ thống quản lý chuỗi nhà thuốc — nhanh, gọn, chính xác.
            Phục vụ dược sĩ, quản lý, CEO, và khách hàng trên cùng một nền tảng.
          </p>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { value: '2.678', label: 'Nhà thuốc' },
              { value: '12.4M', label: 'Khách / năm' },
              { value: '20+', label: 'Năm uy tín' },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-white/5 backdrop-blur border border-white/10 rounded-lg">
                <p className="text-2xl font-bold text-accent-300 font-mono tabular-nums">{s.value}</p>
                <p className="text-xs text-ink-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Value props — 3, không phải 4, không phải "icon+heading+text" lặp lại */}
          <ul className="mt-8 space-y-5 max-w-md">
            {VALUE_PROPS.map((prop) => (
              <li key={prop.title} className="flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md bg-gradient-to-br from-ink-800 to-ink-900 ring-1 ring-ink-700 shadow-sm">
                  <prop.icon className="w-4 h-4 text-accent-400" strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{prop.title}</p>
                  <p className="mt-1 text-sm text-ink-300 leading-relaxed">{prop.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand footer */}
        <div className="relative hidden lg:flex items-center justify-between mt-12 pt-6 border-t border-white/10 text-xs text-ink-400 font-mono">
          <p>© 2026 PCMS</p>
          <p>v1.0.0</p>
        </div>
      </aside>

      {/* === FORM PANEL (right on desktop, bottom on mobile) === */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Form header — không dùng eyebrow uppercase tracked */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-ink-900 tracking-tight">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Nhập email và mật khẩu để mở ca làm việc.
            </p>
          </div>

          {/* Auth-level error (server returned 4xx/5xx) */}
          {authError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 px-3.5 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="ban@pcms.vn"
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
                placeholder="••••••••"
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

            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
                />
                <span className="text-ink-700">Ghi nhớ đăng nhập</span>
              </label>
              <a
                href="#"
                className="text-accent-700 hover:text-accent-800 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 rounded"
              >
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              leftIcon={<LogIn className="w-4 h-4" aria-hidden="true" />}
              className="mt-2"
            >
              {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </Button>
          </form>

          {/* Demo accounts — subtle, không tranh chú ý với primary CTA */}
          <details
            className="mt-8 group rounded-md border border-ink-200 bg-ink-50/50 open:bg-ink-50"
          >
            <summary className="cursor-pointer list-none px-3.5 py-2.5 text-xs font-medium text-ink-600 hover:text-ink-900 flex items-center justify-between">
              <span>Tài khoản demo</span>
              <span
                className="text-ink-400 group-open:rotate-180 transition-transform"
                aria-hidden="true"
              >
                ▾
              </span>
            </summary>
            <div className="px-3.5 pb-3.5 pt-1 space-y-1.5 text-xs">
              {[
                { role: 'Admin', email: 'admin@pcms.vn', password: 'admin123' },
                { role: 'Dược sĩ', email: 'pharmacist@pcms.vn', password: 'pharma123' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setValue('email', acc.email);
                    setValue('password', acc.password);
                  }}
                  className="block w-full text-left px-2 py-1.5 rounded hover:bg-white text-ink-700 hover:text-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <span className="font-mono font-semibold">{acc.role}:</span>{' '}
                  <span className="font-mono">{acc.email}</span>{' '}
                  <span className="text-ink-400">/ {acc.password}</span>
                </button>
              ))}
              <p className="pt-1 text-ink-400 italic">Click để tự điền.</p>
            </div>
          </details>

          {/* Mobile-only brand footer (hidden on lg+) */}
          <p className="lg:hidden mt-10 text-center text-xs text-ink-400 font-mono">
            © 2026 PCMS · Phiên bản 1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
