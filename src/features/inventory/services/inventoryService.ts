// =====================================================
// PCMS - Inventory Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { InventoryBatch, ImportStockRequest } from '../types';

export async function fetchInventory(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.INVENTORY}?${queryString}` : API_ENDPOINTS.INVENTORY;
  const res = await apiClient.get<PageResponse<InventoryBatch>>(url);
  return res.data;
}

export async function fetchLowStock() {
  const res = await apiClient.get<InventoryBatch[]>(API_ENDPOINTS.INVENTORY_LOW_STOCK);
  return res.data;
}

export async function importStock(data: ImportStockRequest) {
  const res = await apiClient.post(API_ENDPOINTS.INVENTORY_IMPORT, data);
  return res.data;
}

export async function exportStock(data: ImportStockRequest) {
  const res = await apiClient.post(API_ENDPOINTS.INVENTORY_EXPORT, data);
  return res.data;
}
