import { User, Mail, Phone, Shield, MapPin } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function MyAccountPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[var(--shop-text-secondary)]">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
      </div>
    )
  }

  const infoRows = [
    { icon: User, label: 'Họ tên', value: user.fullName || '—' },
    { icon: Mail, label: 'Email', value: user.email || '—' },
    { icon: Phone, label: 'Số điện thoại', value: user.phone || '—' },
    { icon: Shield, label: 'Vai trò', value: user.role || '—' },
    { icon: MapPin, label: 'Địa chỉ', value: user.address || 'Chưa có địa chỉ' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--shop-text)] mb-6">Thông tin tài khoản</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {infoRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center gap-4 px-6 py-4 ${
              i < infoRows.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--shop-primary-light)] flex items-center justify-center shrink-0">
              <row.icon size={18} className="text-[var(--shop-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--shop-text-secondary)]">{row.label}</p>
              <p className="text-sm font-medium text-[var(--shop-text)] truncate">{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
