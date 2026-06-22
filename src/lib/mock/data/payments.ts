// =====================================================
// PCMS - Mock Payments seed (15 records)
// One payment per PAID/COMPLETED order
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_ORDERS } from './orders';

export type PaymentMethod = 'CASH' | 'CARD' | 'QR' | 'LOYALTY_POINTS' | 'BANK_TRANSFER' | 'INSTALLMENT';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface MockPayment {
  id: string;
  orderId: string;
  orderNumber: string;
  invoiceNumber: string;     // INV-YYYYMMDD-####
  paymentMethod: PaymentMethod;
  amount: number;
  refundedAmount: number;
  tenderedAmount: number;    // cash given by customer
  changeAmount: number;      // change returned
  transactionRef: string;    // bank ref or QR ref
  status: PaymentStatus;
  cashierId: string;
  cashierName: string;
  createdAt: string;
}

const paidOrders = SEED_ORDERS.filter((o) => o.status === 'PAID' || o.status === 'COMPLETED');
const methods: PaymentMethod[] = ['CASH', 'CARD', 'QR', 'BANK_TRANSFER'];
const cashiers = [
  { id: 'cashier-001', name: 'Phạm Thị D' },
  { id: 'cashier-002', name: 'Hoàng Văn E' },
];

export const SEED_PAYMENTS: MockPayment[] = paidOrders.map((o, i) => {
  const method = methods[i % methods.length];
  const cashier = cashiers[i % cashiers.length];
  const isCash = method === 'CASH';
  return {
    id: uuid(),
    orderId: o.id,
    orderNumber: o.orderNumber,
    invoiceNumber: o.orderNumber.replace('ORD-', 'INV-'),
    paymentMethod: method,
    amount: o.total,
    refundedAmount: 0,
    tenderedAmount: isCash ? Math.ceil(o.total / 10000) * 10000 : o.total,
    changeAmount: isCash ? Math.ceil(o.total / 10000) * 10000 - o.total : 0,
    transactionRef: method === 'CASH' ? '' : `TXN${Date.now() + i}`,
    status: 'SUCCESS',
    cashierId: cashier.id,
    cashierName: cashier.name,
    createdAt: o.createdAt,
  };
});
