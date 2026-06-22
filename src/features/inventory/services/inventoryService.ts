// =====================================================
// PCMS - Inventory Service (P1.10)
// UC05 - Quản lý tồn kho theo lô + chi nhánh
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type {
  InventoryBatch,
  CreateInventoryBatchRequest,
  UpdateInventoryBatchRequest,
} from '../types';

/** Fetch inventory batches (paginated + search + filter) */
export async function fetchInventory(
  params: Record<string, unknown> = {}
): Promise<PageResponse<InventoryBatch>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      searchParams.set(k, String(v));
    }
  });
  const qs = searchParams.toString();
  const url = qs
    ? `${API_ENDPOINTS.INVENTORY}?${qs}`
    : API_ENDPOINTS.INVENTORY;
  const res = await apiClient.get<PageResponse<InventoryBatch>>(url);
  return res.data;
}

/** Fetch single inventory batch by id */
export async function fetchInventoryById(
  id: string
): Promise<InventoryBatch> {
  const res = await apiClient.get<InventoryBatch>(
    API_ENDPOINTS.INVENTORY_DETAIL(id)
  );
  return res.data;
}

/** Create new inventory batch */
export async function createInventory(
  data: CreateInventoryBatchRequest
): Promise<InventoryBatch> {
  const res = await apiClient.post<InventoryBatch>(
    API_ENDPOINTS.INVENTORY,
    data
  );
  return res.data;
}

/** Update inventory batch */
export async function updateInventory(
  id: string,
  data: UpdateInventoryBatchRequest
): Promise<InventoryBatch> {
  const res = await apiClient.put<InventoryBatch>(
    API_ENDPOINTS.INVENTORY_DETAIL(id),
    data
  );
  return res.data;
}

/** Delete inventory batch */
export async function deleteInventory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.INVENTORY_DETAIL(id));
}

/** Fetch low-stock batches (array, không phân trang) */
export async function fetchLowStock(
  params: Record<string, unknown> = {}
): Promise<InventoryBatch[]> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      searchParams.set(k, String(v));
    }
  });
  const qs = searchParams.toString();
  const url = qs
    ? `${API_ENDPOINTS.INVENTORY_LOW_STOCK}?${qs}`
    : API_ENDPOINTS.INVENTORY_LOW_STOCK;
  const res = await apiClient.get<InventoryBatch[]>(url);
  return res.data;
}