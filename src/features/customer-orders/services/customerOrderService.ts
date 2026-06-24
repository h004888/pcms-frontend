// =====================================================
// PCMS - Customer Orders Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Order, OrderTrackResponse, OrdersResponse } from '../types';

export async function fetchCustomerOrders() {
  const res = await apiClient.get<OrdersResponse | Order[]>(
    API_ENDPOINTS.ORDERS
  );
  const body = res.data;
  if (Array.isArray(body)) return { orders: body, total: body.length };
  return body ?? { orders: [], total: 0 };
}

export async function fetchCustomerOrderHistory() {
  const res = await apiClient.get<OrdersResponse | Order[]>(
    API_ENDPOINTS.ORDER_HISTORY
  );
  const body = res.data;
  if (Array.isArray(body)) return { orders: body, total: body.length };
  return body ?? { orders: [], total: 0 };
}

export async function fetchOrderById(id: string) {
  const res = await apiClient.get<Order>(API_ENDPOINTS.ORDER_DETAIL(id));
  return res.data;
}

export async function fetchOrderTrack(id: string) {
  const res = await apiClient.get<OrderTrackResponse | Order>(
    API_ENDPOINTS.ORDER_TRACK(id)
  );
  const body = res.data as OrderTrackResponse | Order;
  if ('order' in body) return body;
  return { order: body };
}

export async function cancelOrder(id: string) {
  await apiClient.delete(API_ENDPOINTS.ORDER_DETAIL(id));
}