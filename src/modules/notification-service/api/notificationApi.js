import { apiClient } from '@core/http/apiClient.js'

export async function getNotifications(recipientId, params = {}) {
  const response = await apiClient.get('/notifications', {
    params: { recipientId, status: 'all', page: 0, size: 100, ...params },
  })
  return response.data
}

export async function markRead(id) {
  const response = await apiClient.put(`/notifications/${id}/read`)
  return response.data
}

export async function markAllRead(recipientId) {
  const response = await apiClient.put('/notifications/read-all', null, {
    params: { recipientId },
  })
  return response.data
}
