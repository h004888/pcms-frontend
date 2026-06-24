// =====================================================
// /rx-console/customer-360 — RX-CUST-PROFILE-360 (real API)
// Hồ sơ 360° khách hàng — /api/v1/rx/customers/:id/profile-360
// =====================================================

'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import {
  User,
  FileText,
  Heart,
  Pill,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { fetchCustomer360 } from '@/features/rx-console';
import type { Customer360 } from '@/features/rx-console';
import { formatVND } from '@/lib/shop/format';
import toast from 'react-hot-toast';

export default function Customer360Page() {
  const [customerId, setCustomerId] = useState('');
  const [profile, setProfile] = useState<Customer360 | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId.trim()) {
      toast.error('Vui lòng nhập mã khách hàng');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCustomer360(customerId.trim());
      setProfile(data);
    } catch {
      toast.error('Không tìm thấy khách hàng');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'RX Console' }, { label: 'Customer 360°' }]} />
          <h1 className="mt-3 text-xl font-bold text-ink-900">
            Hồ sơ 360° khách hàng
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Tổng quan toàn bộ lịch sử tương tác
          </p>
        </div>
      </div>

      <form
        onSubmit={load}
        className="p-4 bg-white border border-ink-200 rounded-md flex gap-2"
      >
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Nhập mã khách hàng (UUID)"
          className="flex-1 h-10 px-3 text-sm font-mono border border-ink-200 rounded-md focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 h-10 inline-flex items-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <User className="w-4 h-4" />
          )}
          Xem hồ sơ
        </button>
      </form>

      {loading && (
        <p className="text-sm text-ink-500 text-center py-8">Đang tải hồ sơ...</p>
      )}

      {!loading && !profile && (
        <div className="p-6 bg-ink-50 border border-ink-200 rounded-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-ink-400" />
          <p className="mt-2 text-sm text-ink-600">
            Nhập mã khách hàng để xem hồ sơ 360°
          </p>
        </div>
      )}

      {profile && (
        <div className="space-y-4">
          <section className="p-5 bg-white border border-ink-200 rounded-md">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-accent-700" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-ink-900">
                  {profile.name}
                </h2>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {profile.tier && (
                    <span className="px-2 h-5 bg-warning-100 text-warning-700 text-xs font-semibold rounded-full">
                      Thành viên {profile.tier}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="font-mono text-xs text-ink-500">
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-success-50 text-success-700">
              <TrendingUp className="w-5 h-5" />
              <p className="mt-1 text-xs opacity-80">Tổng chi tiêu</p>
              <p className="mt-1 text-sm font-bold font-mono">
                {profile.totalSpent != null ? formatVND(profile.totalSpent) : '—'}
              </p>
            </div>
            <div className="p-3 rounded-md bg-primary-50 text-primary-700">
              <FileText className="w-5 h-5" />
              <p className="mt-1 text-xs opacity-80">Đơn hàng</p>
              <p className="mt-1 text-sm font-bold font-mono">
                {profile.totalOrders ?? 0}
              </p>
            </div>
            <div className="p-3 rounded-md bg-warning-50 text-warning-700">
              <Pill className="w-5 h-5" />
              <p className="mt-1 text-xs opacity-80">Gia đình</p>
              <p className="mt-1 text-sm font-bold font-mono">
                {profile.familyMembers?.length ?? 0}
              </p>
            </div>
          </section>

          {profile.allergies && profile.allergies.length > 0 && (
            <section className="p-5 bg-white border border-ink-200 rounded-md">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
                <Heart className="w-4 h-4 text-danger-600" /> Dị ứng
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((a) => (
                  <span
                    key={a}
                    className="px-3 h-7 inline-flex items-center bg-danger-50 text-danger-700 text-xs font-medium rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {profile.conditions && profile.conditions.length > 0 && (
            <section className="p-5 bg-white border border-ink-200 rounded-md">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
                <Pill className="w-4 h-4 text-warning-600" /> Bệnh nền
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.conditions.map((c) => (
                  <span
                    key={c}
                    className="px-3 h-7 inline-flex items-center bg-warning-50 text-warning-700 text-xs font-medium rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>
          )}

          {profile.recentOrders && profile.recentOrders.length > 0 && (
            <section className="p-5 bg-white border border-ink-200 rounded-md">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-3">
                <FileText className="w-4 h-4 text-primary-600" /> Đơn hàng gần đây
              </h2>
              <ul className="divide-y divide-ink-100">
                {profile.recentOrders.map((o) => (
                  <li
                    key={o.id}
                    className="py-2 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-mono font-medium text-ink-900">
                        #{o.code}
                      </p>
                      <p className="text-xs text-ink-500 font-mono">
                        {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <p className="font-semibold text-accent-700 font-mono">
                      {formatVND(o.total)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}