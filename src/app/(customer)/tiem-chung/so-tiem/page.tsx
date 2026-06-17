// =====================================================
// /tiem-chung/so-tiem — VACCINE-LEDGER
// Sổ tiêm chủng điện tử
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Syringe, Check, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sổ tiêm chủng',
  description: 'Sổ tiêm chủng điện tử — lịch sử và nhắc nhở tiêm nhắc.',
};

// Mock data — thay bằng API khi backend ready
const MOCK_ENTRIES = [
  {
    id: 'shot-1',
    vaccine: 'Vaccine Cúm mùa (Influenza)',
    date: '2025-10-15',
    lot: 'FL2025-A01',
    location: 'PCMS Quận 1',
    nextDue: '2026-10-15',
  },
  {
    id: 'shot-2',
    vaccine: 'Vaccine Viêm gan B — mũi 3',
    date: '2025-03-20',
    lot: 'HB2024-A03',
    location: 'PCMS Bình Thạnh',
    nextDue: null,
  },
  {
    id: 'shot-3',
    vaccine: 'Vaccine COVID-19 — mũi nhắc',
    date: '2024-12-01',
    lot: 'COV2024-B02',
    location: 'PCMS Ba Đình',
    nextDue: null,
  },
];

export default function SoTiemPage() {
  if (MOCK_ENTRIES.length === 0) {
    return (
      <>
        <div className="bg-white border-b border-ink-200">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb
              items={[
                { label: 'Tiêm chủng', href: '/tiem-chung' },
                { label: 'Sổ tiêm' },
              ]}
            />
            <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
              Sổ tiêm chủng
            </h1>
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <EmptyState
            icon={Syringe}
            title="Chưa có lịch sử tiêm"
            description="Đặt lịch tiêm để bắt đầu ghi nhận sổ tiêm chủng điện tử."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Tiêm chủng', href: '/tiem-chung' },
              { label: 'Sổ tiêm' },
            ]}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Sổ tiêm chủng
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Lịch sử tiêm chủng và nhắc nhở tiêm nhắc lại
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {MOCK_ENTRIES.map((e) => (
          <article
            key={e.id}
            className="p-4 bg-white border border-ink-200 rounded-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-success-50 rounded-md flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-success-700" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-ink-900 text-balance">
                  {e.vaccine}
                </h3>
                <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs text-ink-600">
                  <div>
                    <p className="text-ink-500">Ngày tiêm</p>
                    <p className="font-mono font-medium text-ink-900">
                      {new Date(e.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink-500">Số lô</p>
                    <p className="font-mono text-ink-900">{e.lot}</p>
                  </div>
                  <div>
                    <p className="text-ink-500">Tại nhà thuốc</p>
                    <p className="text-ink-900">{e.location}</p>
                  </div>
                </div>
                {e.nextDue && (
                  <div className="mt-3 p-2 bg-warning-50 border border-warning-200 rounded text-xs text-warning-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    Nhắc tiêm nhắc lại vào {new Date(e.nextDue).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}