import { apiClient } from '@core/http/apiClient.js'

export async function getRevenue(params = {}) {
  const response = await apiClient.get('/reports/revenue', { params })
  return response.data
}

export async function getStaffReport(params = {}) {
  const response = await apiClient.get('/reports/staff', { params })
  return response.data
}

export async function getRealtimeStats(branchId) {
  const response = await apiClient.get('/reports/realtime/stats', {
    params: branchId ? { branchId } : {},
  })
  return response.data
}

export async function getTopMedicines(params = { periodDays: 30, limit: 5 }) {
  const response = await apiClient.get('/orders/analytics/top-medicines', { params })
  return response.data
}

export async function listBranches() {
  const response = await apiClient.get('/branches', { params: { page: 0, size: 100 } })
  return response.data
}

export async function exportReport(params = {}) {
  const response = await apiClient.get('/reports/export', {
    params,
    responseType: 'blob',
  })
  return response
}
