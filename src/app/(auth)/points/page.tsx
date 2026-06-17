// =====================================================
// /points — CUST-POINTS
// Điểm thưởng thành viên
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Star, Gift, TrendingUp, Award } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Điểm thưởng',
  description: 'Điểm thưởng thành viên PCMS và ưu đãi đặc quyền.',
};

const POINTS_DATA = {
  balance: 2580,
  tier: 'Vàng',
  tierProgress: { current: 2580, target: 5000, nextTier: 'Bạch Kim' },
  earned: 4250,
  used: 1670,
  expiring: { points: 200, date: '2026-12-31' },
};

const TRANSACTIONS = [
  { id: '1', date: '2026-06-10', desc: 'Đơn hàng ORD-20260610-0042', delta: +125, type: 'earn' },
  { id: '2', date: '2026-05-22', desc: 'Đổi voucher giảm 50K', delta: -500, type: 'use' },
  { id: '3', date: '2026-05-15', desc: 'Đơn hàng ORD-20260515-0008', delta: +78, type: 'earn' },
  { id: '4', date: '2026-04-30', desc: 'Sinh nhật thành viên', delta: +500, type: 'bonus' },
];

export default function PointsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-warning-50 to-accent-50 border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Điểm thưởng' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-warning-600 text-white text-xs font-semibold rounded-full">
            <Award className="w-3 h-3" aria-hidden="true" />
            Thành viên {POINTS_DATA.tier}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900">Điểm thưởng</h1>
        </div>
      </div>

      <div className="space-y-4">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <p className="text-xs text-ink-500">Số dư hiện tại</p>
          <p className="mt-1 text-4xl font-bold text-warning-700 font-mono">
            {POINTS_DATA.balance.toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-ink-500 mt-1">điểm</p>

          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-ink-600">
                Tiến độ lên{' '}
                <strong className="text-ink-900">{POINTS_DATA.tierProgress.nextTier}</strong>
              </p>
              <p className="text-xs font-mono text-ink-500">
                {POINTS_DATA.tierProgress.current} / {POINTS_DATA.tierProgress.target}
              </p>
            </div>
            <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-warning-500 rounded-full"
                style={{
                  width: `${(POINTS_DATA.tierProgress.current / POINTS_DATA.tierProgress.target) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <Stat icon={TrendingUp} label="Tổng tích lũy" value={POINTS_DATA.earned} color="success" />
          <Stat icon={Gift} label="Đã dùng" value={POINTS_DATA.used} color="primary" />
          <Stat icon={Star} label="Sắp hết hạn" value={POINTS_DATA.expiring.points} color="warning" />
        </section>

        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Lịch sử giao dịch</h2>
          <ul className="divide-y divide-ink-100">
            {TRANSACTIONS.map((tx) => (
              <li key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-900">{tx.desc}</p>
                  <p className="text-xs text-ink-500 font-mono">
                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span
                  className={
                    tx.delta > 0
                      ? 'text-success-700 font-semibold font-mono'
                      : 'text-danger-600 font-semibold font-mono'
                  }
                >
                  {tx.delta > 0 ? '+' : ''}
                  {tx.delta}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-ink-500 text-center">
          1 điểm = {formatVND(10)}. Đổi voucher, quà tặng từ cửa hàng điểm thưởng.
        </p>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Star;
  label: string;
  value: number;
  color: 'success' | 'primary' | 'warning';
}) {
  const colorMap = {
    success: 'bg-success-50 text-success-700',
    primary: 'bg-primary-50 text-primary-700',
    warning: 'bg-warning-50 text-warning-700',
  };
  return (
    <div className={`p-3 rounded-md ${colorMap[color]}`}>
      <Icon className="w-5 h-5" aria-hidden="true" />
      <p className="mt-1 text-xs opacity-80">{label}</p>
      <p className="text-lg font-bold font-mono">{value.toLocaleString('vi-VN')}</p>
    </div>
  );
}