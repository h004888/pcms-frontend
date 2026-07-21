import { apiClient } from '@core/http/apiClient.js'

export async function getBranchRevenue({ branchId, from, to }) {
  const response = await apiClient.get('/reports/revenue', {
    params: {
      branchId,
      from,
      to,
      groupBy: 'day',
    },
  })
  return response.data
}

export async function getRevenueReport({ from, to, groupBy }) {
  const response = await apiClient.get('/reports/revenue', {
    params: { from, to, groupBy },
  })
  return response.data
}

export async function getInventoryReport({ from, to } = {}) {
  const response = await apiClient.get('/reports/inventory', {
    params: { from, to },
  })
  return response.data
}

export async function getStaffReport({ fromDate, toDate }) {
  const response = await apiClient.get('/reports/staff', {
    params: { fromDate, toDate },
  })
  return response.data
}

export async function exportReport({ type, format, from, to }) {
  const response = await apiClient.get('/reports/export', {
    params: { type, format, from, to },
    responseType: 'blob',
  })
  return response.data
}

export async function listReportSchedules() {
  const response = await apiClient.get('/reports/schedules')
  return response.data
}

export async function createReportSchedule(payload) {
  const response = await apiClient.post('/reports/schedules', payload)
  return response.data
}

export async function cancelReportSchedule(id) {
  const response = await apiClient.delete(`/reports/schedules/${id}`)
  return response.data
}
