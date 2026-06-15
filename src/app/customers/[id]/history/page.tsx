'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/Layout';
import { Card, LoadingSpinner, Button, EmptyState, Badge } from '@/components/ui';
import { Customer, Order, OrderStatus } from '@/types';
import { formatDateTime, formatVND, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils';
import apiClient, { getErrorMessage } from '@/lib/api';
import { ArrowLeft, History, Phone, Mail, Star } from 'lucide-react';

export default function CustomerHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [custRes, ordRes] = await Promise.allSettled([
          apiClient.get<Customer>(`/customers/${customerId}`),
          apiClient.get(`/orders?customerId=${customerId}&size=50`),
        ]);
        if (custRes.status === 'fulfilled') setCustomer(custRes.value.data);
        if (ordRes.status === 'fulfilled') setOrders(ordRes.value.data.data || []);
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [customerId]);

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4">
        Quay lại
      </Button>

      {loading ? <LoadingSpinner size="lg" /> : !customer ? <EmptyState title="Không tìm thấy khách hàng" /> : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử mua hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Khách hàng: {customer.name}</p>
          </div>

          {/* Customer info */}
          <Card title="Thông tin khách hàng" className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mã KH</p>
                <p className="font-mono font-semibold text-primary-700">{customer.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Điểm thưởng</p>
                <p className="flex items-center gap-1 text-medical-700 font-bold text-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{customer.points}
                </p>
              </div>
            </div>
          </Card>

          {/* Order history */}
          <Card title={`Lịch sử đơn hàng (${orders.length})`} subtitle="Tất cả đơn hàng của khách này">
            {orders.length === 0 ? (
              <EmptyState title="Chưa có đơn hàng nào" description="Khách hàng chưa thực hiện giao dịch nào" />
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.map((o) => (
                  <li key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{o.orderNumber}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-medical-700">{formatVND(o.total)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${ORDER_STATUS_COLORS[o.status]}`}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
