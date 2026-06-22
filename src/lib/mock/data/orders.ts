// =====================================================
// PCMS - Mock Orders seed (20 records)
// Distributed across customers/branches, mix statuses
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_CUSTOMERS } from './customers';
import { SEED_BRANCHES } from './branches';
import { SEED_MEDICINES } from './medicines';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface MockOrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;       // ORD-YYYYMMDD-####
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  staffId: string;
  staffName: string;
  prescriptionId: string | null;
  couponCode: string | null;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  items: MockOrderItem[];
  createdAt: string;
  updatedAt: string;
}

const customers = SEED_CUSTOMERS.slice(0, 6);
const branches = SEED_BRANCHES;
const medicines = SEED_MEDICINES.slice(0, 8);
const staff = [
  { id: 'staff-001', name: 'Nguyễn Văn A' },
  { id: 'staff-002', name: 'Trần Thị B' },
  { id: 'staff-003', name: 'Lê Văn C' },
];

const NOW = new Date('2026-06-22T10:00:00Z');

function makeOrder(idx: number, status: OrderStatus, daysAgo: number): MockOrder {
  const customer = customers[idx % customers.length];
  const branch = branches[idx % branches.length];
  const s = staff[idx % staff.length];
  const itemCount = 1 + (idx % 3);
  const items: MockOrderItem[] = [];
  let subtotal = 0;
  for (let i = 0; i < itemCount; i++) {
    const m = medicines[(idx + i) % medicines.length];
    const qty = 1 + ((idx + i) % 3);
    const unitPrice = m.price;
    const discount = 0;
    const sub = unitPrice * qty - discount;
    items.push({
      id: uuid(),
      medicineId: m.id,
      medicineName: m.name,
      batchId: uuid(),
      quantity: qty,
      unitPrice,
      discount,
      subtotal: sub,
    });
    subtotal += sub;
  }
  const discount = idx % 4 === 0 ? 5000 : 0;
  const total = subtotal - discount;
  const date = new Date(NOW.getTime() - daysAgo * 24 * 3600 * 1000);

  return {
    id: uuid(),
    orderNumber: `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(idx + 1).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    branchId: branch.id,
    branchName: branch.name,
    staffId: s.id,
    staffName: s.name,
    prescriptionId: idx % 5 === 0 ? uuid() : null,
    couponCode: idx % 3 === 0 ? 'PCMS10' : null,
    subtotal,
    discount,
    total,
    status,
    items,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
}

const statuses: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'COMPLETED', 'CANCELLED'];

export const SEED_ORDERS: MockOrder[] = Array.from({ length: 20 }, (_, i) =>
  makeOrder(i, statuses[i % statuses.length], i)
);
