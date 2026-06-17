// =====================================================
// /prescriptions — CUST-RX-HISTORY
// Lịch sử đơn thuốc
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { FileText, Calendar, User, Pill } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn thuốc của tôi',
  description: 'Lịch sử đơn thuốc đã được dược sĩ duyệt.',
};

const MOCK_RX = [
  {
    id: 'rx-1',
    code: 'RX-20260601-001',
    doctor: 'BS. Trần Văn X',
    hospital: 'BV Đa khoa Bình Dân',
    date: '2026-06-01',
    medicines: [
      { name: 'Paracetamol 500mg', qty: '20 viên' },
      { name: 'Amoxicillin 500mg', qty: '21 viên' },
    ],
    status: 'Đã giao',
  },
  {
    id: 'rx-2',
    code: 'RX-20260520-014',
    doctor: 'BS. Lê Thị Y',
    hospital: 'PK Đại học Y Dược',
    date: '2026-05-20',
    medicines: [
      { name: 'Amlodipine 5mg', qty: '30 viên' },
      { name: 'Atorvastatin 20mg', qty: '30 viên' },
    ],
    status: 'Đã giao',
  },
];

export default function RxHistoryPage() {
  if (MOCK_RX.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Đơn thuốc' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900 mb-6">Đơn thuốc của tôi</h1>
        <EmptyState
          icon={FileText}
          title="Chưa có đơn thuốc"
          description="Upload đơn thuốc đầu tiên để bắt đầu."
          action={
            <Link
              href="/upload-toa"
              className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
            >
              Upload đơn thuốc
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Đơn thuốc' }]} />
      <h1 className="mt-3 text-xl font-bold text-ink-900 mb-4">Đơn thuốc của tôi</h1>

      <div className="space-y-3">
        {MOCK_RX.map((rx) => (
          <article
            key={rx.id}
            className="p-4 bg-white border border-ink-200 rounded-md"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-sm font-semibold text-ink-900 font-mono">{rx.code}</p>
                <p className="mt-0.5 text-xs text-ink-500 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" aria-hidden="true" />
                    {rx.doctor}
                  </span>
                  <span>·</span>
                  <span>{rx.hospital}</span>
                </p>
                <p className="text-xs text-ink-500 flex items-center gap-1 mt-1 font-mono">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {new Date(rx.date).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <span className="px-2 h-5 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                {rx.status}
              </span>
            </div>
            <div className="pt-3 border-t border-ink-100">
              <p className="text-xs font-semibold text-ink-700 mb-2 flex items-center gap-1">
                <Pill className="w-3.5 h-3.5" aria-hidden="true" />
                {rx.medicines.length} thuốc
              </p>
              <ul className="space-y-1 text-sm text-ink-700">
                {rx.medicines.map((m, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{m.name}</span>
                    <span className="text-ink-500 font-mono text-xs">{m.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}