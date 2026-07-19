import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { login } from '../api/authApi.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const loginMutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('pcms_access_token', data.accessToken)
      localStorage.setItem('pcms_refresh_token', data.refreshToken)
      localStorage.setItem('pcms_user', JSON.stringify(data.user))
      toast.success(`Chào mừng ${data.user.fullName}!`)

      if (redirectTo) {
        navigate(redirectTo)
      } else if (data.user.role === 'ADMIN' || data.user.role === 'CEO') {
        navigate('/user-dashboard')
      } else if (data.user.role === 'CUSTOMER') {
        navigate('/')
      } else {
        navigate('/branches')
      }
    },
    onError: (error) => {
      const message = getApiErrorMessage(error)
      setErrors({ form: message })
    },
  })

  function validate() {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validate()) {
      loginMutation.mutate()
    }
  }

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-mark" aria-hidden="true">P</div>
        <h1 className="auth-brand-title">
          PCMS
        </h1>
        <p className="auth-brand-subtitle">
          <span className="auth-brand-accent">Pharmacy Chain Management System</span> — Hệ thống quản lý
          chuỗi nhà thuốc hiện đại. Quản lý đơn hàng, tồn kho, đơn thuốc và khách hàng
          trong một giao diện duy nhất.
        </p>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Đăng nhập</h2>
          <p className="auth-form-subtitle">
            Nhập email và mật khẩu để truy cập hệ thống.
          </p>

          {errors.form && (
            <div className="alert alert-danger" role="alert">
              <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
              <div className="alert-body">{errors.form}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="ban@pcms.vn"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
              {errors.email && (
                <p className="field-error" id="login-email-error">{errors.email}</p>
              )}
            </label>

            <label className="field">
              <span className="field-label">Mật khẩu</span>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  style={{ paddingRight: '44px' }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '100%',
                    border: 'none',
                    minHeight: 'auto',
                  }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="field-error" id="login-password-error">{errors.password}</p>
              )}
            </label>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loginMutation.isPending}
              style={{ width: '100%', marginTop: '4px' }}
            >
              {loginMutation.isPending ? (
                'Đang đăng nhập...'
              ) : (
                <>
                  <LogIn size={16} aria-hidden="true" />
                  Đăng nhập
                </>
              )}
            </button>

            <div className="auth-form-footer">
              <Link className="auth-link" to="/forgot-password">
                Quên mật khẩu?
              </Link>
              <Link className="auth-link" to={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>
                Đăng ký tài khoản
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
