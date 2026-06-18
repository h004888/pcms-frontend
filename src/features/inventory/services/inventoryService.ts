// =====================================================
// PCMS - Inventory Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type {
  InventoryBatch,
  ImportStockRequest,
  ExportStockRequest,
  TransferStockRequest,
  TransferStockResponse,
} from '../types';

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

/**
 * Xuất kho (SCR-INV-EXPORT).
 * BR05: FIFO — backend tự consume lô hết hạn sớm nhất.
 * Lý do xuất bắt buộc: SALE / DAMAGED / EXPIRED / INTERNAL_USE / RETURN.
 */
export async function exportStock(data: ExportStockRequest) {
  const res = await apiClient.post(API_ENDPOINTS.INVENTORY_EXPORT, data);
  return res.data;
}

/**
 * Chuyển kho giữa chi nhánh (SCR-INV-TRANSFER).
 * Trừ tồn chi nhánh nguồn + cộng tồn chi nhánh đích theo cùng batch.
 */
export async function transferStock(data: TransferStockRequest) {
  const res = await apiClient.post<TransferStockResponse>(API_ENDPOINTS.INVENTORY_TRANSFER, data);
  return res.data;
}
