// =====================================================
// PCMS - Orders & Payments feature types
// =====================================================

import type { UUID, ISODate, OrderStatus, PaymentMethod, PaymentStatus } from '@/types/common';

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
  branchId: UUID;
  staffId?: UUID;
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
  invoiceNumber: string;
  paymentMethod: PaymentMethod;
  amount: number;
  tenderedAmount?: number;
  changeAmount?: number;
  transactionRef?: string;
  status: PaymentStatus;
  staffId: UUID;
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
