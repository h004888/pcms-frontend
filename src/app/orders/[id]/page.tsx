'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/Layout';
import { Card, Button, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Order, OrderItem, Customer, Medicine } from '@/types';
import { formatDateTime, formatVND, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils';
import apiClient, { getErrorMessage } from '@/lib/api';
import { ArrowLeft, CreditCard, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useAuth();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await apiClient.get<Order>(`/orders/${orderId}`);
      setOrder(res.data);
      // Get customer info
      if (res.data.customerId) {
        try {
          const c = await apiClient.get<Customer>(`/customers/${res.data.customerId}`);
          setCustomer(c.data);
        } catch {}
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [orderId]);

  const handlePay = () => router.push(`/payments/${orderId}`);
  const handleCancel = async () => {
    if (!confirm('Hủy đơn hàng này? (BR06: hoàn trả tồn kho nếu đã thanh toán)')) return;
    try {
      await apiClient.delete(`/orders/${orderId}?actorId=${state.user?.id || ''}`);
      toast.success('Đã hủy đơn hàng');
      fetch();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  if (loading) return <DashboardLayout><LoadingSpinner size="lg" /></DashboardLayout>;
  if (!order) return <DashboardLayout><EmptyState title="Không tìm thấy đơn hàng" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4">
        Quay lại
      </Button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">Ngày tạo: {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {order.status === 'PENDING_PAYMENT' && (
            <>
              <Button onClick={handlePay} leftIcon={<CreditCard className="w-4 h-4" />}>Thanh toán</Button>
              <Button variant="danger" onClick={handleCancel} leftIcon={<Ban className="w-4 h-4" />}>Hủy đơn</Button>
            </>
          )}
          {order.status === 'PAID' && (
            <Badge variant="success"><CheckCircle className="w-3 h-3 inline mr-1" />Đã thanh toán</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Sản phẩm">
            <table className="min-w-full">
              <thead className="border-b border-gray-200">
                <tr className="text-xs uppercase text-gray-500">
                  <th className="text-left py-2">Thuốc</th>
                  <th className="text-center">SL</th>
                  <th className="text-right">Đơn giá</th>
                  <th className="text-right">Giảm</th>
                  <th className="text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <p className="font-medium">{item.medicineName || item.medicineId}</p>
                    </td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-right text-sm">{formatVND(item.unitPrice)}</td>
                    <td className="text-right text-sm text-red-600">{item.discount > 0 ? `-${formatVND(item.discount)}` : '—'}</td>
                    <td className="text-right font-semibold">{formatVND(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Trạng thái">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn:</span>
                <span className="font-mono text-xs">{order.orderNumber}</span>
              </div>
            </div>
          </Card>

          <Card title="Khách hàng">
            {customer ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{customer.name}</p>
                <p className="text-gray-500">📞 {customer.phone}</p>
                {customer.email && <p className="text-gray-500">✉️ {customer.email}</p>}
                <p className="text-medical-600">⭐ {customer.points} điểm</p>
              </div>
            ) : <p className="text-sm text-gray-500">ID: {order.customerId}</p>}
          </Card>

          <Card title="Thanh toán">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tạm tính:</span><span>{formatVND(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Giảm giá:</span><span className="text-red-600">-{formatVND(order.discount)}</span></div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Tổng:</span><span className="text-medical-700">{formatVND(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
