'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/Layout';
import { Card, Input, Select, Button, LoadingSpinner } from '@/components/ui';
import { Order, PaymentMethod, Payment } from '@/types';
import { formatVND, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import apiClient, { getErrorMessage } from '@/lib/api';
import { ArrowLeft, CreditCard, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const METHOD_OPTIONS = [
  { value: 'CASH', label: 'Tiền mặt' },
  { value: 'CARD', label: 'Thẻ' },
  { value: 'QR', label: 'QR Code' },
];

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useAuth();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [tendered, setTendered] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paidPayment, setPaidPayment] = useState<Payment | null>(null);

  useEffect(() => {
    apiClient.get<Order>(`/orders/${orderId}`).then((res) => {
      setOrder(res.data);
      setTendered(res.data.total.toString());
    }).catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [orderId]);

  const tenderedAmount = parseFloat(tendered) || 0;
  const changeAmount = order ? Math.max(0, tenderedAmount - order.total) : 0;
  const canPay = order && tenderedAmount >= order.total;

  const handlePay = async () => {
    if (!order || !state.user) return;
    if (method === 'CASH' && tenderedAmount < order.total) {
      toast.error('Số tiền khách đưa không đủ (MSG21)');
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = {
        orderId: order.id,
        paymentMethod: method,
        amount: order.total,
        staffId: state.user.id,
      };
      if (method === 'CASH') payload.tenderedAmount = tenderedAmount;
      if (method !== 'CASH') payload.transactionRef = txnRef || `${method}_${Date.now()}`;

      const res = await apiClient.post<Payment>('/payments', payload);
      toast.success('Thanh toán thành công! Đang trừ tồn kho...');
      setPaidPayment(res.data);
      // Auto mark order as paid (calls order-service internally)
      try {
        await apiClient.put(`/orders/${order.id}/pay?actorId=${state.user.id}`);
      } catch {}
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner size="lg" /></DashboardLayout>;
  if (!order) return <DashboardLayout><div>Không tìm thấy đơn hàng</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4">
        Quay lại đơn hàng
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
        <p className="text-sm text-gray-500 mt-1">SCR-PAYMENT · Đơn hàng: {order.orderNumber}</p>
      </div>

      {paidPayment ? (
        // Success state
        <Card>
          <div className="text-center py-6">
            <div className="inline-flex p-4 bg-medical-50 rounded-full mb-3">
              <CreditCard className="w-10 h-10 text-medical-600" />
            </div>
            <h2 className="text-2xl font-bold text-medical-700 mb-1">Thanh toán thành công!</h2>
            <p className="text-sm text-gray-500">Mã hóa đơn: <strong>{paidPayment.invoiceNumber || 'Đang tạo...'}</strong></p>
            <div className="mt-4 max-w-sm mx-auto bg-gray-50 rounded-lg p-4 text-left">
              <div className="flex justify-between text-sm"><span>Tổng thanh toán:</span><strong>{formatVND(order.total)}</strong></div>
              <div className="flex justify-between text-sm"><span>Phương thức:</span><strong>{PAYMENT_METHOD_LABELS[paidPayment.paymentMethod]}</strong></div>
              {paidPayment.tenderedAmount && (
                <div className="flex justify-between text-sm"><span>Khách đưa:</span><strong>{formatVND(paidPayment.tenderedAmount)}</strong></div>
              )}
              {paidPayment.changeAmount && paidPayment.changeAmount > 0 && (
                <div className="flex justify-between text-sm text-medical-700"><span>Tiền thừa:</span><strong>{formatVND(paidPayment.changeAmount)}</strong></div>
              )}
            </div>
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>In hóa đơn</Button>
              <Button onClick={() => router.push('/orders')}>Về danh sách</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Thông tin thanh toán">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Mã đơn:</span><span className="font-mono">{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Số sản phẩm:</span><span>{order.items.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tạm tính:</span><span>{formatVND(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Giảm giá:</span><span className="text-red-600">-{formatVND(order.discount)}</span></div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Tổng:</span><span className="text-medical-700">{formatVND(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card title="Phương thức thanh toán">
            <Select
              label="Phương thức"
              options={METHOD_OPTIONS}
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="mb-4"
            />

            {method === 'CASH' ? (
              <>
                <Input
                  label="Khách đưa (VND)"
                  type="number"
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                  className="mb-3"
                />
                {tenderedAmount > 0 && (
                  <div className="bg-medical-50 border border-medical-200 rounded-md p-3 text-sm">
                    <div className="flex justify-between"><span>Cần thanh toán:</span><strong>{formatVND(order.total)}</strong></div>
                    <div className="flex justify-between"><span>Khách đưa:</span><strong>{formatVND(tenderedAmount)}</strong></div>
                    <div className="flex justify-between text-medical-700 font-bold">
                      <span>Tiền thừa trả khách:</span>
                      <span>{formatVND(changeAmount)}</span>
                    </div>
                  </div>
                )}
                {!canPay && tenderedAmount > 0 && (
                  <p className="text-sm text-red-600 mt-2">⚠️ Số tiền khách đưa không đủ (MSG21)</p>
                )}
              </>
            ) : (
              <Input
                label="Mã giao dịch (transaction ref)"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder={`Mã từ ${method === 'CARD' ? 'POS' : 'QR Provider'}`}
              />
            )}

            <Button
              onClick={handlePay}
              loading={submitting}
              disabled={!canPay}
              fullWidth
              className="mt-4"
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Xác nhận thanh toán
            </Button>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
