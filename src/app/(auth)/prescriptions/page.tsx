// =====================================================
// /prescriptions — CUST-RX-HISTORY (polished)
// Filter status + download PDF mock
// =====================================================

'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { FileText, Calendar, User, Pill, Download, Eye } from 'lucide-react';

interface Rx {
  id: string;
  code: string;
  doctor: string;
  hospital: string;
  date: string;
  medicines: { name: string; qty: string }[];
  status: 'delivered' | 'in_review' | 'cancelled';
}

const MOCK_RX: Rx[] = [
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
    status: 'delivered',
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
    status: 'delivered',
  },
  {
    id: 'rx-3',
    code: 'RX-20260615-008',
    doctor: 'BS. Nguyễn Văn Z',
    hospital: 'BV Chợ Rẫy',
    date: '2026-06-15',
    medicines: [
      { name: 'Salbutamol 100mcg', qty: '1 ống hít' },
    ],
    status: 'in_review',
  },
];

const STATUS_LABELS: Record<Rx['status'], { text: string; class: string }> = {
  delivered: { text: 'Đã giao', class: 'bg-success-100 text-success-700' },
  in_review: { text: 'Đang duyệt', class: 'bg-warning-100 text-warning-700' },
  cancelled: { text: 'Đã hủy', class: 'bg-danger-100 text-danger-700' },
};

const FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'delivered', label: 'Đã giao' },
  { id: 'in_review', label: 'Đang duyệt' },
  { id: 'cancelled', label: 'Đã hủy' },
] as const;

export default function RxHistoryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');

  const list = filter === 'all' ? MOCK_RX : MOCK_RX.filter((rx) => rx.status === filter);

  const download = (rx: Rx) => {
    toast.success(`Đang tải ${rx.code}.pdf — sẽ có trong phiên bản chính thức`);
  };

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
      <div className="mt-3 flex items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-bold text-ink-900">Đơn thuốc của tôi</h1>
        <span className="text-xs text-ink-500 font-mono">{list.length} đơn</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-4" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`px-3 h-8 text-xs font-medium rounded-full transition-colors ${
              filter === f.id
                ? 'bg-accent-600 text-white'
                : 'bg-white border border-ink-200 text-ink-700 hover:bg-ink-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="p-5 bg-white border border-ink-200 rounded-md text-center">
          <p className="text-sm text-ink-600">Không có đơn thuốc trong mục này.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((rx) => {
            const badge = STATUS_LABELS[rx.status];
            return (
              <article
                key={rx.id}
                className="p-4 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
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
                  <span className={`px-2 h-5 inline-flex items-center text-xs font-semibold rounded-full ${badge.class}`}>
                    {badge.text}
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
                  <div className="mt-3 pt-3 border-t border-ink-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => download(rx)}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-medium border border-ink-200 rounded-md hover:bg-ink-50 transition-colors"
                    >
                      <Download className="w-3 h-3" aria-hidden="true" />
                      Tải PDF
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-medium text-accent-700 hover:bg-accent-50 rounded-md transition-colors"
                    >
                      <Eye className="w-3 h-3" aria-hidden="true" />
                      Chi tiết
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}