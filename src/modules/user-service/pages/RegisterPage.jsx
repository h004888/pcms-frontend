import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { register } from '../api/authApi.js'

export function RegisterPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const redirectTo = searchParams.get('redirect') || ''
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  const registerMutation = useMutation({
    mutationFn: () => register(formData),
    onSuccess: () => {
      setIsSuccess(true)
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.')
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate(`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`)
      }, 2000)
    },
    onError: (error) => {
      const message = getApiErrorMessage(error)
      setErrors({ form: message })
    },
  })

  function validate() {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Họ tên không được vượt quá 100 ký tự'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống'
    } else if (formData.phone.length > 20) {
      newErrors.phone = 'Số điện thoại không được vượt quá 20 ký tự'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6 || formData.password.length > 100) {
      newErrors.password = 'Mật khẩu phải từ 6 đến 100 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validate()) {
      registerMutation.mutate()
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--ink-900)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '48px 40px', background: 'var(--surface)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
        
        <Link to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="btn btn-ghost" style={{ padding: '8px 0', marginBottom: '16px', color: 'var(--ink-600)' }}>
          <ArrowLeft size={16} aria-hidden="true" /> Quay lại đăng nhập
        </Link>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--ink-900)' }}>Đăng ký tài khoản</h2>
          <p style={{ margin: 0, color: 'var(--ink-500)' }}>
            Tạo tài khoản khách hàng mới.
          </p>
        </div>

        {isSuccess ? (
          <div className="auth-success" role="alert" style={{ background: 'var(--success-50)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', color: 'var(--success-800)' }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>Đăng ký thành công!</strong>
              <p style={{ margin: '0 0 16px 0' }}>Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.</p>
              <Link to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="btn btn-primary">
                Đến trang đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errors.form && (
              <div className="alert alert-danger" role="alert" style={{ marginBottom: '24px' }}>
                <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
                <div className="alert-body">{errors.form}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Họ và tên</label>
                <div>
                  <input
                    name="fullName"
                    className="input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && <p className="field-error" style={{ marginTop: '6px' }}>{errors.fullName}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Email</label>
                <div>
                  <input
                    name="email"
                    className="input"
                    type="email"
                    placeholder="ban@email.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="field-error" style={{ marginTop: '6px' }}>{errors.email}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Số điện thoại</label>
                <div>
                  <input
                    name="phone"
                    className="input"
                    type="tel"
                    placeholder="0912345678"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="field-error" style={{ marginTop: '6px' }}>{errors.phone}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Mật khẩu</label>
                <div>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input
                      name="password"
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ít nhất 6 ký tự"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingRight: '44px' }}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', right: 0, top: 0, height: '100%', border: 'none', minHeight: 'auto' }}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && <p className="field-error" style={{ marginTop: '6px' }}>{errors.password}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={registerMutation.isPending}
                  style={{ minWidth: '200px' }}
                >
                  {registerMutation.isPending ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <UserPlus size={16} aria-hidden="true" />
                      Đăng ký
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
