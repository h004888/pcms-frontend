import dayjs from 'dayjs'

/** Role enum → Vietnamese display name. */
export const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  CEO: 'Giám đốc',
  BRANCH_MANAGER: 'Quản lý chi nhánh',
  PHARMACIST: 'Dược sĩ',
  CUSTOMER: 'Khách hàng',
}

/** UserStatus enum → Vietnamese display name. */
export const STATUS_LABELS = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngưng hoạt động',
  LOCKED: 'Đã khóa',
}

/** Role options for select/filter. */
export const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'CEO', label: 'Giám đốc' },
  { value: 'BRANCH_MANAGER', label: 'Quản lý chi nhánh' },
  { value: 'PHARMACIST', label: 'Dược sĩ' },
  { value: 'CUSTOMER', label: 'Khách hàng' },
]

/** Status options for select/filter. */
export const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'INACTIVE', label: 'Ngưng hoạt động' },
  { value: 'LOCKED', label: 'Đã khóa' },
]

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || '—'
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || '—'
}

export function formatDateTime(value) {
  if (!value) return '—'
  return dayjs(value).format('DD/MM/YYYY HH:mm')
}

export function formatDate(value) {
  if (!value) return '—'
  return dayjs(value).format('DD/MM/YYYY')
}

/** Normalize search string for client-side filtering. */
export function normalizeSearch(str) {
  return (str || '').toLowerCase().trim()
}
