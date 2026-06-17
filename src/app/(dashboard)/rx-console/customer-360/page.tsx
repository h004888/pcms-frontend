// =====================================================
// /rx-console/customer-360 — RX-CUST-PROFILE-360
// Hồ sơ 360 độ khách hàng (cho dược sĩ)
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { User, FileText, Heart, Pill, Calendar, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ 360° khách hàng',
  description: 'Xem toàn bộ lịch sử tư vấn, mua hàng, thuốc của khách hàng.',
};

const MOCK_CUSTOMER = {
  name: 'Nguyễn Văn A',
  phone: '090****567',
  birthday: '1990-05-15',
  tier: 'Vàng',
  totalSpent: 4250000,
  totalOrders: 18,
  allergies: ['Penicillin'],
  conditions: ['Tăng huyết áp'],
};

const RECENT_ORDERS = [
  { id: 'ord-1', date: '2026-06-10', total: 405000, status: 'Đã giao' },
  { id: 'ord-2', date: '2026-05-15', total: 248000, status: 'Đã giao' },
  { id: 'ord-3', date: '2026-04-20', total: 180000, status: 'Hoàn tất' },
];

export default function Customer360Page() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Customer 360°' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">Hồ sơ 360° khách hàng</h1>
          <p className="text-sm text-ink-600 mt-1">Tổng quan toàn bộ lịch sử tương tác</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-accent-700" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink-900">{MOCK_CUSTOMER.name}</h2>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="px-2 h-5 bg-warning-100 text-warning-700 text-xs font-semibold rounded-full">
                  Thành viên {MOCK_CUSTOMER.tier}
                </span>
                <span className="font-mono text-xs text-ink-500">{MOCK_CUSTOMER.phone}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-ink-500">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {new Date(MOCK_CUSTOMER.birthday).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tổng chi tiêu', value: MOCK_CUSTOMER.totalSpent.toLocaleString('vi-VN') + ' ₫', icon: TrendingUp, color: 'success' },
            { label: 'Đơn hàng', value: String(MOCK_CUSTOMER.totalOrders), icon: FileText, color: 'primary' },
            { label: 'Tư vấn', value: '5', icon: Pill, color: 'warning' },
          ].map((s) => {
            const Icon = s.icon;
            const colorMap = {
              success: 'bg-success-50 text-success-700',
              primary: 'bg-primary-50 text-primary-700',
              warning: 'bg-warning-50 text-warning-700',
            };
            return (
              <div key={s.label} className={`p-3 rounded-md ${colorMap[s.color as keyof typeof colorMap]}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
                <p className="mt-1 text-xs opacity-80">{s.label}</p>
                <p className="text-base font-bold font-mono">{s.value}</p>
              </div>
            );
          })}
        </section>

        <section className="p-5 bg-danger-50 border border-danger-200 rounded-md">
          <h2 className="flex items-center gap-2 text-base font-semibold text-danger-900 mb-3">
            <Heart className="w-4 h-4" aria-hidden="true" />
            Cảnh báo y khoa
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong className="text-danger-900">Dị ứng:</strong>{' '}
              <span className="text-danger-800">{MOCK_CUSTOMER.allergies.join(', ')}</span>
            </p>
            <p>
              <strong className="text-danger-900">Bệnh nền:</strong>{' '}
              <span className="text-danger-800">{MOCK_CUSTOMER.conditions.join(', ')}</span>
            </p>
          </div>
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Đơn hàng gần đây</h2>
          <ul className="divide-y divide-ink-100">
            {RECENT_ORDERS.map((o) => (
              <li key={o.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink-900 font-mono">#{o.id}</p>
                  <p className="text-xs text-ink-500 font-mono">
                    {new Date(o.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink-900 font-mono">
                    {o.total.toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-xs text-success-700">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}