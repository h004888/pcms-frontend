// =====================================================
// PCMS - Report Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';

export interface RevenueRow {
  date: string;
  orders: number;
  gross: number;
  discount: number;
  net: number;
}

export interface RevenueReport {
  totalOrders: number;
  rows: RevenueRow[];
}

export interface InventoryReport {
  totalBatches: number;
  lowStockCount: number;
}

export async function fetchRevenueReport(params: { from: string; to: string; groupBy: string }) {
  const res = await apiClient.get<RevenueReport>(`${API_ENDPOINTS.REPORT_REVENUE}?from=${params.from}&to=${params.to}&groupBy=${params.groupBy}`);
  return res.data;
}

export async function fetchInventoryReport() {
  const res = await apiClient.get<InventoryReport>(API_ENDPOINTS.REPORT_INVENTORY);
  return res.data;
}
