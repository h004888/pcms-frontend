// =====================================================
// PCMS - Notifications View (UC13)
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/Layout';
import { Card, EmptyState, Badge } from '@/components/ui';
import { Notification } from '@/types';
import { getStatusColor, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { apiClient, getErrorMessage } from '@/lib/api';
import { Bell, Send, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export function NotificationsView() {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!state.user) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/notifications?recipientId=${state.user.id}&size=50`);
      setNotifications(res.data.data || []);
    } catch (err) { console.error(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [state.user?.id]);

  const markAsRead = async (n: Notification) => {
    try {
      await apiClient.put(`/notifications/${n.id}/read`);
      fetch();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const unreadCount = notifications.filter((n) => n.status !== 'READ').length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Thông báo
            {unreadCount > 0 && <Badge variant="danger">{unreadCount} mới</Badge>}
          </h1>
          <p className="page-subtitle">UC13 - In-app/Email/SMS · NSF-09 retry 3x</p>
        </div>
        {(state.user?.role === 'ADMIN' || state.user?.role === 'CEO') && (
          <Link
            href="/notifications/compose"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-md text-sm font-medium hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
          >
            <Send className="w-4 h-4" />
            Soạn thông báo
          </Link>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="Chưa có thông báo" description="Các thông báo về tồn kho, đơn hàng, đơn thuốc sẽ hiện ở đây" />
      ) : (
        <Card>
          <ul className="divide-y divide-ink-200">
            {notifications.map((n) => (
              <li key={n.id} className={`py-3 px-2 ${n.status !== 'READ' ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-start gap-3">
                  <Bell className={`w-4 h-4 mt-1 ${n.status !== 'READ' ? 'text-ink-500' : 'text-ink-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm ${n.status !== 'READ' ? 'font-semibold' : ''}`}>{n.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(n.status)}`}>{n.status}</span>
                      {n.template && <Badge variant="gray">{n.template}</Badge>}
                    </div>
                    <p className="text-sm text-ink-600 mt-1">{n.body}</p>
                    <p className="text-xs text-ink-400 mt-1">{formatDateTime(n.createdAt)} · qua {n.channel}</p>
                  </div>
                  {n.status !== 'READ' && (
                    <button onClick={() => markAsRead(n)} className="p-1.5 text-ink-500 hover:text-accent-600" title="Đánh dấu đã đọc">
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </DashboardLayout>
  );
}
