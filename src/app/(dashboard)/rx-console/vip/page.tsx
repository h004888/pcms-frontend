// =====================================================
// /rx-console/vip — RX-VIP-MARK (real API)
// Đánh dấu khách VIP — /api/v1/vip-marks
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Crown, Loader2, Plus, Star } from 'lucide-react';
import {
  fetchVipMarksByCustomer,
  createVipMark,
} from '@/features/rx-console';
import type { VipMark } from '@/features/rx-console';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

interface VipCustomer {
  customerId: string;
  customerName?: string;
  tier: string;
  reason: string;
  spent?: number;
  orders?: number;
}

const TIERS = [
  { id: 'DIAMOND', label: 'Kim Cương', color: 'bg-info-50 text-info-700' },
  { id: 'PLATINUM', label: 'Bạch Kim', color: 'bg-ink-100 text-ink-900' },
  { id: 'GOLD', label: 'Vàng', color: 'bg-warning-100 text-warning-800' },
];

export default function VipPage() {
  const [vips, setVips] = useState<VipCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [tier, setTier] = useState('GOLD');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // Fetch all VIP marks from admin endpoint (returns all)
      const res = await apiClient.get<{ marks: VipMark[] } | VipMark[]>(
        '/vip-marks'
      );
      const body = res.data;
      const list: VipMark[] = Array.isArray(body)
        ? body
        : body?.marks ?? [];
      setVips(
        list.map((v) => ({
          customerId: v.customerId,
          customerName: v.customerName,
          tier: v.tier,
          reason: v.reason,
        }))
      );
    } catch {
      setVips([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId.trim() || !reason) {
      toast.error('Nhập đầy đủ thông tin');
      return;
    }
    setSubmitting(true);
    try {
      await createVipMark({
        customerId: customerId.trim(),
        tier,
        reason,
      });
      toast.success('Đã đánh dấu VIP');
      setCustomerId('');
      setReason('');
      setShowForm(false);
      await load();
    } catch {
      toast.error('Không thể đánh dấu');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Khách VIP' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning-600" aria-hidden="true" />
            Khách VIP
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Chăm sóc đặc biệt theo tier chi tiêu
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
        >
          <Plus className="w-4 h-4" /> Đánh dấu VIP
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-4 bg-white border border-ink-200 rounded-md space-y-3"
        >
          <div>
            <label className="text-sm font-semibold text-ink-900">Mã KH</label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="cust-uuid"
              className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm border border-ink-200 rounded-md"
            >
              {TIERS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">Lý do</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lý do đánh dấu VIP..."
              className="mt-1 w-full px-3 py-2 text-sm border border-ink-200 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Lưu
          </button>
        </form>
      )}

      <section className="grid grid-cols-3 gap-3">
        {TIERS.map((t) => {
          const count = vips.filter((v) => v.tier === t.id).length;
          return (
            <div
              key={t.id}
              className={`p-3 rounded-md ${t.color}`}
            >
              <Star className="w-5 h-5" />
              <p className="mt-1 text-xs opacity-80">{t.label}</p>
              <p className="mt-1 text-lg font-bold font-mono">{count}</p>
            </div>
          );
        })}
      </section>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-ink-500 py-6 text-center">
            <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
            Đang tải...
          </p>
        ) : vips.length === 0 ? (
          <p className="text-sm text-ink-500 py-6 text-center">
            Chưa có khách hàng VIP nào.
          </p>
        ) : (
          vips.map((v) => {
            const tierMeta = TIERS.find((t) => t.id === v.tier) ?? TIERS[2];
            return (
              <article
                key={v.customerId}
                className="p-4 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {v.customerName ?? v.customerId}
                    </p>
                    <p className="text-xs text-ink-500 font-mono mt-0.5">
                      {v.customerId}
                    </p>
                  </div>
                  <span
                    className={`px-2 h-6 inline-flex items-center text-xs font-semibold rounded ${tierMeta.color}`}
                  >
                    {tierMeta.label}
                  </span>
                </div>
                {v.reason && (
                  <p className="mt-2 text-sm text-ink-700">{v.reason}</p>
                )}
              </article>
            );
          })
        )}
      </div>
    </>
  );
}