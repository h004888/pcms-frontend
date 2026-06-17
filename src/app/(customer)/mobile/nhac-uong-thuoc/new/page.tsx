// =====================================================
// /mobile/nhac-uong-thuoc/new — MOBILE-MED-REMINDER create
// Tạo nhắc nhở mới
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Bell, Clock, Save, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo nhắc nhở',
  description: 'Tạo lịch nhắc uống thuốc mới.',
};

const MEDICINES = [
  'Paracetamol 500mg',
  'Amoxicillin 500mg',
  'Amlodipine 5mg',
  'Metformin 500mg',
  'Atorvastatin 20mg',
  'Vitamin D3 1000IU',
  'Khác (nhập tên)',
];

const FREQUENCIES = [
  { id: 'daily', label: 'Hằng ngày' },
  { id: 'bid', label: '2 lần/ngày' },
  { id: 'tid', label: '3 lần/ngày' },
  { id: 'weekly', label: 'Hàng tuần' },
];

export default function NewReminderPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/mobile/nhac-uong-thuoc"
          className="p-2 -ml-2 text-ink-700 hover:text-ink-900 rounded transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div>
          <Breadcrumb items={[{ label: 'Nhắc uống thuốc', href: '/mobile/nhac-uong-thuoc' }, { label: 'Tạo mới' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Tạo nhắc nhở mới</h1>
        </div>
      </div>

      <form className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
        <div>
          <label htmlFor="medicine" className="text-sm font-semibold text-ink-900">
            Thuốc
          </label>
          <select
            id="medicine"
            className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          >
            <option value="">-- Chọn thuốc --</option>
            {MEDICINES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="dosage" className="text-sm font-semibold text-ink-900">
              Liều dùng
            </label>
            <input
              id="dosage"
              type="text"
              placeholder="1 viên"
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <div>
            <label htmlFor="freq" className="text-sm font-semibold text-ink-900">
              Tần suất
            </label>
            <select
              id="freq"
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink-900 mb-2">Giờ nhắc</legend>
          <div className="space-y-2">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-ink-500 w-20">Lần {idx}</span>
                <div className="relative flex-1">
                  <Clock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="time"
                    className="w-full h-10 pl-9 pr-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
                    disabled={idx > 1}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-500">Tối đa 3 lần/ngày tùy theo tần suất.</p>
        </fieldset>

        <div>
          <label htmlFor="note" className="text-sm font-semibold text-ink-900">
            Ghi chú
          </label>
          <textarea
            id="note"
            rows={2}
            placeholder="Uống sau bữa ăn, tránh xa bữa sữa..."
            className="mt-1 w-full px-3 py-2 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
          />
        </div>

        <div className="p-3 bg-info-50 border border-info-200 rounded-md text-xs text-info-800">
          <Bell className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />
          Nhắc nhở sẽ gửi push notification đúng giờ — cần bật quyền trong cài đặt trình duyệt.
        </div>

        <div className="flex gap-2 pt-2 border-t border-ink-200">
          <button
            type="submit"
            className="flex-1 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Lưu nhắc nhở
          </button>
        </div>
      </form>
    </>
  );
}