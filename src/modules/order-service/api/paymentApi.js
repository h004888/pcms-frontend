import { apiClient } from '@core/http/apiClient.js'

export async function listPayments(params = {}) {
  const response = await apiClient.get('/payments', {
    params: { page: 0, size: 100, ...params },
  })
  return response.data
}

export async function getPayment(id) {
  const response = await apiClient.get(`/payments/${id}`)
  return response.data
}

export async function getPaymentByOrder(orderId) {
  const response = await apiClient.get(`/payments/order/${orderId}`)
  return response.data
}

export async function createPayment(payload) {
  const response = await apiClient.post('/payments', payload)
  return response.data
}

export async function getOrderForPayment(orderId) {
  const response = await apiClient.get(`/orders/${orderId}`)
  return response.data
}
