// =====================================================
// PCMS - Mock Notifications seed (15 records)
// Mix channels + statuses
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_USERS } from './users';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';

export interface MockNotification {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  channel: NotificationChannel;
  type: string;                 // 'ORDER_PAID', 'RX_SIGNED', 'LOW_STOCK'...
  subject: string;
  body: string;
  status: NotificationStatus;
  relatedEntityId?: string;     // orderId, prescriptionId, etc.
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
}

const users = SEED_USERS.filter((u) => u.role !== 'CUSTOMER').slice(0, 6);

const templates = [
  { type: 'ORDER_PAID', subject: 'Đơn hàng đã thanh toán', body: 'Đơn hàng {orderNumber} đã được thanh toán thành công.' },
  { type: 'RX_SIGNED', subject: 'Đơn thuốc đã ký số', body: 'Đơn thuốc {rxNumber} đã được bác sĩ ký số.' },
  { type: 'LOW_STOCK', subject: 'Cảnh báo tồn kho thấp', body: 'Thuốc {medicineName} tại chi nhánh {branchName} sắp hết.' },
  { type: 'INVENTORY_EXPIRY', subject: 'Lô thuốc sắp hết hạn', body: 'Lô {batchNo} hết hạn vào {expiryDate}.' },
  { type: 'CUSTOMER_REGISTERED', subject: 'Khách hàng mới', body: 'Khách hàng {customerName} vừa đăng ký thành viên.' },
  { type: 'BATCH_VERIFIED', subject: 'Xác thực lô thuốc', body: 'Lô {batchNo} đã xác thực nguồn gốc thành công.' },
  { type: 'REPORT_READY', subject: 'Báo cáo đã sẵn sàng', body: 'Báo cáo {reportName} đã sẵn sàng tải xuống.' },
];

const channels: NotificationChannel[] = ['IN_APP', 'EMAIL', 'SMS', 'PUSH'];
const statuses: NotificationStatus[] = ['SENT', 'SENT', 'SENT', 'READ', 'READ', 'FAILED'];

const NOW = new Date('2026-06-22T10:00:00Z');

export const SEED_NOTIFICATIONS: MockNotification[] = Array.from({ length: 15 }, (_, i) => {
  const u = users[i % users.length];
  const tpl = templates[i % templates.length];
  const ch = channels[i % channels.length];
  const st = statuses[i % statuses.length];
  const sentAt = new Date(NOW.getTime() - i * 3600 * 1000);
  return {
    id: uuid(),
    recipientId: u.id,
    recipientName: u.fullName,
    recipientEmail: u.email,
    channel: ch,
    type: tpl.type,
    subject: tpl.subject,
    body: tpl.body,
    status: st,
    relatedEntityId: uuid(),
    sentAt: st !== 'PENDING' ? sentAt.toISOString() : null,
    readAt: st === 'READ' ? sentAt.toISOString() : null,
    createdAt: sentAt.toISOString(),
  };
});
