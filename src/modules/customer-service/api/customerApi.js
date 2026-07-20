import { apiClient } from '@core/http/apiClient.js'

export async function listCustomers(params = {}) {
  const response = await apiClient.get('/customers', {
    params: { page: 0, size: 100, ...params },
  })
  return response.data
}

export async function getCustomer(id) {
  const response = await apiClient.get(`/customers/${id}`)
  return response.data
}

export async function createCustomer(payload) {
  const response = await apiClient.post('/customers', payload)
  return response.data
}

export async function updateCustomer(id, payload) {
  const response = await apiClient.put(`/customers/${id}`, payload)
  return response.data
}

export async function getCustomerPoints(id, params = {}) {
  const response = await apiClient.get(`/customers/${id}/points`, {
    params: { page: 0, size: 50, ...params },
  })
  return response.data
}

export async function getCustomerOrders(id, params = {}) {
  const response = await apiClient.get(`/customers/${id}/orders`, {
    params: { page: 0, size: 50, ...params },
  })
  return response.data
}
