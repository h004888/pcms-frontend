import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { forgotPassword } from '../api/authApi.js'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  const forgotPasswordMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: (data) => {
      setSuccessData(data)
      setError(null)
    },
    onError: (error) => {
      setError(getApiErrorMessage(error))
    },
  })

  function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) {
      setError('Email không được để trống')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ')
      return
    }
    setError(null)
    forgotPasswordMutation.mutate()
  }

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark" aria-hidden="true">P</div>
        <h1 className="auth-brand-title">PCMS</h1>
        <p className="auth-brand-subtitle">
          Khôi phục mật khẩu.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 0', marginBottom: '16px' }}>
            <ArrowLeft size={16} aria-hidden="true" /> Quay lại đăng nhập
          </Link>
          
          <h2 className="auth-form-title">Quên mật khẩu</h2>
          <p className="auth-form-subtitle">
            Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
          </p>

          {successData ? (
            <div className="auth-success" role="alert">
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div>
                <strong>Đã gửi yêu cầu!</strong>
                <p style={{ margin: '4px 0 0' }}>{successData.message}</p>
                {/* For local/dev only, showing the token. Real app sends email. */}
                {successData.resetToken && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginBottom: '4px' }}>
                      [DEV MODE] Token: <code className="mono" style={{ userSelect: 'all' }}>{successData.resetToken}</code>
                    </p>
                    <Link to={`/reset-password?token=${successData.resetToken}`} className="btn btn-primary btn-sm">
                      Mô phỏng nhấp link email
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="alert alert-danger" role="alert" style={{ marginBottom: '16px' }}>
                  <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
                  <div className="alert-body">{error}</div>
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    className="input"
                    type="email"
                    placeholder="ban@pcms.vn"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    aria-invalid={!!error}
                  />
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  {forgotPasswordMutation.isPending ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <Mail size={16} aria-hidden="true" />
                      Gửi yêu cầu
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
