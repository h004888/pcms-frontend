// =====================================================
// PCMS - Register Page (SCR-REGISTER)
// Customer self-registration with full-name, email, phone, password
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, AlertCircle, Phone, Mail, User, Lock, CheckCircle } from 'lucide-react';

import { register as registerUser } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/api';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z
      .string()
      .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Vui lòng đồng ý với điều khoản',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    setLoading(true);
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      toast.success('Đăng ký thành công! Chào mừng bạn đến với PCMS.');
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
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo + header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ink-900">
              <span className="text-accent-400 text-lg font-bold">P</span>
            </div>
            <span className="text-lg font-bold text-ink-900">PCMS</span>
          </Link>
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
            Tạo tài khoản
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Đăng ký để mua thuốc online và theo dõi sức khỏe
          </p>
        </div>

        {/* Error banner */}
        {authError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-ink-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              leftIcon={<User className="w-4 h-4" />}
              required
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              inputMode="email"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901234567"
              autoComplete="tel"
              inputMode="numeric"
              leftIcon={<Phone className="w-4 h-4" />}
              required
              {...register('phone')}
              error={errors.phone?.message}
            />

            <div>
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div>
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                leftIcon={<CheckCircle className="w-4 h-4" />}
                required
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="text-ink-400 hover:text-ink-700 transition-colors p-1 -m-1"
                    aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                {...register('agreeTerms')}
                className="mt-0.5 h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-1"
              />
              <span className="text-sm text-ink-600 leading-relaxed">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-accent-600 hover:text-accent-700 font-medium underline underline-offset-2">
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-accent-600 hover:text-accent-700 font-medium underline underline-offset-2">
                  Chính sách bảo mật
                </Link>{' '}
                của PCMS
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-600 mt-1">{errors.agreeTerms.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="mt-2"
            >
              {loading ? 'Đang tạo tài khoản…' : 'Tạo tài khoản'}
            </Button>
          </form>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-ink-500">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="text-accent-600 hover:text-accent-700 font-semibold underline underline-offset-2"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
