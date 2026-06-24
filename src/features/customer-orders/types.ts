// =====================================================
// PCMS - Customer Orders feature types
// =====================================================

import type { ProductSummary } from '@/types/shop/catalog';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  product: ProductSummary;
  qty: number;
  unitPrice: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface OrderAddress {
  name: string;
  phone: string;
  line: string;
  province: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
  timeline?: OrderTimelineEntry[];
  address?: OrderAddress;
  shippingMethod?: string;
  paymentMethod: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface OrderTrackResponse {
  order: Order;
  currentStep?: number;
}