// =====================================================
// PCMS - Notification feature types (UC13)
// =====================================================

import type { UUID, ISODate, NotificationChannel, NotificationStatus } from './common';

export interface Notification {
  id: UUID;
  recipientId: UUID;
  channel: NotificationChannel;
  template?: string;
  title: string;
  body: string;
  status: NotificationStatus;
  retryCount: number;
  sentAt?: ISODate;
  readAt?: ISODate;
  createdAt: ISODate;
}
