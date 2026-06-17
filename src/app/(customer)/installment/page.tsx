// =====================================================
// /installment — SHOP-INSTALLMENT: Mua trước trả sau
// Trả góp 0% với Home Credit, FE Credit
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { InstallmentCalculator } from '@/components/shop/InstallmentCalculator';
import { CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trả góp',
  description: 'Mua trước trả sau với Home Credit, FE Credit. 0% lãi suất.',
};

const REQUIREMENTS = [
  'Công dân Việt Nam, từ 20–60 tuổi',
  'Có CMND/CCCD còn hiệu lực',
  'Chứng minh thu nhập (sao kê lương 3 tháng gần nhất)',
  'Hợp đồng lao động từ 12 tháng trở lên',
];

export default function ShopInstallmentPage() {
  return (
    <div className="bg-ink-50 min-h-screen">
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Trả góp' }]} />
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            Mua trước, trả sau
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Trả góp 0% lãi suất với Home Credit, FE Credit
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <InstallmentCalculator />

        <div className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
            <FileText className="w-4 h-4" aria-hidden="true" /> Điều kiện & hồ sơ
          </h2>
          <ul className="space-y-2">
            {REQUIREMENTS.map((req) => (
              <li
                key={req}
                className="flex items-start gap-2 text-sm text-ink-700"
              >
                <CheckCircle2
                  className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-info-50 border border-info-200 rounded-md flex items-start gap-3">
          <ShieldCheck
            className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-sm">
            <p className="font-medium text-info-900">Bảo mật thông tin</p>
            <p className="mt-1 text-info-700 text-pretty">
              Thông tin chỉ được chia sẻ với đối tác tài chính đã được cấp phép.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
