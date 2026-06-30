// =====================================================
// /rx-console/consult — RX-CONSULT (real API)
// Danh sách yêu cầu tư vấn — /api/v1/consultations
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { EmptyState } from '@/components/ui/Feedback';
import { Stethoscope, User, MessageSquare, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchConsultations } from '@/features/rx-console';
import type { Consultation } from '@/features/consultations';

export const metadata: Metadata = {
  title: 'Tư vấn dược sĩ',
  description: 'Danh sách yêu cầu tư vấn từ khách hàng, dược sĩ xử lý.',
};

const CHANNEL_LABELS: Record<string, string> = {
  IN_PERSON: 'Trực tiếp',
  PHONE: 'Điện thoại',
  VIDEO: 'Video',
};

export default async function RxConsultPage() {
  let consultations: Consultation[] = [];
  try {
    const res = await fetchConsultations({ status: 'SCHEDULED' });
    consultations = res.consultations;
  } catch {
    consultations = [];
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Tư vấn' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Tư vấn dược sĩ</h1>
          <p className="text-sm text-ink-600 mt-1 font-mono">{consultations.length} yêu cầu đang chờ</p>
        </div>
      </div>

      {consultations.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="Không có yêu cầu tư vấn"
          description="Chưa có yêu cầu tư vấn nào đang chờ xử lý."
        />
      ) : (
        <div className="space-y-3">
          {consultations.map((req) => (
            <article
              key={req.id}
              className="p-4 bg-white border border-ink-200 rounded-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-accent-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{req.customerId}</p>
                    <p className="mt-1 text-sm text-ink-700 text-pretty flex items-start gap-1">
                      <FileText className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {req.topic}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2 h-5 bg-ink-100 text-ink-700 rounded">
                        <MessageSquare className="w-3 h-3" aria-hidden="true" />
                        {CHANNEL_LABELS[req.type] ?? req.type}
                      </span>
                      {req.scheduledAt && (
                        <span className="inline-flex items-center gap-1 px-2 h-5 bg-ink-100 text-ink-700 rounded font-mono">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {new Date(req.scheduledAt).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/rx-console/customer-360/${req.customerId}`}
                  className="inline-flex items-center gap-1 px-3 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors flex-shrink-0"
                >
                  <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                  Xử lý
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
