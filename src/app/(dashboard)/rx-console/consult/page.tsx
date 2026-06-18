// =====================================================
// /rx-console/consult — RX-CONSULT
// Tư vấn dược sĩ trong dashboard
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Stethoscope, User, MessageSquare, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tư vấn dược sĩ',
  description: 'Danh sách yêu cầu tư vấn từ khách hàng, dược sĩ xử lý.',
};

const MOCK_REQUESTS = [
  {
    id: 'cr-1',
    customer: 'Nguyễn Văn A',
    topic: 'Tư vấn dùng Paracetamol cho bé 5 tuổi',
    channel: 'in-person',
    priority: 'normal',
    waitTime: '5 phút',
  },
  {
    id: 'cr-2',
    customer: 'Trần Thị B',
    topic: 'Tương tác thuốc Amoxicillin + Vitamin C',
    channel: 'phone',
    priority: 'high',
    waitTime: '12 phút',
  },
  {
    id: 'cr-3',
    customer: 'Lê Văn C',
    topic: 'Cách dùng máy đo huyết áp tại nhà',
    channel: 'video',
    priority: 'normal',
    waitTime: '8 phút',
  },
];

export default function RxConsultPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Tư vấn' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Tư vấn dược sĩ</h1>
          <p className="text-sm text-ink-600 mt-1 font-mono">{MOCK_REQUESTS.length} yêu cầu đang chờ</p>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_REQUESTS.map((req) => (
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
                  <p className="text-sm font-semibold text-ink-900">{req.customer}</p>
                  <p className="mt-1 text-sm text-ink-700 text-pretty flex items-start gap-1">
                    <FileText className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {req.topic}
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1 px-2 h-5 bg-ink-100 text-ink-700 rounded">
                      <MessageSquare className="w-3 h-3" aria-hidden="true" />
                      {req.channel === 'in-person' ? 'Trực tiếp' : req.channel === 'phone' ? 'Điện thoại' : 'Video'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 h-5 bg-ink-100 text-ink-700 rounded font-mono">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {req.waitTime}
                    </span>
                    {req.priority === 'high' && (
                      <span className="px-2 h-5 bg-danger-100 text-danger-700 font-semibold rounded">
                        Ưu tiên
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href={`/rx-console/customer-360/${req.id}`}
                className="inline-flex items-center gap-1 px-3 h-9 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors flex-shrink-0"
              >
                <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                Xử lý
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}