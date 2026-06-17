// =====================================================
// /mobile/nhac-uong-thuoc — MOBILE-MED-REMINDER list
// Danh sách nhắc nhở uống thuốc
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Bell, Plus, Clock, Pill, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nhắc uống thuốc',
  description: 'Quản lý lịch nhắc uống thuốc hàng ngày.',
};

const MOCK_REMINDERS = [
  {
    id: 'r-1',
    medicine: 'Amlodipine 5mg',
    dosage: '1 viên',
    times: ['08:00'],
    frequency: 'Hằng ngày',
    nextDue: '08:00 hôm nay',
    active: true,
  },
  {
    id: 'r-2',
    medicine: 'Metformin 500mg',
    dosage: '1 viên',
    times: ['08:00', '20:00'],
    frequency: '2 lần/ngày',
    nextDue: '20:00 hôm nay',
    active: true,
  },
  {
    id: 'r-3',
    medicine: 'Vitamin D3 1000IU',
    dosage: '1 viên',
    times: ['08:00'],
    frequency: 'Hằng ngày',
    nextDue: '08:00 ngày mai',
    active: false,
  },
];

export default function MedReminderListPage() {
  if (MOCK_REMINDERS.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Nhắc uống thuốc' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Nhắc uống thuốc</h1>
        <EmptyState
          icon={Bell}
          title="Chưa có nhắc nhở"
          description="Thêm lịch uống thuốc để nhận thông báo đúng giờ."
          action={
            <Link
              href="/mobile/nhac-uong-thuoc/new"
              className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
            >
              <Plus className="w-4 h-4" /> Tạo nhắc nhở
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Breadcrumb items={[{ label: 'Nhắc uống thuốc' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Nhắc uống thuốc</h1>
          <p className="text-sm text-ink-600 mt-1 font-mono">{MOCK_REMINDERS.length} lịch</p>
        </div>
        <Link
          href="/mobile/nhac-uong-thuoc/new"
          className="inline-flex items-center gap-1.5 px-3 h-9 bg-accent-600 text-white text-xs font-semibold rounded-md hover:bg-accent-700"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Thêm
        </Link>
      </div>

      <div className="space-y-3">
        {MOCK_REMINDERS.map((r) => (
          <article
            key={r.id}
            className={`p-4 bg-white border rounded-md ${
              r.active ? 'border-accent-300' : 'border-ink-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning-50 rounded-md flex items-center justify-center flex-shrink-0">
                <Pill className="w-5 h-5 text-warning-700" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-900">{r.medicine}</p>
                  {r.active ? (
                    <span className="px-2 h-5 bg-success-100 text-success-700 text-xs font-semibold rounded">
                      Đang chạy
                    </span>
                  ) : (
                    <span className="px-2 h-5 bg-ink-100 text-ink-700 text-xs font-semibold rounded">
                      Tạm dừng
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-500 font-mono mt-0.5">{r.dosage} · {r.frequency}</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-ink-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {r.times.join(', ')}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    {r.nextDue}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}