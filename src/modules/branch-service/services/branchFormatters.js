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

export function shortId(value) {
  if (!value) {
    return '--'
  }

  return String(value).slice(0, 8)
}

export function normalizeSearch(value) {
  return value.trim().toLocaleLowerCase('vi-VN')
}

export function getManagerName(branch, managersById) {
  if (!branch?.managerId) {
    return 'Chưa gán'
  }

  return managersById.get(branch.managerId)?.fullName || shortId(branch.managerId)
}
