// =====================================================
// PCMS - Notifications List Page - UC13
// =====================================================

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { Notification, NotificationChannel, NotificationStatus } from '@/types';
import { Check, Trash2, Send } from 'lucide-react';

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  IN_APP: 'Trong app',
  EMAIL: 'Email',
  SMS: 'SMS',
  PUSH: 'Push',
};

const CHANNEL_TONES: Record<NotificationChannel, string> = {
  IN_APP: 'bg-blue-50 text-blue-700 border-blue-200',
  EMAIL: 'bg-purple-50 text-purple-700 border-purple-200',
  SMS: 'bg-green-50 text-green-700 border-green-200',
  PUSH: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function NotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkRead = async (n: Notification) => {
    if (n.status === 'READ') return;
    try {
      await apiClient.put(`/notifications/${n.id}`);
      toast.success('Đã đánh dấu đã đọc');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (n: Notification) => {
    if (!confirm(`Xóa thông báo "${n.title}"?`)) return;
    try {
      await apiClient.delete(`/notifications/${n.id}`);
      toast.success('Đã xóa thông báo');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: Column<Notification>[] = [
    {
      key: 'channel',
      header: 'Kênh',
      width: '110px',
      render: (n) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${CHANNEL_TONES[n.channel] || 'bg-ink-50'}`}>
          {CHANNEL_LABELS[n.channel] || n.channel}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Tiêu đề',
      render: (n) => (
        <div>
          <p className="font-medium text-ink-900">{n.title}</p>
          <p className="text-xs text-ink-500 truncate max-w-md">{n.body}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (n) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(n.status)}`}>{n.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Thời gian',
      width: '160px',
      render: (n) => <span className="text-xs text-ink-500">{formatDateTime(n.createdAt)}</span>,
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<Notification>
        key={refreshKey}
        title="Quản lý thông báo"
        subtitle="UC13 - Hệ thống gửi thông báo đa kênh"
        endpoint="/notifications"
        columns={columns}
        searchPlaceholder="Tìm theo tiêu đề, nội dung..."
        canAdd={false}
        customActions={(n) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleMarkRead(n); }}
              className="p-1 text-ink-500 hover:text-blue-600"
              title="Đánh dấu đã đọc"
              disabled={n.status === 'READ'}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(n); }}
              className="p-1 text-ink-500 hover:text-red-600"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
