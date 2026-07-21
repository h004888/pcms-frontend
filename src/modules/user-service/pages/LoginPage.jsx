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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--ink-900)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '48px 40px', background: 'var(--surface)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Brand logo & title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            width: '64px', height: '64px', borderRadius: '16px', 
            background: 'var(--ink-900)', color: '#ffffff', 
            fontSize: '28px', fontWeight: '700' 
          }}>
            P
          </div>
          <h1 style={{ margin: '16px 0 0', fontSize: '28px', fontWeight: '700', color: 'var(--ink-900)' }}>
            PCMS
          </h1>
        </div>

        {errors.form && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: '24px' }}>
            <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
            <div className="alert-body">{errors.form}</div>
          </div>
        )}

        {/* Form fields in horizontal layout */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
            <label htmlFor="login-email" className="field-label" style={{ margin: 0, fontSize: '15px' }}>Email</label>
            <div>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="Nhập email của bạn"
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
                <p className="field-error" id="login-email-error" style={{ marginTop: '6px' }}>{errors.email}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
            <label htmlFor="login-password" className="field-label" style={{ margin: 0, fontSize: '15px' }}>Mật khẩu</label>
            <div>
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
                  style={{ position: 'absolute', right: 0, top: 0, height: '100%', border: 'none' }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error" id="login-password-error" style={{ marginTop: '6px' }}>{errors.password}</p>
              )}
            </div>
          </div>

          {/* Action buttons matching the layout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <Link className="auth-link" to="/forgot-password">Quên mật khẩu?</Link>
              <Link className="auth-link" to={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}>Đăng ký</Link>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loginMutation.isPending}
                style={{ minWidth: '120px' }}
              >
                {loginMutation.isPending ? 'Đang tải...' : 'Đăng nhập'}
              </button>
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => navigate('/')}
                style={{ minWidth: '100px' }}
              >
                Đóng
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
