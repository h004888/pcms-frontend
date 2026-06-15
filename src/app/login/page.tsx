// =====================================================
// PCMS - Login Page (SCR-LOGIN)
// Form đăng nhập với email + password
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Pill, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/home');
    }
  }, [state.isAuthenticated, router]);

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
    setLoading(true);
    try {
      await login(data);
      toast.success('Đăng nhập thành công!');
      router.push('/home');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-medical-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
            <Pill className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PCMS</h1>
          <p className="text-sm text-gray-500 mt-1">Pharmacy Chain Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Đăng nhập</h2>
          <p className="text-sm text-gray-500 mb-6">Nhập email và mật khẩu để tiếp tục</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@pcms.vn"
              autoComplete="email"
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
                    className="text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" fullWidth loading={loading} leftIcon={<LogIn className="w-4 h-4" />}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <p className="text-xs font-semibold text-gray-600 mb-2">🧪 Tài khoản demo (sau khi seed DB):</p>
            <div className="space-y-1 text-xs text-gray-600">
              <button
                type="button"
                onClick={() => { setValue('email', 'admin@pcms.vn'); setValue('password', 'admin123'); }}
                className="block w-full text-left hover:text-primary-600"
              >
                <strong>Admin:</strong> admin@pcms.vn / admin123
              </button>
              <button
                type="button"
                onClick={() => { setValue('email', 'pharmacist@pcms.vn'); setValue('password', 'pharma123'); }}
                className="block w-full text-left hover:text-primary-600"
              >
                <strong>Dược sĩ:</strong> pharmacist@pcms.vn / pharma123
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">* Click để tự điền</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 Pharmacy Chain Management System · Phiên bản 1.0.0
        </p>
      </div>
    </div>
  );
}
