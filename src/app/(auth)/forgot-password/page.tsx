// =====================================================
// PCMS - Forgot Password Page (SCR-FORGOT-PW)
// Send password reset email
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, AlertCircle, ArrowLeft, SendHorizonal, CheckCircle2 } from 'lucide-react';

import { forgotPassword } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/api';

const forgotSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotFormData) => {
    setAuthError(null);
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi!');
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ink-900">
              <span className="text-accent-400 text-lg font-bold">P</span>
            </div>
            <span className="text-lg font-bold text-ink-900">PCMS</span>
          </Link>
        </div>

        {sent ? (
          /* ===== SUCCESS STATE ===== */
          <div className="bg-white rounded-xl border border-ink-100 p-8 text-center">
            <div className="w-14 h-14 mx-auto bg-accent-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-accent-600" />
            </div>
            <h1 className="text-xl font-bold text-ink-900 tracking-tight">
              Kiểm tra email của bạn
            </h1>
            <p className="mt-3 text-sm text-ink-500 leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
              Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam).
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 h-11 bg-ink-900 text-white text-sm font-semibold rounded-lg hover:bg-ink-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          /* ===== FORM STATE ===== */
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-ink-900 tracking-tight">
                Quên mật khẩu?
              </h1>
              <p className="mt-2 text-sm text-ink-500">
                Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="bg-white rounded-xl border border-ink-100 p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  leftIcon={<SendHorizonal className="w-4 h-4" />}
                >
                  {loading ? 'Đang gửi…' : 'Gửi yêu cầu'}
                </Button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-ink-500">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-ink-700 hover:text-accent-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
