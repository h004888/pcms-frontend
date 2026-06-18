// =====================================================
// /mobile/nhac-uong-thuoc — MOBILE-MED-REMINDER list (polished)
// Toggle pause/resume + delete + adherence rate + mark taken
// =====================================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Bell, Plus, Clock, Pill, Calendar, Pause, Play, Trash2, Check } from 'lucide-react';
import { useReminders, freqLabel, type Reminder } from '@/hooks/useReminders';

export default function MedReminderListPage() {
  const { reminders, hydrated, toggleActive, remove, markTaken, adherenceRate } = useReminders();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Nhắc uống thuốc' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Nhắc uống thuốc</h1>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-ink-100 rounded-md animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const confirmDelete = (r: Reminder) => {
    if (!window.confirm(`Xóa nhắc nhở "${r.medicine}"?`)) return;
    remove(r.id);
    toast.success('Đã xóa nhắc nhở');
  };

  const toggle = (r: Reminder) => {
    toggleActive(r.id);
    toast.success(r.active ? 'Đã tạm dừng' : 'Đã tiếp tục');
  };

  const taken = (r: Reminder) => {
    markTaken(r.id, today);
    toast.success(`Đã đánh dấu uống ${r.medicine}`);
  };

  if (reminders.length === 0) {
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
          <p className="text-sm text-ink-600 mt-1 font-mono">{reminders.length} lịch</p>
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
        {reminders.map((r) => {
          const rate = adherenceRate(r);
          const todayTaken = r.adherence[today] ?? false;
          const rateColor =
            rate >= 0.8
              ? 'text-success-700'
              : rate >= 0.5
                ? 'text-warning-700'
                : 'text-danger-600';
          return (
            <article
              key={r.id}
              className={`p-4 bg-white border rounded-md ${
                r.active ? 'border-accent-300' : 'border-ink-200 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                    r.active ? 'bg-warning-50' : 'bg-ink-100'
                  }`}
                >
                  <Pill
                    className={`w-5 h-5 ${r.active ? 'text-warning-700' : 'text-ink-400'}`}
                    aria-hidden="true"
                  />
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
                  <p className="text-xs text-ink-500 font-mono mt-0.5">
                    {r.dosage} · {freqLabel(r.frequency)}
                  </p>
                  <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-ink-600">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {r.times.join(', ')}
                    </span>
                    <span className={`flex items-center gap-1 font-mono ${rateColor}`}>
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      Tuân thủ {Math.round(rate * 100)}% (30 ngày)
                    </span>
                  </div>
                  {r.note && (
                    <p className="mt-2 text-xs text-ink-500 italic">📝 {r.note}</p>
                  )}

                  {/* Adherence bar */}
                  <div className="mt-3">
                    <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rate >= 0.8
                            ? 'bg-success-500'
                            : rate >= 0.5
                              ? 'bg-warning-500'
                              : 'bg-danger-500'
                        }`}
                        style={{ width: `${rate * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {r.active && !todayTaken && (
                      <button
                        type="button"
                        onClick={() => taken(r)}
                        className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors"
                      >
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Đã uống hôm nay
                      </button>
                    )}
                    {r.active && todayTaken && (
                      <span className="inline-flex items-center gap-1 px-3 h-8 text-xs font-medium text-success-700 bg-success-50 rounded-md">
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Đã uống hôm nay
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(r)}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
                    >
                      {r.active ? (
                        <>
                          <Pause className="w-3 h-3" aria-hidden="true" />
                          Tạm dừng
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" aria-hidden="true" />
                          Tiếp tục
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(r)}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-medium text-danger-600 border border-ink-200 rounded-md hover:bg-danger-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}