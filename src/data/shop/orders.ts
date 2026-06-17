// =====================================================
// Mock orders data for Phase 2 B2C
// Items populate thật từ PRODUCTS (không dùng {} as ProductSummary)
// Replace với real B2B API khi backend ready
// =====================================================

import type { ProductDetail } from '@/types/shop/catalog';
import { PRODUCTS } from '@/data/shop/catalog';
import { stripToSummary } from './_strip-to-summary';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  product: ReturnType<typeof stripToSummary>;
  qty: number;
  unitPrice: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string; // ISO
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
  timeline: OrderTimelineEntry[];
  address: { name: string; phone: string; line: string; province: string };
  shippingMethod: string;
  paymentMethod: string;
}

const NOW = Date.now();
const day = (n: number) => new Date(NOW - n * 86400000).toISOString();

function buildItem(productId: string, qty: number, unitPrice: number): OrderItem {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) throw new Error(`Mock order references unknown product ${productId}`);
  return { productId, product: stripToSummary(p), qty, unitPrice };
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    code: 'ORD-20260615-0001',
    status: 'SHIPPING',
    createdAt: day(2),
    total: 248000,
    shippingFee: 30000,
    address: { name: 'Nguyễn Văn A', phone: '0901234567', line: '12 Lê Lợi', province: 'TP.HCM' },
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    items: [buildItem('prod-1', 2, 109000)],
    timeline: [
      { status: 'PENDING', at: day(2), note: 'Đơn hàng được tạo' },
      { status: 'CONFIRMED', at: day(1), note: 'Đã xác nhận' },
      { status: 'SHIPPING', at: day(0), note: 'Đang giao hàng' },
    ],
  },
  {
    id: 'ord-2',
    code: 'ORD-20260610-0042',
    status: 'DELIVERED',
    createdAt: day(7),
    total: 405000,
    shippingFee: 0,
    address: { name: 'Trần Thị B', phone: '0912345678', line: '30 Nguyễn Huệ', province: 'TP.HCM' },
    shippingMethod: 'express',
    paymentMethod: 'qr',
    items: [buildItem('prod-4', 1, 320000), buildItem('prod-3', 1, 85000)],
    timeline: [
      { status: 'PENDING', at: day(7) },
      { status: 'CONFIRMED', at: day(6) },
      { status: 'SHIPPING', at: day(5) },
      { status: 'DELIVERED', at: day(4), note: 'Giao thành công' },
    ],
  },
  {
    id: 'ord-3',
    code: 'ORD-20260601-0017',
    status: 'CANCELLED',
    createdAt: day(15),
    total: 80000,
    shippingFee: 30000,
    address: { name: 'Lê Văn C', phone: '0923456789', line: '55 Trần Hưng Đạo', province: 'Hà Nội' },
    shippingMethod: 'standard',
    paymentMethod: 'card',
    items: [buildItem('prod-2', 1, 50000)],
    timeline: [
      { status: 'PENDING', at: day(15) },
      { status: 'CANCELLED', at: day(14), note: 'Đã hủy theo yêu cầu' },
    ],
  },
];

export const STATUS_LABELS: Record<OrderStatus, { label: string; class: string; icon: 'clock' | 'check' | 'truck' | 'package' | 'x' }> = {
  PENDING: { label: 'Chờ xác nhận', class: 'bg-warning-50 text-warning-700', icon: 'clock' },
  CONFIRMED: { label: 'Đã xác nhận', class: 'bg-info-50 text-info-700', icon: 'check' },
  SHIPPING: { label: 'Đang giao', class: 'bg-accent-50 text-accent-700', icon: 'truck' },
  DELIVERED: { label: 'Hoàn tất', class: 'bg-success-50 text-success-700', icon: 'check' },
  CANCELLED: { label: 'Đã hủy', class: 'bg-danger-50 text-danger-700', icon: 'x' },
};

export const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Tiền mặt (COD)',
  card: 'Thẻ tín dụng/ghi nợ',
  qr: 'QR Pay (VietQR, MoMo)',
  wallet: 'Ví điện tử',
};

export const SHIPPING_LABELS: Record<string, string> = {
  standard: 'Tiêu chuẩn (2–3 ngày)',
  express: 'Nhanh (trong ngày)',
  pickup: 'Nhận tại nhà thuốc',
};
