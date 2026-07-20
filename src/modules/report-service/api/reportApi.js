import { apiClient } from '@core/http/apiClient.js'

function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null),
  )
}

export async function getRevenueReport(params = {}) {
  const response = await apiClient.get('/reports/revenue', { params: compactParams(params) })
  return response.data
}

export async function getInventoryReport(params = {}) {
  const response = await apiClient.get('/reports/inventory', { params: compactParams(params) })
  return response.data
}

export async function getStaffReport(params = {}) {
  const response = await apiClient.get('/reports/staff', { params: compactParams(params) })
  return response.data
}

export async function getRealtimeStats(params = {}) {
  const response = await apiClient.get('/reports/realtime/stats', { params: compactParams(params) })
  return response.data
}

/** Export file — returns Blob */
export async function exportReport({ type, format, from, to }) {
  const response = await apiClient.get('/reports/export', {
    params: compactParams({ type, format, from, to }),
    responseType: 'blob',
  })
  return response
}

export async function createReportSchedule(payload) {
  const response = await apiClient.post('/reports/schedule', payload)
  return response.data
}

export async function listReportSchedules() {
  const response = await apiClient.get('/reports/schedules')
  return response.data
}

export async function cancelReportSchedule(id) {
  const response = await apiClient.delete(`/reports/schedules/${id}`)
  return response.data
}
