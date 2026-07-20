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
