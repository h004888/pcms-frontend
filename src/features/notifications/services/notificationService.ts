// =====================================================
// PCMS - Notification Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Notification } from '../types';

export async function fetchNotifications(recipientId: string) {
  const res = await apiClient.get<PageResponse<Notification>>(`${API_ENDPOINTS.NOTIFICATIONS}?recipientId=${recipientId}&size=50`);
  return res.data;
}

export async function markAsRead(notificationId: string) {
  const res = await apiClient.put(API_ENDPOINTS.NOTIFICATION_READ(notificationId));
  return res.data;
}

export async function sendNotification(data: { recipientId?: string; channel: string; title: string; body: string; template?: string }) {
  const res = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS, data);
  return res.data;
}
