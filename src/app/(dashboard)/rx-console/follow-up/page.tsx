// =====================================================
// /rx-console/follow-up — RX-FOLLOW-UP
// Theo dõi sau bán: nhắc tái khám, refill
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Calendar, Bell, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Follow-up sau bán',
  description: 'Theo dõi khách hàng sau khi mua thuốc: tái khám, refill, phản ứng phụ.',
};

const MOCK_FOLLOWUPS = [
  {
    id: 'fu-1',
    customer: 'Nguyễn Văn A',
    medicine: 'Amlodipine 5mg',
    lastPurchase: '2026-04-15',
    refillDue: '2026-07-15',
    daysLeft: 12,
    status: 'due_soon',
    channel: 'sms',
  },
  {
    id: 'fu-2',
    customer: 'Trần Thị B',
    medicine: 'Metformin 500mg',
    lastPurchase: '2026-05-01',
    refillDue: '2026-07-01',
    daysLeft: -2,
    status: 'overdue',
    channel: 'phone',
  },
  {
    id: 'fu-3',
    customer: 'Lê Văn C',
    medicine: 'Atorvastatin 20mg',
    lastPurchase: '2026-06-01',
    refillDue: '2026-09-01',
    daysLeft: 60,
    status: 'on_track',
    channel: 'app',
  },
];

const STATUS_LABEL = {
  overdue: { text: 'Quá hạn', class: 'bg-danger-100 text-danger-700' },
  due_soon: { text: 'Sắp đến hạn', class: 'bg-warning-100 text-warning-700' },
  on_track: { text: 'Còn xa', class: 'bg-success-100 text-success-700' },
} as const;

const CHANNEL_ICON = {
  sms: MessageSquare,
  phone: Phone,
  app: Bell,
};

export default function FollowUpPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Follow-up' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Follow-up sau bán</h1>
          <p className="text-sm text-ink-600 mt-1">
            Theo dõi refill, tái khám, phản ứng phụ
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_FOLLOWUPS.map((f) => {
          const badge = STATUS_LABEL[f.status as keyof typeof STATUS_LABEL];
          const ChannelIcon = CHANNEL_ICON[f.channel as keyof typeof CHANNEL_ICON];
          return (
            <article
              key={f.id}
              className="p-4 bg-white border border-ink-200 rounded-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-ink-900">{f.customer}</p>
                    <span
                      className={`px-2 h-5 inline-flex items-center text-xs font-semibold rounded ${badge.class}`}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-700">{f.medicine}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-500 flex-wrap">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      Mua: {new Date(f.lastPurchase).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      Refill: {new Date(f.refillDue).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <ChannelIcon className="w-3 h-3" aria-hidden="true" />
                      {f.channel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors flex-shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Liên hệ
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}