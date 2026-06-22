// =====================================================
// PCMS - Order & Payment feature types (UC06, UC07)
// =====================================================

import type { UUID, ISODate, OrderStatus, PaymentMethod, PaymentStatus } from './common';

export interface OrderItem {
  id?: UUID;
  medicineId: UUID;
  medicineName?: string;
  batchId?: UUID;
  qty: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  customerId: UUID;
  customerName?: string;
  branchId: UUID;
  branchName?: string;
  staffId?: UUID;
  staffName?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  prescriptionId?: UUID;
  couponCode?: string;
  items: OrderItem[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateOrderRequest = {
  customerId: UUID;
  branchId: UUID;
  staffId?: UUID;
  items: { medicineId: UUID; quantity: number }[];
  couponCode?: string;
};

export interface Payment {
  id: UUID;
  orderId: UUID;
  orderNumber?: string;
  invoiceNumber: string;
  paymentMethod: PaymentMethod;
  amount: number;
  refundedAmount?: number;
  tenderedAmount?: number;
  changeAmount?: number;
  transactionRef?: string;
  status: PaymentStatus;
  cashierId?: UUID;
  cashierName?: string;
  staffId?: UUID;
  createdAt: ISODate;
}

export type CreatePaymentRequest = {
  orderId: UUID;
  paymentMethod: PaymentMethod;
  amount: number;
  tenderedAmount?: number;
  staffId: UUID;
  transactionRef?: string;
};
