import { useState } from 'react'
import { login } from '../../user-service/api/authApi'
import { X, Loader2 } from 'lucide-react'
import { useAuthPrompt } from '../context/AuthPromptContext'

export function LoginModal() {
  const { isPromptOpen, closeAuthPrompt, resolveAuthPrompt } = useAuthPrompt()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isPromptOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      localStorage.setItem('pcms_access_token', data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem('pcms_refresh_token', data.refreshToken)
      }
      if (data.user) {
        localStorage.setItem('pcms_user', JSON.stringify(data.user))
      }
      resolveAuthPrompt(true)
    } catch (err) {
      const msg = err?.response?.data?.messageVi
        || err?.response?.data?.message
        || 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeAuthPrompt} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={closeAuthPrompt}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập</h2>
        <p className="text-sm text-gray-500 mb-6">Đăng nhập để tiếp tục mua sắm</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--shop-primary)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--shop-primary-hover)] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  )
}
