'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, Button, EmptyState, Badge, Input } from '@/components/ui';
import { Notification, NotificationStatus } from '@/types';
import { getStatusColor, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import apiClient, { getErrorMessage } from '@/lib/api';
import { Bell, Send, CheckCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [composeMode, setComposeMode] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', channel: 'IN_APP' as 'IN_APP' | 'EMAIL' | 'SMS' });
  const [sending, setSending] = useState(false);

  const fetch = async () => {
    if (!state.user) return;
    try {
      const res = await apiClient.get(`/notifications?recipientId=${state.user.id}&size=50`);
      setNotifications(res.data.data || []);
    } catch (err) { console.error(getErrorMessage(err)); }
  };

  useEffect(() => { fetch(); }, [state.user?.id]);

  const markAsRead = async (n: Notification) => {
    try {
      await apiClient.put(`/notifications/${n.id}/read`);
      fetch();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) {
      toast.error('Vui lòng điền tiêu đề và nội dung');
      return;
    }
    setSending(true);
    try {
      // For demo: send to current user only
      await apiClient.post('/notifications', {
        recipientId: state.user?.id,
        channel: form.channel,
        title: form.title,
        body: form.body,
        template: 'NTPL-ADMIN-BROADCAST',
      });
      toast.success('Đã gửi thông báo');
      setForm({ title: '', body: '', channel: 'IN_APP' });
      setComposeMode(false);
      fetch();
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSending(false); }
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
          <Button onClick={() => setComposeMode((c) => !c)} leftIcon={<Send className="w-4 h-4" />}>
            Soạn thông báo
          </Button>
        )}
      </div>

      {composeMode && (
        <Card className="mb-4">
          <h3 className="text-base font-semibold mb-3">Soạn thông báo mới</h3>
          <form onSubmit={sendBroadcast} className="space-y-3">
            <Input label="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Cập nhật giờ làm việc" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kênh gửi</label>
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as any })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
                <option value="IN_APP">In-App</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setComposeMode(false)}>Hủy</Button>
              <Button type="submit" loading={sending}>Gửi ngay</Button>
            </div>
          </form>
        </Card>
      )}

      {notifications.length === 0 ? (
        <EmptyState title="Chưa có thông báo" description="Các thông báo về tồn kho, đơn hàng, đơn thuốc sẽ hiện ở đây" />
      ) : (
        <Card>
          <ul className="divide-y divide-gray-200">
            {notifications.map((n) => (
              <li key={n.id} className={`py-3 px-2 ${n.status !== 'READ' ? 'bg-blue-50/50' : ''}`}>
                <div className="flex items-start gap-3">
                  <Bell className={`w-4 h-4 mt-1 ${n.status !== 'READ' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm ${n.status !== 'READ' ? 'font-semibold' : ''}`}>{n.title}</p>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(n.status)}`}>{n.status}</span>
                      {n.template && <Badge variant="gray">{n.template}</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)} · qua {n.channel}</p>
                  </div>
                  {n.status !== 'READ' && (
                    <button onClick={() => markAsRead(n)} className="p-1.5 text-gray-500 hover:text-medical-600" title="Đánh dấu đã đọc">
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
