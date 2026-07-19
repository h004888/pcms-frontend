import { useQuery } from '@tanstack/react-query'
import { Package, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCustomerOrders } from '../api/shopApi'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '@core/http/apiClient'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatPrice(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
}

const STATUS_COLORS = {
  PENDING: 'text-amber-600 bg-amber-50',
  CONFIRMED: 'text-blue-600 bg-blue-50',
  SHIPPING: 'text-purple-600 bg-purple-50',
  DELIVERED: 'text-green-600 bg-green-50',
  CANCELLED: 'text-red-600 bg-red-50',
}

export function MyOrdersPage() {
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: () => getCustomerOrders({ size: 50 }),
    enabled: isAuthenticated,
  })

  const orders = data?.data || (Array.isArray(data) ? data : [])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-[var(--shop-text-secondary)]">Vui lòng đăng nhập để xem đơn hàng.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--shop-text)] mb-6">Đơn hàng của tôi</h1>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-[var(--shop-text-secondary)]">Đang tải đơn hàng...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{getApiErrorMessage(error)}</p>
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-[var(--shop-text-secondary)] mb-2">Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="text-sm font-medium text-[var(--shop-primary)] hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id || order.orderNumber}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-[var(--shop-primary)] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--shop-text-secondary)] font-mono">
                  #{order.orderNumber || order.id}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    STATUS_COLORS[order.status] || 'text-gray-600 bg-gray-100'
                  }`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--shop-text-secondary)]">
                    {formatDate(order.createdAt || order.orderDate)}
                  </p>
                  {order.totalAmount != null && (
                    <p className="text-base font-bold text-[var(--shop-text)] mt-1">
                      {formatPrice(order.totalAmount)}
                    </p>
                  )}
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
