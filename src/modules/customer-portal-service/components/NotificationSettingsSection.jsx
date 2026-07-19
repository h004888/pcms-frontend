import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { getNotificationSettings, updateNotificationSettings } from '../api/shopApi.js'
import { useState, useEffect } from 'react'

export function NotificationSettingsSection() {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState(null)

  const query = useQuery({
    queryKey: ['notification-settings'],
    queryFn: getNotificationSettings,
  })

  useEffect(() => {
    if (query.data) {
      setSettings({
        pushEnabled: query.data.pushEnabled,
        emailEnabled: query.data.emailEnabled,
        smsEnabled: query.data.smsEnabled,
        marketingEnabled: query.data.marketingEnabled,
        orderUpdates: query.data.orderUpdates,
        lowStockAlert: query.data.lowStockAlert,
        expiryAlert: query.data.expiryAlert,
      })
    }
  }, [query.data])

  const mutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] })
      toast.success('Đã cập nhật cài đặt thông báo')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const toggle = (field) => {
    if (!settings) return
    const updated = { ...settings, [field]: !settings[field] }
    setSettings(updated)
    mutation.mutate(updated)
  }

  const renderToggle = (label, field, description) => (
    <label className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 cursor-pointer">
      <div>
        <span className="text-sm font-medium text-[var(--shop-text)]">{label}</span>
        {description && <p className="text-xs text-[var(--shop-text-secondary)] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={settings?.[field]}
        onClick={() => toggle(field)}
        disabled={mutation.isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          settings?.[field] ? 'bg-[var(--shop-primary)]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            settings?.[field] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--shop-text)] mb-4">Cài đặt thông báo</h2>
      {query.isLoading && <p className="text-[var(--shop-text-secondary)]">Đang tải cài đặt...</p>}
      {query.isError && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{getApiErrorMessage(query.error)}</p>}
      {query.data && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-1">
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-[var(--shop-text)]">Kênh thông báo</h3>
          </div>
          {renderToggle('Thông báo đẩy (Push)', 'pushEnabled', 'Nhận thông báo qua ứng dụng')}
          {renderToggle('Email', 'emailEnabled', 'Nhận thông báo qua email')}
          {renderToggle('SMS', 'smsEnabled', 'Nhận thông báo qua tin nhắn')}
          {renderToggle('Marketing', 'marketingEnabled', 'Nhận thông tin khuyến mãi, ưu đãi')}
          <div className="mt-4 mb-4 pt-3 pb-3 border-y border-gray-200">
            <h3 className="text-sm font-semibold text-[var(--shop-text)]">Loại thông báo</h3>
          </div>
          {renderToggle('Cập nhật đơn hàng', 'orderUpdates', 'Thông báo khi trạng thái đơn hàng thay đổi')}
          {renderToggle('Cảnh báo tồn kho thấp', 'lowStockAlert', 'Thông báo khi thuốc sắp hết hàng')}
          {renderToggle('Cảnh báo hết hạn', 'expiryAlert', 'Thông báo khi thuốc sắp hết hạn sử dụng')}
        </div>
      )}
    </section>
  )
}
