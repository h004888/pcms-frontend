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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--ink-900)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '48px 40px', background: 'var(--surface)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
        
        <Link to="/login" className="btn btn-ghost" style={{ padding: '8px 0', marginBottom: '16px', color: 'var(--ink-600)' }}>
          <ArrowLeft size={16} aria-hidden="true" /> Quay lại đăng nhập
        </Link>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--ink-900)' }}>Quên mật khẩu</h2>
          <p style={{ margin: 0, color: 'var(--ink-500)' }}>
            Nhập email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
          </p>
        </div>

        {successData ? (
          <div className="auth-success" role="alert" style={{ background: 'var(--success-50)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', color: 'var(--success-800)' }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0 }} aria-hidden="true" />
            <div>
              <strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>Đã gửi yêu cầu!</strong>
              <p style={{ margin: '0 0 16px 0' }}>{successData.message}</p>
              
              {/* For local/dev only, showing the token. Real app sends email. */}
              {successData.resetToken && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--ink-500)', marginBottom: '8px' }}>
                    [DEV MODE] Token: <code className="mono" style={{ userSelect: 'all', background: 'var(--surface)', padding: '2px 4px', borderRadius: '4px' }}>{successData.resetToken}</code>
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
              <div className="alert alert-danger" role="alert" style={{ marginBottom: '24px' }}>
                <AlertCircle size={18} className="alert-icon" aria-hidden="true" />
                <div className="alert-body">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label" style={{ margin: 0 }}>Email</label>
                <div>
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
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  style={{ minWidth: '200px' }}
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
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
