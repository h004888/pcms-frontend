// =====================================================
// /points — CUST-POINTS (polished)
// Filter transactions + redeem voucher modal
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Star, Gift, TrendingUp, Award, X, Sparkles } from 'lucide-react';
import { formatVND } from '@/lib/shop/format';
import { fetchPoints, redeemReward } from '@/features/points';
import type { PointsAccount, PointTransaction, PointReward } from '@/features/points';

const TX_FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'earn', label: 'Tích lũy' },
  { id: 'use', label: 'Đã dùng' },
  { id: 'bonus', label: 'Thưởng' },
] as const;

export default function PointsPage() {
  const [account, setAccount] = useState<PointsAccount | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [rewards, setRewards] = useState<PointReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof TX_FILTERS)[number]['id']>('all');
  const [redeeming, setRedeeming] = useState<PointReward | null>(null);

  useEffect(() => {
    fetchPoints()
      .then((data) => {
        setAccount(data.account);
        setTransactions(data.transactions);
        setRewards(data.rewards);
      })
      .catch(() => toast.error('Không tải được thông tin điểm thưởng'))
      .finally(() => setLoading(false));
  }, []);

  const list = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  const confirmRedeem = async () => {
    if (!redeeming || !account) return;
    if (account.balance < redeeming.cost) {
      toast.error(`Bạn cần thêm ${redeeming.cost - account.balance} điểm để đổi quà này`);
      return;
    }
    try {
      await redeemReward({ rewardId: redeeming.id });
      toast.success(`Đã đổi "${redeeming.title}" — kiểm tra voucher của bạn!`);
      setRedeeming(null);
      // Refresh data
      const data = await fetchPoints();
      setAccount(data.account);
      setTransactions(data.transactions);
    } catch {
      toast.error('Không đổi được quà');
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Điểm thưởng' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900">Điểm thưởng</h1>
        <p className="text-sm text-ink-600 mt-2">Đang tải...</p>
      </>
    );
  }

  if (!account) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Điểm thưởng' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900">Điểm thưởng</h1>
        <p className="text-sm text-ink-600 mt-2">Không có dữ liệu</p>
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-warning-50 to-accent-50 border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: 'Tài khoản' }, { label: 'Điểm thưởng' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-warning-600 text-white text-xs font-semibold rounded-full">
            <Award className="w-3 h-3" aria-hidden="true" />
            Thành viên {account.tier}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900">Điểm thưởng</h1>
        </div>
      </div>

      <div className="space-y-4">
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <p className="text-xs text-ink-500">Số dư hiện tại</p>
          <p className="mt-1 text-4xl font-bold text-warning-700 font-mono">
            {account.balance.toLocaleString('vi-VN')}
          </p>
          <p className="text-xs text-ink-500 mt-1">điểm</p>

          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-ink-600">
                Tiến độ lên <strong className="text-ink-900">{account.tierProgress.nextTier}</strong>
              </p>
              <p className="text-xs font-mono text-ink-500">
                {account.tierProgress.current} / {account.tierProgress.target}
              </p>
            </div>
            <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-warning-500 rounded-full transition-all"
                style={{
                  width: `${(account.tierProgress.current / account.tierProgress.target) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Stat icon={TrendingUp} label="Tổng tích lũy" value={account.earned} color="success" />
          <Stat icon={Gift} label="Đã dùng" value={account.used} color="primary" />
        </section>

        {/* Redeem section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
              <Sparkles className="w-4 h-4 text-warning-600" aria-hidden="true" />
              Đổi điểm lấy quà
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {rewards.map((r) => {
              const canAfford = account.balance >= r.cost;
              return (
                <div
                  key={r.id}
                  className={`p-4 bg-white border rounded-md ${
                    canAfford ? 'border-ink-200' : 'border-ink-100 opacity-60'
                  }`}
                >
                  <p className="text-sm font-semibold text-ink-900">{r.title}</p>
                  <p className="mt-1 text-xs text-ink-500">{r.desc}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold font-mono text-warning-700">
                      {r.cost.toLocaleString('vi-VN')} điểm
                    </span>
                    <button
                      type="button"
                      onClick={() => setRedeeming(r)}
                      disabled={!canAfford}
                      className="inline-flex items-center gap-1 px-3 h-8 text-xs font-semibold bg-accent-600 text-white rounded-md hover:bg-accent-700 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Gift className="w-3 h-3" aria-hidden="true" />
                      Đổi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transactions */}
        <section className="p-5 bg-white border border-ink-200 rounded-md">
          <h2 className="text-base font-semibold text-ink-900 mb-3">Lịch sử giao dịch</h2>
          <div className="flex gap-2 flex-wrap mb-3" role="tablist">
            {TX_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`px-3 h-7 text-xs font-medium rounded-full transition-colors ${
                  filter === f.id ? 'bg-accent-600 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-ink-100">
            {list.map((tx) => (
              <li key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-900">{tx.desc}</p>
                  <p className="text-xs text-ink-500 font-mono">
                    {new Date(tx.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span
                  className={`font-semibold font-mono ${
                    tx.delta > 0 ? 'text-success-700' : 'text-danger-600'
                  }`}
                >
                  {tx.delta > 0 ? '+' : ''}
                  {tx.delta}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-ink-500 text-center">
          1 điểm = {formatVND(10)}. Điểm có thời hạn 12 tháng kể từ ngày tích lũy.
        </p>
      </div>

      {/* Redeem confirm modal */}
      {redeeming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="redeem-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRedeeming(null);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-ink-200">
              <h2 id="redeem-title" className="text-base font-semibold text-ink-900">
                Xác nhận đổi điểm
              </h2>
              <button
                type="button"
                onClick={() => setRedeeming(null)}
                aria-label="Đóng"
                className="p-1 text-ink-400 hover:text-ink-700 rounded"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-ink-700">
                Bạn muốn đổi{' '}
                <strong className="text-warning-700">{redeeming.cost.toLocaleString('vi-VN')} điểm</strong>{' '}
                để nhận:
              </p>
              <div className="p-3 bg-warning-50 border border-warning-200 rounded-md">
                <p className="text-sm font-semibold text-ink-900">{redeeming.title}</p>
                <p className="mt-1 text-xs text-ink-500">{redeeming.desc}</p>
              </div>
              <p className="text-xs text-ink-500">
                Số dư sau đổi:{' '}
                <strong className="font-mono text-ink-900">
                  {(account.balance - redeeming.cost).toLocaleString('vi-VN')}
                </strong>{' '}
                điểm
              </p>
            </div>
            <div className="flex gap-2 p-4 border-t border-ink-200">
              <button
                type="button"
                onClick={() => setRedeeming(null)}
                className="flex-1 h-10 text-sm font-medium border border-ink-200 rounded-md hover:bg-ink-50"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={confirmRedeem}
                className="flex-1 h-10 inline-flex items-center justify-center gap-1 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
              >
                <Gift className="w-4 h-4" aria-hidden="true" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
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
