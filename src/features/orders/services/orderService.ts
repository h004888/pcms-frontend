// =====================================================
// PCMS - Order Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Order, CreateOrderRequest, Payment, CreatePaymentRequest } from '../types';

export async function fetchOrders(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.ORDERS}?${queryString}` : API_ENDPOINTS.ORDERS;
  const res = await apiClient.get<PageResponse<Order>>(url);
  return res.data;
}

export async function fetchOrderById(id: string) {
  const res = await apiClient.get<Order>(API_ENDPOINTS.ORDER_DETAIL(id));
  return res.data;
}

export async function createOrder(data: CreateOrderRequest) {
  const res = await apiClient.post<Order>(API_ENDPOINTS.ORDERS, data);
  return res.data;
}

export async function cancelOrder(id: string, actorId?: string) {
  const res = await apiClient.delete(`${API_ENDPOINTS.ORDER_DETAIL(id)}${actorId ? `?actorId=${actorId}` : ''}`);
  return res.data;
}

export async function markOrderAsPaid(id: string, actorId?: string) {
  const res = await apiClient.put(`${API_ENDPOINTS.ORDER_PAY(id)}${actorId ? `?actorId=${actorId}` : ''}`);
  return res.data;
}

export async function createPayment(data: CreatePaymentRequest) {
  const res = await apiClient.post<Payment>(API_ENDPOINTS.PAYMENTS, data);
  return res.data;
}

/**
 * Lấy payment theo orderId (dùng cho trang hoá đơn SCR-INVOICE).
 * Mỗi order PAID có đúng 1 payment tương ứng.
 */
export async function fetchPaymentByOrderId(orderId: string) {
  const res = await apiClient.get<Payment>(`${API_ENDPOINTS.PAYMENTS}?orderId=${orderId}&size=1`);
  const data = res.data as unknown as PageResponse<Payment> | Payment;
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as PageResponse<Payment>).data)) {
    return ((data as PageResponse<Payment>).data[0]) || null;
  }
  return (data as Payment) || null;
}
