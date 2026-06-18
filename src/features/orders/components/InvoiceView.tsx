// =====================================================
// PCMS - Invoice View (SCR-INVOICE · UC07)
// Hóa đơn bán hàng — template in chuẩn, có @media print.
// Dùng cho cả 2 vai trò: nhân viên in tại quầy & khách hàng
// tra cứu lịch sử.
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Printer, ArrowLeft, FileText, AlertTriangle, Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/Layout';
import { Card, Button, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatVND, formatDateTime, PAYMENT_METHOD_LABELS } from '@/lib/utils';
import { fetchOrderById, fetchPaymentByOrderId } from '../services/orderService';
import type { Order, Payment, Customer, Branch } from '@/types';

export function InvoiceView() {
  const params = useParams();
  const router = useRouter();
  const { state } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ord = await fetchOrderById(orderId);
        setOrder(ord);

        // Phải PAID mới có hóa đơn
        if (ord.status !== 'PAID') {
          setNotFound(true);
          return;
        }

        const [pay, branchRes] = await Promise.all([
          fetchPaymentByOrderId(orderId).catch(() => null),
          apiClient.get<Branch>(`/branches/${ord.branchId}`).then((r) => r.data).catch(() => null),
        ]);
        setPayment(pay);
        setBranch(branchRes);

        if (ord.customerId && ord.customerId !== 'GUEST') {
          try {
            const c = await apiClient.get<Customer>(`/customers/${ord.customerId}`);
            setCustomer(c.data);
          } catch {
            // ignore — không bắt buộc
          }
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    // Print-to-PDF: mở dialog in, người dùng chọn "Lưu thành PDF"
    handlePrint();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" />
      </DashboardLayout>
    );
  }

  if (notFound || !order) {
    return (
      <DashboardLayout>
        <EmptyState
          title="Chưa có hóa đơn"
          description="Hóa đơn chỉ được tạo sau khi đơn hàng được thanh toán."
        />
      </DashboardLayout>
    );
  }

  const vatRate = 0.08; // VAT 8% cho dược phẩm (theo quy định VN)
  const vatAmount = Math.round((order.total * vatRate) / (1 + vatRate));
  const subTotalBeforeVat = order.total - vatAmount;

  return (
    <DashboardLayout>
      {/* === Action bar (ẩn khi in) === */}
      <div className="invoice-no-print flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Tải PDF
          </Button>
          <Button onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            In hóa đơn
          </Button>
        </div>
      </div>

      {/* === Status alert === */}
      <div className="invoice-no-print mb-4">
        <Card>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-ink-500" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">
                Hóa đơn {payment?.invoiceNumber || order.orderNumber}
              </p>
              <p className="text-xs text-ink-500">
                Phát hành {formatDateTime(payment?.createdAt || order.createdAt)} · NV: {state.user?.fullName || '—'}
              </p>
            </div>
            <Badge variant="success">Đã thanh toán</Badge>
          </div>
        </Card>
      </div>

      {/* === Invoice template === */}
      <article className="bg-white border border-ink-200 rounded-lg p-8 max-w-3xl mx-auto print:border-0 print:p-0 print:max-w-none">
        {/* Header */}
        <header className="flex items-start justify-between pb-6 border-b border-ink-200">
          <div>
            <h1 className="text-xl font-bold text-ink-900">PHARMACY CHAIN MANAGEMENT</h1>
            <p className="text-sm text-ink-600 mt-0.5">Hệ thống nhà thuốc PCMS</p>
            {branch ? (
              <div className="mt-2 text-xs text-ink-500 space-y-0.5">
                <p><strong>Chi nhánh:</strong> {branch.name} ({branch.code})</p>
                {branch.address && <p>{branch.address}</p>}
                {branch.phone && <p>ĐT: {branch.phone}</p>}
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink-500">Chi nhánh: {order.branchId}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-ink-900">HÓA ĐƠN BÁN HÀNG</h2>
            <p className="text-sm text-ink-500 mt-1">VAT Invoice</p>
            <p className="font-mono text-sm text-ink-900 mt-2">
              {payment?.invoiceNumber || `ORD-${order.orderNumber}`}
            </p>
            <p className="text-xs text-ink-500">
              Ngày: {formatDateTime(payment?.createdAt || order.createdAt)}
            </p>
          </div>
        </header>

        {/* Customer / payment info */}
        <section className="grid grid-cols-2 gap-6 py-5 border-b border-ink-200 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Khách hàng</p>
            {customer ? (
              <>
                <p className="font-semibold text-ink-900 mt-1">{customer.name}</p>
                {customer.phone && <p className="text-ink-600">SĐT: {customer.phone}</p>}
                {customer.email && <p className="text-ink-600">Email: {customer.email}</p>}
                {customer.points !== undefined && (
                  <p className="text-accent-700 mt-1">Điểm thưởng: {customer.points}</p>
                )}
              </>
            ) : (
              <p className="text-ink-600 mt-1">Khách lẻ (không đăng ký)</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-500 font-semibold">Thanh toán</p>
            <p className="mt-1">
              <strong>Phương thức:</strong>{' '}
              {payment ? PAYMENT_METHOD_LABELS[payment.paymentMethod] : '—'}
            </p>
            {payment?.tenderedAmount !== undefined && (
              <p>
                <strong>Khách đưa:</strong> {formatVND(payment.tenderedAmount)}
              </p>
            )}
            {payment?.changeAmount !== undefined && payment.changeAmount > 0 && (
              <p>
                <strong>Tiền thừa:</strong> {formatVND(payment.changeAmount)}
              </p>
            )}
            {payment?.transactionRef && (
              <p className="font-mono text-xs">
                <strong>Mã GD:</strong> {payment.transactionRef}
              </p>
            )}
          </div>
        </section>

        {/* Line items */}
        <section className="py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-ink-500 border-b border-ink-300">
                <th className="text-left py-2 font-semibold">STT</th>
                <th className="text-left py-2 font-semibold">Sản phẩm</th>
                <th className="text-center py-2 font-semibold w-20">SL</th>
                <th className="text-right py-2 font-semibold w-32">Đơn giá</th>
                <th className="text-right py-2 font-semibold w-32">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {order.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-2.5 text-ink-500">{idx + 1}</td>
                  <td className="py-2.5">
                    <p className="font-medium text-ink-900">{item.medicineName || item.medicineId}</p>
                    {item.batchId && (
                      <p className="text-xs text-ink-500 font-mono">Lô: {item.batchId.slice(0, 8)}…</p>
                    )}
                  </td>
                  <td className="py-2.5 text-center font-mono">{item.qty}</td>
                  <td className="py-2.5 text-right font-mono">{formatVND(item.unitPrice)}</td>
                  <td className="py-2.5 text-right font-mono font-semibold">{formatVND(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Totals */}
        <section className="border-t border-ink-300 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">Tạm tính (chưa VAT):</span>
            <span className="font-mono">{formatVND(subTotalBeforeVat)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">VAT 8%:</span>
            <span className="font-mono">{formatVND(vatAmount)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Giảm giá:</span>
              <span className="font-mono">-{formatVND(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t border-ink-300 pt-2 mt-2">
            <span>TỔNG THANH TOÁN:</span>
            <span className="font-mono text-accent-700">{formatVND(order.total)}</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-4 border-t border-ink-200 text-xs text-ink-500 space-y-1.5">
          <p className="text-center font-medium text-ink-700">Cảm ơn quý khách — Hẹn gặp lại!</p>
          <p className="text-center">
            Hóa đơn này được tạo tự động bởi hệ thống PCMS. Vui lòng giữ lại để đối chiếu khi cần.
          </p>
          {order.prescriptionId && (
            <p className="text-center italic">
              Đơn hàng kèm đơn thuốc theo toa — không thuộc trường hợp hoàn trả thông thường.
            </p>
          )}
        </footer>
      </article>

      {/* === Print styles === */}
      <style jsx global>{`
        @media print {
          .invoice-no-print { display: none !important; }
          aside, header.app-header, [role='banner'] { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; overflow: visible !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      {/* Help note (print-hidden) */}
      {order.prescriptionId && (
        <div className="invoice-no-print mt-4">
          <Card>
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-warning-700 mt-0.5" aria-hidden="true" />
              <p className="text-ink-600">
                Đơn hàng này kèm đơn thuốc. Theo quy định, thuốc kê đơn không được hoàn trả khi đã xuất hóa đơn.
              </p>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
