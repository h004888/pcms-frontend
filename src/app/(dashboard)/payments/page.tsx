// =====================================================
// PCMS - Payments List Page - UC07
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Badge } from '@/components/ui';
import { formatVND, formatDateTime, getStatusColor } from '@/lib/utils';
import { Payment, PaymentMethod, PaymentStatus } from '@/types';

const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt',
  CARD: 'Thẻ',
  QR: 'QR Code',
  LOYALTY_POINTS: 'Điểm thưởng',
  BANK_TRANSFER: 'Chuyển khoản',
  INSTALLMENT: 'Trả góp',
};

const METHOD_TONES: Record<PaymentMethod, string> = {
  CASH: 'bg-green-50 text-green-700 border-green-200',
  CARD: 'bg-blue-50 text-blue-700 border-blue-200',
  QR: 'bg-purple-50 text-purple-700 border-purple-200',
  LOYALTY_POINTS: 'bg-amber-50 text-amber-700 border-amber-200',
  BANK_TRANSFER: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  INSTALLMENT: 'bg-pink-50 text-pink-700 border-pink-200',
};

export default function PaymentsPage() {
  const columns: Column<Payment>[] = [
    {
      key: 'invoiceNumber',
      header: 'Mã HĐ',
      width: '180px',
      render: (p) => <span className="font-mono text-xs text-ink-700">{p.invoiceNumber}</span>,
    },
    {
      key: 'orderNumber',
      header: 'Đơn hàng',
      width: '180px',
      render: (p) => <span className="font-mono text-xs text-ink-500">{p.orderNumber}</span>,
    },
    {
      key: 'paymentMethod',
      header: 'Phương thức',
      width: '140px',
      render: (p) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${METHOD_TONES[p.paymentMethod]}`}>
          {METHOD_LABELS[p.paymentMethod] || p.paymentMethod}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Số tiền',
      align: 'right',
      width: '140px',
      render: (p) => <span className="font-semibold tabular-nums">{formatVND(p.amount)}</span>,
    },
    {
      key: 'tenderedAmount',
      header: 'Khách đưa',
      align: 'right',
      width: '140px',
      render: (p) => (
        <span className="text-ink-600 tabular-nums">
          {p.tenderedAmount ? formatVND(p.tenderedAmount) : '—'}
        </span>
      ),
    },
    {
      key: 'changeAmount',
      header: 'Tiền thừa',
      align: 'right',
      width: '120px',
      render: (p) => (
        <span className="text-ink-500 tabular-nums">
          {p.changeAmount ? formatVND(p.changeAmount) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (p) => <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(p.status)}`}>{p.status}</span>,
    },
    {
      key: 'createdAt',
      header: 'Thời gian',
      width: '160px',
      render: (p) => <span className="text-xs text-ink-500">{formatDateTime(p.createdAt)}</span>,
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<Payment>
        title="Quản lý thanh toán"
        subtitle="UC07 - Theo dõi giao dịch thanh toán từ khách hàng"
        endpoint="/payments"
        columns={columns}
        searchPlaceholder="Tìm theo mã HĐ, mã đơn, mã giao dịch..."
        canAdd={false}
      />
    </DashboardLayout>
  );
}
