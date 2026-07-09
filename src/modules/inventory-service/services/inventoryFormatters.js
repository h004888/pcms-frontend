export const STOCK_STATUS = {
  OK: 'OK',
  LOW: 'LOW',
  OUT: 'OUT',
  EXPIRED: 'EXPIRED',
  EXPIRING: 'EXPIRING',
}

export const TRANSACTION_LABELS = {
  IMPORT: 'Nhập kho',
  EXPORT: 'Xuất kho',
  SALE: 'Bán hàng',
  SALE_RESTORE: 'Hoàn tồn',
  TRANSFER_OUT: 'Chuyển đi',
  TRANSFER_IN: 'Chuyển đến',
}

export function unwrapList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  return payload?.data || payload?.content || []
}

export function normalizeSearch(value) {
  return String(value || '').trim().toLocaleLowerCase('vi-VN')
}

export function shortId(value) {
  if (!value) {
    return '--'
  }

  return String(value).slice(0, 8)
}

export function formatDate(value) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value) {
  if (!value) {
    return '--'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function daysUntil(value) {
  if (!value) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(value)
  target.setHours(0, 0, 0, 0)

  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export function getBatchQuantity(row) {
  return Number(row?.qtyOnHand ?? row?.quantity ?? 0)
}

export function getMinimumStock(row) {
  return Number(row?.minStockLevel ?? row?.minimumStock ?? 0)
}

export function getStockStatus(row) {
  const quantity = getBatchQuantity(row)
  const minimumStock = getMinimumStock(row)
  const expiryDays = daysUntil(row?.expiryDate)

  if (expiryDays !== null && expiryDays < 0) {
    return STOCK_STATUS.EXPIRED
  }

  if (quantity <= 0) {
    return STOCK_STATUS.OUT
  }

  if (expiryDays !== null && expiryDays <= 30) {
    return STOCK_STATUS.EXPIRING
  }

  if (minimumStock > 0 && quantity <= minimumStock) {
    return STOCK_STATUS.LOW
  }

  return STOCK_STATUS.OK
}

export function stockStatusMeta(status) {
  switch (status) {
    case STOCK_STATUS.OUT:
      return { label: 'Hết hàng', className: 'badge-muted' }
    case STOCK_STATUS.LOW:
      return { label: 'Sắp hết', className: 'badge-warning' }
    case STOCK_STATUS.EXPIRED:
      return { label: 'Quá hạn', className: 'badge-muted' }
    case STOCK_STATUS.EXPIRING:
      return { label: 'Sắp hết hạn', className: 'badge-warning' }
    default:
      return { label: 'Ổn định', className: 'badge-success' }
  }
}

export function getTransactionLabel(type) {
  return TRANSACTION_LABELS[type] || type || '--'
}

export function isOutgoingTransaction(type) {
  return ['EXPORT', 'SALE', 'TRANSFER_OUT'].includes(type)
}

export function toPositiveInteger(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function toOptionalPositiveInteger(value) {
  if (!String(value || '').trim()) {
    return undefined
  }

  return toPositiveInteger(value)
}
