// =====================================================
// /notifications — CUST-NOTIF-SETTINGS
// Cài đặt thông báo
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt thông báo',
  description: 'Chọn kênh nhận thông báo: email, SMS, app push.',
};

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail, desc: 'Nhận thông báo qua email đã đăng ký' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Tin nhắn về số điện thoại' },
  { id: 'push', label: 'App push', icon: Smartphone, desc: 'Thông báo đẩy qua ứng dụng PCMS' },
];

const TOPICS = [
  { id: 'order', label: 'Cập nhật đơn hàng', desc: 'Trạng thái, giao hàng, hoàn tiền' },
  { id: 'promo', label: 'Khuyến mãi', desc: 'Mã giảm giá, flash sale, ưu đãi cá nhân' },
  { id: 'rx', label: 'Nhắc uống thuốc', desc: 'Lịch uống thuốc, nhắc tái khám' },
  { id: 'health', label: 'Sức khỏe', desc: 'Bài viết mới, tư vấn từ dược sĩ' },
];

export default function NotificationSettingsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Thông báo' }]} />
      <h1 className="mt-3 text-xl font-bold text-ink-900 mb-1">Cài đặt thông báo</h1>
      <p className="text-sm text-ink-600 mb-4">Chọn kênh và chủ đề bạn muốn nhận</p>

      <section className="p-5 bg-white border border-ink-200 rounded-md mb-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
          <Bell className="w-4 h-4 text-accent-600" aria-hidden="true" />
          Kênh nhận thông báo
        </h2>
        <div className="space-y-3">
          {CHANNELS.map((c, i) => {
            const Icon = c.icon;
            return (
              <label
                key={c.id}
                className="flex items-center justify-between gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent-50 rounded-md flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{c.label}</p>
                    <p className="text-xs text-ink-500">{c.desc}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="w-5 h-5 rounded text-accent-600 focus:ring-accent-500"
                />
              </label>
            );
          })}
        </div>
      </section>

      <section className="p-5 bg-white border border-ink-200 rounded-md">
        <h2 className="text-base font-semibold text-ink-900 mb-3">Chủ đề</h2>
        <div className="space-y-2">
          {TOPICS.map((t, i) => (
            <label
              key={t.id}
              className="flex items-center justify-between gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500"
            >
              <div>
                <p className="text-sm font-medium text-ink-900">{t.label}</p>
                <p className="text-xs text-ink-500">{t.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={i < 3}
                className="w-5 h-5 rounded text-accent-600 focus:ring-accent-500"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="px-5 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
        >
          Lưu cài đặt
        </button>
      </div>
    </>
  );
}