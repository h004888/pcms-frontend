import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { resetPassword } from '../api/authApi.js'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const urlToken = searchParams.get('token') || ''

  const [token, setToken] = useState(urlToken)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  // Validate strong password rule: >=8 chars, 1 uppercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/~`|]).{8,64}$/

  const resetMutation = useMutation({
    mutationFn: () => resetPassword(token, newPassword),
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (error) => {
      setErrors({ form: getApiErrorMessage(error) })
    },
  })

  function validate() {
    const newErrors = {}

    if (!token.trim()) {
      newErrors.token = 'Token không được để trống'
    }

    if (!newPassword.trim()) {
      newErrors.password = 'Mật khẩu mới không được để trống'
    } else if (!strongPasswordRegex.test(newPassword)) {
      newErrors.password = 'Mật khẩu phải từ 8-64 ký tự, chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (validate()) {
      resetMutation.mutate()
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark" aria-hidden="true">P</div>
        <h1 className="auth-brand-title">PCMS</h1>
        <p className="auth-brand-subtitle">
          Đặt lại mật khẩu.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Đặt lại mật khẩu</h2>
          <p className="auth-form-subtitle">
            Nhập mã bảo mật (token) và mật khẩu mới của bạn.
          </p>

          {isSuccess ? (
            <div className="auth-success" role="alert">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div>
                <strong>Đặt lại mật khẩu thành công!</strong>
                <p style={{ margin: '4px 0 0' }}>Mật khẩu của bạn đã được cập nhật.</p>
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
                  <span className="field-label">Token đặt lại</span>
                  <input
                    className="input mono"
                    type="text"
                    placeholder="Nhập mã token..."
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value)
                      if (errors.token) setErrors((prev) => ({ ...prev, token: undefined }))
                    }}
                    aria-invalid={!!errors.token}
                  />
                  {errors.token && <p className="field-error">{errors.token}</p>}
                </label>

                <label className="field">
                  <span className="field-label">Mật khẩu mới</span>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <input
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu mới"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
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
                      {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                  </div>
                  <p className="field-hint" style={{ marginTop: '4px' }}>
                    Từ 8-64 ký tự, gồm ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt (!@#$%^&*)
                  </p>
                  {errors.password && <p className="field-error">{errors.password}</p>}
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={resetMutation.isPending}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  {resetMutation.isPending ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <LockKeyhole size={16} aria-hidden="true" />
                      Lưu mật khẩu mới
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
