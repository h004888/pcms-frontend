// =====================================================
// /rx-console/vip — RX-VIP-MARK
// Đánh dấu khách VIP cần chăm sóc đặc biệt
// =====================================================

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Star, Crown, Phone, MessageSquare, Gift } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khách VIP',
  description: 'Danh sách khách hàng VIP — chăm sóc đặc biệt.',
};

const VIP_TIERS = [
  { id: 'platinum', label: 'Bạch Kim', minSpent: 10000000, color: 'bg-ink-900 text-accent-400' },
  { id: 'gold', label: 'Vàng', minSpent: 5000000, color: 'bg-warning-100 text-warning-800' },
  { id: 'silver', label: 'Bạc', minSpent: 1000000, color: 'bg-ink-100 text-ink-700' },
];

const MOCK_VIPS = [
  {
    id: 'vip-1',
    name: 'Lê Thị X',
    tier: 'platinum',
    spent: 12500000,
    orders: 47,
    lastContact: '2026-06-12',
    notes: 'Khách quen — con gái cũng hay mua',
  },
  {
    id: 'vip-2',
    name: 'Phạm Văn Y',
    tier: 'gold',
    spent: 7800000,
    orders: 32,
    lastContact: '2026-05-28',
    notes: 'Tiểu đường type 2, dùng insulin dài hạn',
  },
  {
    id: 'vip-3',
    name: 'Hoàng Thị Z',
    tier: 'gold',
    spent: 6200000,
    orders: 28,
    lastContact: '2026-06-05',
    notes: 'Mua cho cả gia đình 4 người',
  },
  {
    id: 'vip-4',
    name: 'Đỗ Văn W',
    tier: 'silver',
    spent: 2400000,
    orders: 15,
    lastContact: '2026-06-01',
    notes: '',
  },
];

export default function VipPage() {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Khách VIP' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning-600" aria-hidden="true" />
            Khách VIP
          </h1>
          <p className="text-sm text-ink-600 mt-1">Chăm sóc đặc biệt theo tier chi tiêu</p>
        </div>
      </div>

      <div className="space-y-4">
        <section className="grid grid-cols-3 gap-3">
          {VIP_TIERS.map((tier) => {
            const count = MOCK_VIPS.filter((v) => v.tier === tier.id).length;
            return (
              <div
                key={tier.id}
                className={`p-4 rounded-md ${tier.color}`}
              >
                <Star className="w-5 h-5 mb-1" aria-hidden="true" />
                <p className="text-xs opacity-80">{tier.label}</p>
                <p className="text-2xl font-bold font-mono">{count}</p>
                <p className="text-xs opacity-80 mt-1">
                  ≥ {(tier.minSpent / 1000000).toFixed(0)}M ₫
                </p>
              </div>
            );
          })}
        </section>

        <section className="space-y-3">
          {MOCK_VIPS.map((vip) => {
            const tier = VIP_TIERS.find((t) => t.id === vip.tier)!;
            return (
              <article
                key={vip.id}
                className="p-4 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tier.color}`}
                    >
                      <Crown className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-ink-900">{vip.name}</p>
                        <span className={`px-2 h-5 inline-flex items-center text-xs font-semibold rounded ${tier.color}`}>
                          {tier.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-500 font-mono">
                        Tổng chi: {vip.spent.toLocaleString('vi-VN')} ₫ · {vip.orders} đơn
                      </p>
                      {vip.notes && (
                        <p className="mt-1 text-xs text-ink-700 italic">📝 {vip.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      aria-label="Gọi điện"
                      className="w-8 h-8 inline-flex items-center justify-center bg-ink-100 text-ink-700 rounded hover:bg-ink-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Nhắn tin"
                      className="w-8 h-8 inline-flex items-center justify-center bg-ink-100 text-ink-700 rounded hover:bg-ink-200 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Tặng quà"
                      className="w-8 h-8 inline-flex items-center justify-center bg-ink-100 text-ink-700 rounded hover:bg-ink-200 transition-colors"
                    >
                      <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </>
  );
}