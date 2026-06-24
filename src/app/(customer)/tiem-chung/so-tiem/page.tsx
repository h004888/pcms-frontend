// =====================================================
// /tiem-chung/so-tiem — VACCINE-LEDGER (real API)
// Sổ tiêm chủng điện tử — /api/v1/vaccination-ledger/me
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Syringe, Check, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { fetchVaccinationLedger } from '@/features/vaccines';

export const metadata: Metadata = {
  title: 'Sổ tiêm chủng',
  description: 'Sổ tiêm chủng điện tử — lịch sử và nhắc nhở tiêm nhắc.',
};

export default async function SoTiemPage() {
  let records: Awaited<
    ReturnType<typeof fetchVaccinationLedger>
  >['records'] = [];

  try {
    const res = await fetchVaccinationLedger();
    records = res.records;
  } catch {
    records = [];
  }

  if (records.length === 0) {
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
          <p className="mt-1 text-sm text-ink-600 font-mono">
            {records.length} lượt tiêm đã ghi nhận
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        {records.map((r) => (
          <article
            key={r.id}
            className="p-5 bg-white border border-ink-200 rounded-md flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-success-50 text-success-600 rounded-md flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-ink-900">
                {r.vaccineName}
                {r.doseNumber > 1 && (
                  <span className="ml-2 px-2 h-5 inline-flex items-center bg-info-50 text-info-700 text-xs font-medium rounded">
                    Mũi {r.doseNumber}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-xs text-ink-600 font-mono">
                <Calendar className="w-3 h-3 inline mr-1" aria-hidden="true" />
                {new Date(r.administeredAt).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-xs text-ink-500 mt-1">
                Tại: {r.branchName}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}