// =====================================================
// /notifications — CUST-NOTIF-SETTINGS (polished)
// Save preferences with state + localStorage
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Bell, Mail, MessageSquare, Smartphone, Save, RotateCcw } from 'lucide-react';

interface NotifPrefs {
  channels: Record<string, boolean>;
  topics: Record<string, boolean>;
}

const STORAGE_KEY = 'pcms-notif-prefs';

const DEFAULT_PREFS: NotifPrefs = {
  channels: { email: true, sms: true, push: false },
  topics: { order: true, promo: true, rx: true, health: false },
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
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  const [dirty, setDirty] = useState(false);

  // Load từ localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const loaded = JSON.parse(raw) as NotifPrefs;
        setPrefs(loaded);
        setDirty(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleChannel = (id: string) => {
    setPrefs((p) => ({ ...p, channels: { ...p.channels, [id]: !p.channels[id] } }));
    setDirty(true);
  };

  const toggleTopic = (id: string) => {
    setPrefs((p) => ({ ...p, topics: { ...p.topics, [id]: !p.topics[id] } }));
    setDirty(true);
  };

  const save = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setDirty(false);
      toast.success('Đã lưu cài đặt thông báo');
    } catch {
      toast.error('Không thể lưu — kiểm tra localStorage');
    }
  };

  const reset = () => {
    setPrefs(DEFAULT_PREFS);
    setDirty(true);
    toast('Đã reset về mặc định — nhấn Lưu để áp dụng', { icon: '🔄' });
  };

  const enabledCount =
    Object.values(prefs.channels).filter(Boolean).length +
    Object.values(prefs.topics).filter(Boolean).length;
  const totalCount = CHANNELS.length + TOPICS.length;

  return (
    <>
      <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Thông báo' }]} />
      <div className="mt-3 flex items-center justify-between gap-2 mb-1">
        <h1 className="text-xl font-bold text-ink-900">Cài đặt thông báo</h1>
        <span className="text-xs text-ink-500 font-mono">
          {enabledCount}/{totalCount} đang bật
        </span>
      </div>
      <p className="text-sm text-ink-600 mb-4">Chọn kênh và chủ đề bạn muốn nhận</p>

      <section className="p-5 bg-white border border-ink-200 rounded-md mb-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
          <Bell className="w-4 h-4 text-accent-600" aria-hidden="true" />
          Kênh nhận thông báo
        </h2>
        <div className="space-y-3">
          {CHANNELS.map((c) => {
            const Icon = c.icon;
            return (
              <ToggleRow
                key={c.id}
                icon={<Icon className="w-4 h-4 text-accent-700" aria-hidden="true" />}
                label={c.label}
                desc={c.desc}
                checked={prefs.channels[c.id]}
                onChange={() => toggleChannel(c.id)}
              />
            );
          })}
        </div>
      </section>

      <section className="p-5 bg-white border border-ink-200 rounded-md mb-4">
        <h2 className="text-base font-semibold text-ink-900 mb-3">Chủ đề</h2>
        <div className="space-y-2">
          {TOPICS.map((t) => (
            <ToggleRow
              key={t.id}
              label={t.label}
              desc={t.desc}
              checked={prefs.topics[t.id]}
              onChange={() => toggleTopic(t.id)}
            />
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white border-t border-ink-200 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-medium text-ink-700 hover:bg-ink-50 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          {dirty ? 'Lưu thay đổi' : 'Đã lưu'}
        </button>
      </div>
    </>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className="w-9 h-9 bg-accent-50 rounded-md flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-ink-900">{label}</p>
          <p className="text-xs text-ink-500">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-accent-600' : 'bg-ink-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}