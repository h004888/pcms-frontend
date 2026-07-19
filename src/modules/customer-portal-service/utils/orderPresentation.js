const STATUS_PRESENTATION = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', tone: 'text-amber-700 bg-amber-50 border-amber-200', group: 'pending' },
  APPROVED: { label: 'Đã xác nhận', tone: 'text-blue-700 bg-blue-50 border-blue-200', group: 'active' },
  PAID: { label: 'Đã thanh toán', tone: 'text-indigo-700 bg-indigo-50 border-indigo-200', group: 'active' },
  COMPLETED: { label: 'Hoàn tất', tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', group: 'completed' },
  REJECTED: { label: 'Bị từ chối', tone: 'text-red-700 bg-red-50 border-red-200', group: 'rejected' },
  CANCELLED: { label: 'Đã hủy', tone: 'text-red-700 bg-red-50 border-red-200', group: 'cancelled' },
}

export function getOrderStatusPresentation(status) {
  const fallback = { label: status || 'Không xác định', tone: 'text-slate-700 bg-slate-100 border-slate-200', group: 'unknown' }
  return { status, ...(STATUS_PRESENTATION[status] || fallback) }
}

function validDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

export function formatOrderDate(value) {
  const date = validDate(value)
  return date ? date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa có ngày'
}

export function formatOrderDateTime(value) {
  const date = validDate(value)
  return date ? date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Chưa có thời gian'
}

export function formatOrderPrice(value) {
  return value == null || Number.isNaN(Number(value)) ? 'Chưa có giá' : `${new Intl.NumberFormat('vi-VN').format(Number(value))} đ`
}
