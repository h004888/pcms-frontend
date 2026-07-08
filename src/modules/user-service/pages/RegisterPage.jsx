import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { register } from '../api/authApi.js'

export function RegisterPage() {
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
      toast.success('Đăng ký tài khoản thành công!')
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
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark" aria-hidden="true">P</div>
        <h1 className="auth-brand-title">PCMS</h1>
        <p className="auth-brand-subtitle">
          <span className="auth-brand-accent">Cổng thông tin khách hàng</span>. Đăng ký để 
          theo dõi đơn hàng, đơn thuốc và lịch sử mua sắm của bạn.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 0', marginBottom: '16px' }}>
            <ArrowLeft size={16} aria-hidden="true" /> Quay lại đăng nhập
          </Link>
          
          <h2 className="auth-form-title">Đăng ký tài khoản</h2>
          <p className="auth-form-subtitle">
            Tạo tài khoản khách hàng mới.
          </p>

          {isSuccess ? (
            <div className="auth-success" role="alert">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div>
                <strong>Đăng ký thành công!</strong>
                <p style={{ margin: '4px 0 0' }}>Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.</p>
                <div style={{ marginTop: '16px' }}>
                  <Link to="/login" className="btn btn-primary">
                    Đến trang đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {errors.form && (
                <div className="alert alert-danger" role="alert" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
                  <div className="alert-body">{errors.form}</div>
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <label className="field">
                  <span className="field-label">Họ và tên</span>
                  <input
                    name="fullName"
                    className="input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'register-name-error' : undefined}
                  />
                  {errors.fullName && <p className="field-error" id="register-name-error">{errors.fullName}</p>}
                </label>

                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    name="email"
                    className="input"
                    type="email"
                    placeholder="ban@email.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'register-email-error' : undefined}
                  />
                  {errors.email && <p className="field-error" id="register-email-error">{errors.email}</p>}
                </label>

                <label className="field">
                  <span className="field-label">Số điện thoại</span>
                  <input
                    name="phone"
                    className="input"
                    type="tel"
                    placeholder="0912345678"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'register-phone-error' : undefined}
                  />
                  {errors.phone && <p className="field-error" id="register-phone-error">{errors.phone}</p>}
                </label>

                <label className="field">
                  <span className="field-label">Mật khẩu</span>
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
                      aria-describedby={errors.password ? 'register-password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', right: 0, top: 0, height: '100%', border: 'none', minHeight: 'auto' }}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && <p className="field-error" id="register-password-error">{errors.password}</p>}
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={registerMutation.isPending}
                  style={{ width: '100%', marginTop: '4px' }}
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
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
