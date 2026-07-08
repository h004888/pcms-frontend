import { apiClient } from '@core/http/apiClient.js'

export async function listUsers(params = {}) {
  const response = await apiClient.get('/users', { params })
  return response.data
}

export async function getUser(id) {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}

export async function createUser(payload) {
  const response = await apiClient.post('/users', payload)
  return response.data
}

export async function updateUser(id, payload) {
  const response = await apiClient.put(`/users/${id}`, payload)
  return response.data
}

export async function changeUserRole(id, role) {
  const response = await apiClient.put(`/users/${id}/role`, { role })
  return response.data
}

export async function changeUserStatus(id, status) {
  const response = await apiClient.put(`/users/${id}/status`, { status })
  return response.data
}

export async function unlockUser(id) {
  const response = await apiClient.post(`/users/${id}/unlock`)
  return response.data
}

export async function deleteUser(id) {
  await apiClient.delete(`/users/${id}`)
}

export async function assignBranch(id, branchId) {
  const response = await apiClient.put(`/users/${id}/branch`, { branchId })
  return response.data
}

export async function exportUsers(params = {}) {
  const response = await apiClient.get('/users/export', { 
    params,
    responseType: 'blob', // Important for CSV export
  })
  return response.data
}

export async function getDashboardStats() {
  const response = await apiClient.get('/dashboard/stats')
  return response.data
}

export async function getRecentLogins(params = {}) {
  const response = await apiClient.get('/dashboard/recent-logins', { params })
  return response.data
}

export async function getAuditLogs(params = {}) {
  const response = await apiClient.get('/audit-logs', { params })
  return response.data
}
