// =====================================================
// /rx-console/follow-up — RX-FOLLOW-UP (real API)
// Theo dõi sau bán — /api/v1/follow-ups/by-customer/:id
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import {
  Calendar,
  Bell,
  MessageSquare,
  Phone,
  Loader2,
  Plus,
} from 'lucide-react';
import {
  fetchFollowUpsByCustomer,
  createFollowUp,
} from '@/features/rx-console';
import type { FollowUp } from '@/features/rx-console';
import toast from 'react-hot-toast';

export default function FollowUpPage() {
  const [customerId, setCustomerId] = useState('');
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  async function load() {
    if (!customerId.trim()) {
      toast.error('Nhập mã khách hàng');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchFollowUpsByCustomer(customerId.trim());
      setFollowUps(res.followUps);
    } catch {
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId.trim() || !notes || !dueDate) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      await createFollowUp({
        customerId: customerId.trim(),
        notes,
        dueDate,
      });
      toast.success('Đã tạo follow-up');
      setNotes('');
      setDueDate('');
      setShowForm(false);
      await load();
    } catch {
      toast.error('Không thể tạo follow-up');
    }
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Follow-up' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">
            Follow-up sau bán
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Theo dõi refill, tái khám, phản ứng phụ
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border border-ink-200 rounded-md flex gap-2 flex-wrap">
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Mã khách hàng"
          className="flex-1 min-w-[200px] h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
        />
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          Tải danh sách
        </button>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 h-10 bg-ink-100 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-200"
        >
          <Plus className="w-4 h-4" />
          Tạo mới
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-4 bg-white border border-ink-200 rounded-md space-y-3"
        >
          <div>
            <label className="text-sm font-semibold text-ink-900">Ghi chú</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Nhắc tái khám sau 30 ngày..."
              className="mt-1 w-full px-3 py-2 text-sm border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-900">Ngày đến hạn</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
            />
          </div>
          <button
            type="submit"
            className="px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700"
          >
            Lưu
          </button>
        </form>
      )}

      <div className="space-y-3">
        {followUps.map((f) => (
          <article
            key={f.id}
            className="p-4 bg-white border border-ink-200 rounded-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {f.customerName ?? f.customerId}
                </p>
                <p className="text-xs text-ink-500 mt-1 font-mono">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Đến hạn: {new Date(f.dueDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <span
                className={`px-2 h-6 inline-flex items-center text-xs font-semibold rounded ${
                  f.status === 'COMPLETED'
                    ? 'bg-success-100 text-success-700'
                    : f.status === 'CANCELLED'
                      ? 'bg-ink-100 text-ink-600'
                      : 'bg-warning-100 text-warning-700'
                }`}
              >
                {f.status === 'COMPLETED'
                  ? 'Hoàn tất'
                  : f.status === 'CANCELLED'
                    ? 'Đã hủy'
                    : 'Đang chờ'}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-700">{f.notes}</p>
            {f.response && (
              <p className="mt-2 text-xs text-info-700 italic">
                Phản hồi: {f.response}
              </p>
            )}
          </article>
        ))}
        {!loading && followUps.length === 0 && customerId && (
          <p className="text-sm text-ink-500 py-6 text-center">
            Chưa có follow-up cho khách hàng này.
          </p>
        )}
      </div>
    </>
  );
}