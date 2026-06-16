// =====================================================
// PCMS - Dashboard Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Order, InventoryBatch, PageResponse } from '@/types';
import type { DashboardSummary } from '../types';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const [users, branches, medicines, customers, orders, lowStock] = await Promise.allSettled([
    apiClient.get<PageResponse<unknown>>(`${API_ENDPOINTS.USERS}?size=1`),
    apiClient.get<PageResponse<unknown>>(`${API_ENDPOINTS.BRANCHES}?size=1`),
    apiClient.get<PageResponse<unknown>>(`${API_ENDPOINTS.MEDICINES}?size=1`),
    apiClient.get<PageResponse<unknown>>(`${API_ENDPOINTS.CUSTOMERS}?size=1`),
    apiClient.get<PageResponse<Order>>(`${API_ENDPOINTS.ORDERS}?size=5&status=PAID`),
    apiClient.get<InventoryBatch[]>(API_ENDPOINTS.INVENTORY_LOW_STOCK),
  ]);

  return {
    users: users.status === 'fulfilled' ? (users.value.data.total || 0) : 0,
    branches: branches.status === 'fulfilled' ? (branches.value.data.total || 0) : 0,
    medicines: medicines.status === 'fulfilled' ? (medicines.value.data.total || 0) : 0,
    customers: customers.status === 'fulfilled' ? (customers.value.data.total || 0) : 0,
    todayOrders: orders.status === 'fulfilled' ? (orders.value.data.data?.length || 0) : 0,
    todayRevenue: orders.status === 'fulfilled'
      ? orders.value.data.data?.reduce((s: number, o: Order) => s + (o.total || 0), 0) || 0
      : 0,
    lowStock: lowStock.status === 'fulfilled' ? (lowStock.value.data?.length || 0) : 0,
    recentOrders: orders.status === 'fulfilled' ? (orders.value.data.data || []) : [],
    lowStockItems: lowStock.status === 'fulfilled' ? (lowStock.value.data || []) : [],
  };
}
