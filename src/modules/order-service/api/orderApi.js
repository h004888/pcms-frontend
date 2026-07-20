import { apiClient } from '@core/http/apiClient.js'

export async function searchCustomers(query) {
  const response = await apiClient.get('/customers', {
    params: { search: query, page: 0, size: 10 },
  })
  return response.data
}

export async function searchMedicines(query) {
  const response = await apiClient.get('/medicines', {
    params: { search: query, page: 0, size: 10, status: 'ACTIVE' },
  })
  return response.data
}

export async function getCoupons() {
  const response = await apiClient.get('/coupons')
  return response.data
}

export async function createOrder(payload) {
  const response = await apiClient.post('/orders', payload)
  return response.data
}

export async function listOrders(params = {}) {
  const response = await apiClient.get('/orders', {
    params: { page: 0, size: 50, ...params },
  })
  return response.data
}
