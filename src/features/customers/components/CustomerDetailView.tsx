// =====================================================
// PCMS - Customer Detail View (UC08 - SCR-CUST-DETAIL)
// Trang chi tiết khách hàng + tabs: Orders, Points, History
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, LoadingSpinner, Button, EmptyState, Badge, Alert } from '@/components/ui';
import { Customer, Order } from '@/types';
import { formatDateTime, formatVND, getStatusColor } from '@/lib/utils';
import { apiClient, getErrorMessage } from '@/lib/api';
import { ArrowLeft, Phone, Mail, MapPin, Edit, Star, Wallet, FileText, History } from 'lucide-react';
import { DashboardLayout } from '@/components/Layout';
import toast from 'react-hot-toast';

type Tab = 'overview' | 'orders' | 'points' | 'history';

const TIER_COLORS: Record<string, string> = {
  BRONZE: 'bg-amber-100 text-amber-800 border-amber-300',
  SILVER: 'bg-slate-200 text-slate-800 border-slate-400',
  GOLD: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  PLATINUM: 'bg-purple-100 text-purple-800 border-purple-400',
};

const TIER_LABELS: Record<string, string> = {
  BRONZE: 'Đồng',
  SILVER: 'Bạc',
  GOLD: 'Vàng',
  PLATINUM: 'Bạch kim',
};

export function CustomerDetailView() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [custRes, ordRes] = await Promise.allSettled([
          apiClient.get<Customer>(`/customers/${customerId}`),
          apiClient.get<{ data: Order[] }>(`/orders?customerId=${customerId}&size=20`),
        ]);
        if (custRes.status === 'fulfilled') {
          setCustomer(custRes.value.data);
        } else {
          toast.error('Không tìm thấy khách hàng');
          router.push('/customers');
          return;
        }
        if (ordRes.status === 'fulfilled') {
          setOrders(ordRes.value.data?.data || []);
        }
        // Points: try but tolerate 404
        try {
          const ptsRes = await apiClient.get<{ data: any[] }>(`/customers/${customerId}/points?size=20`);
          setPoints(ptsRes.data.data || []);
        } catch {
          setPoints([]);
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [customerId, router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <EmptyState title="Không tìm thấy khách hàng" />
      </DashboardLayout>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link href="/customers" className="inline-flex items-center gap-1 text-sm text-ink-600 hover:text-accent-700">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>
      </div>

      {/* Header card */}
      <Card className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-2xl font-bold text-accent-700">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-900">{customer.name}</h1>
              <p className="text-sm text-ink-500 font-mono mt-1">{customer.code}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-ink-600">
                {customer.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{customer.phone}</span>}
                {customer.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</span>}
                {customer.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{customer.address}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${TIER_COLORS[customer.tier] || 'bg-ink-100'}`}>
              <Star className="w-4 h-4 mr-1" />
              {TIER_LABELS[customer.tier] || customer.tier}
            </span>
            <span className="text-sm text-ink-600">
              Điểm: <span className="font-bold text-accent-700 text-lg">{customer.points}</span>
            </span>
            <Button variant="outline" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
              Sửa
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-ink-200">
          <div>
            <p className="text-xs text-ink-500 uppercase tracking-wide">Tổng đơn</p>
            <p className="text-2xl font-bold text-ink-900 mt-1">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs text-ink-500 uppercase tracking-wide">Tổng chi</p>
            <p className="text-2xl font-bold text-accent-700 mt-1">{formatVND(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-500 uppercase tracking-wide">Điểm hiện tại</p>
            <p className="text-2xl font-bold text-ink-900 mt-1">{customer.points}</p>
          </div>
          <div>
            <p className="text-xs text-ink-500 uppercase tracking-wide">Ngày tạo</p>
            <p className="text-sm text-ink-700 mt-1">{formatDateTime(customer.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-ink-200 mb-4">
        <div role="tablist" className="flex gap-1 -mb-px overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan', icon: FileText },
            { id: 'orders', label: `Đơn hàng (${orders.length})`, icon: Wallet },
            { id: 'points', label: `Điểm thưởng (${points.length})`, icon: Star },
            { id: 'history', label: 'Lịch sử', icon: History },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                onClick={() => setTab(t.id as Tab)}
                className={`px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                  tab === t.id
                    ? 'border-accent-600 text-accent-700'
                    : 'border-transparent text-ink-600 hover:text-ink-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-ink-700 mb-3">Thông tin cá nhân</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Mã KH</dt><dd className="font-mono">{customer.code}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Họ tên</dt><dd>{customer.name}</dd></div>
              {customer.dob && <div className="flex justify-between"><dt className="text-ink-500">Ngày sinh</dt><dd>{customer.dob}</dd></div>}
              {customer.gender && <div className="flex justify-between"><dt className="text-ink-500">Giới tính</dt><dd>{customer.gender}</dd></div>}
              <div className="flex justify-between"><dt className="text-ink-500">Trạng thái</dt><dd><Badge variant="info">{customer.status}</Badge></dd></div>
            </dl>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-ink-700 mb-3">Liên hệ</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">SĐT</dt><dd>{customer.phone || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Email</dt><dd>{customer.email || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Địa chỉ</dt><dd className="text-right max-w-[60%]">{customer.address || '—'}</dd></div>
            </dl>
          </Card>
          <div className="md:col-span-2">
            <Link href={`/customers/${customerId}/history`} className="text-sm text-accent-700 hover:underline">
              → Xem trang lịch sử mua hàng đầy đủ
            </Link>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <Card>
          {orders.length === 0 ? (
            <EmptyState title="Chưa có đơn hàng" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-500 text-xs uppercase border-b border-ink-200">
                    <th className="pb-2">Mã đơn</th>
                    <th className="pb-2">Ngày</th>
                    <th className="pb-2 text-right">Tổng</th>
                    <th className="pb-2">Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-ink-100 hover:bg-ink-50">
                      <td className="py-2 font-mono text-xs">{o.orderNumber}</td>
                      <td className="py-2 text-ink-600">{formatDateTime(o.createdAt)}</td>
                      <td className="py-2 text-right font-semibold">{formatVND(o.total)}</td>
                      <td className="py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="py-2 text-right">
                        <Link href={`/orders/${o.id}`} className="text-accent-700 hover:underline text-xs">Xem</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab === 'points' && (
        <Card>
          {points.length === 0 ? (
            <Alert variant="info" title="Chưa có lịch sử điểm">Endpoint /customers/{customerId}/points chưa có data hoặc chưa được implement trong backend.</Alert>
          ) : (
            <div className="space-y-2">
              {points.map((p: any) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-ink-100">
                  <div>
                    <p className="font-medium">{p.reason || 'Giao dịch điểm'}</p>
                    <p className="text-xs text-ink-500">{formatDateTime(p.createdAt)}</p>
                  </div>
                  <span className={`font-semibold ${(p.points || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(p.points || 0) > 0 ? '+' : ''}{p.points} điểm
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'history' && (
        <Card>
          <Alert variant="info" title="Lịch sử đầy đủ">
            Xem trang lịch sử mua hàng chi tiết: <Link href={`/customers/${customerId}/history`} className="text-accent-700 hover:underline">/customers/{customerId}/history</Link>
          </Alert>
        </Card>
      )}
    </DashboardLayout>
  );
}
