import { apiClient } from '@core/http/apiClient.js'

function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null),
  )
}

export async function listNotifications(params = {}) {
  const response = await apiClient.get('/notifications', { params: compactParams(params) })
  return response.data
}

export async function sendNotification(payload) {
  const response = await apiClient.post('/notifications', payload)
  return response.data
}

export async function broadcastNotification(payload) {
  const response = await apiClient.post('/notifications/broadcast', payload)
  return response.data
}

export async function composeNotification(payload) {
  const response = await apiClient.post('/notifications/compose', payload)
  return response.data
}

export async function markNotificationRead(id) {
  const response = await apiClient.put(`/notifications/${id}/read`)
  return response.data
}

export async function markAllNotificationsRead(recipientId) {
  const response = await apiClient.put('/notifications/read-all', null, { params: { recipientId } })
  return response.data
}

export async function retryNotification(id) {
  const response = await apiClient.post(`/notifications/${id}/retry`)
  return response.data
}

export async function deleteNotification(id) {
  const response = await apiClient.delete(`/notifications/${id}`)
  return response.data
}

/** Outbox triggers */
export async function triggerLowStockNotification(payload) {
  const response = await apiClient.post('/notifications/outbox/low-stock', payload)
  return response.data
}

export async function triggerExpiryAlertNotification(payload) {
  const response = await apiClient.post('/notifications/outbox/expiry-alert', payload)
  return response.data
}

export async function triggerOrderPaidNotification(payload) {
  const response = await apiClient.post('/notifications/outbox/order-paid', payload)
  return response.data
}
