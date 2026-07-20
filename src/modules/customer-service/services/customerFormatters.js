export function normalizeSearch(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function formatTierLabel(tier) {
  const map = {
    BRONZE: 'Đồng',
    SILVER: 'Bạc',
    GOLD: 'Vàng',
    PLATINUM: 'Bạch kim',
  }
  return map[tier] || tier || '--'
}

export function formatTierBadgeClass(tier) {
  const map = {
    BRONZE: 'badge badge-muted',
    SILVER: 'badge badge-info',
    GOLD: 'badge badge-warning',
    PLATINUM: 'badge badge-success',
  }
  return map[tier] || 'badge badge-muted'
}

export function formatTierColor(tier) {
  const map = {
    BRONZE: 'var(--ink-500)',
    SILVER: 'var(--info-600)',
    GOLD: 'var(--warning-600)',
    PLATINUM: 'var(--accent-700)',
  }
  return map[tier] || 'var(--ink-500)'
}

export function formatPointAction(reason) {
  if (!reason) return '--'
  const lower = reason.toLowerCase()
  if (lower.includes('redeem') || lower.includes('discount')) return 'Đổi điểm (Giảm giá)'
  if (lower.includes('earn') || lower.includes('order_paid') || lower.includes('purchase')) return 'Tích điểm (Mua hàng)'
  return reason
}

export function formatRefOrder(refOrderId) {
  if (!refOrderId) return '--'
  const short = String(refOrderId).replace(/-/g, '').slice(0, 8).toUpperCase()
  return `INV-${short}`
}

export function formatDate(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '--'
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '--'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '--'
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export function formatPoints(points) {
  if (points == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(points)
}
