export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value))
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

export function normalizeSearch(value) {
  return value.trim().toLocaleLowerCase('vi-VN')
}

export function shortId(value) {
  if (!value) {
    return '--'
  }

  return String(value).slice(0, 8)
}

export function getCategoryName(medicine, categoriesById) {
  return categoriesById.get(medicine?.categoryId)?.name || shortId(medicine?.categoryId)
}

export function getSupplierName(medicine, suppliersById) {
  if (!medicine?.supplierId) {
    return 'Chưa chọn'
  }

  return suppliersById.get(medicine.supplierId)?.name || shortId(medicine.supplierId)
}

export function prescriptionLabel(value) {
  return value ? 'Cần đơn thuốc' : 'Không cần đơn'
}
