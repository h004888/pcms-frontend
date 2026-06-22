// =====================================================
// PCMS - Supplier Service (P1.9)
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../types';

/** Fetch suppliers (paginated + search + filter) */
export async function fetchSuppliers(
  params: Record<string, unknown> = {}
): Promise<PageResponse<Supplier>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      searchParams.set(k, String(v));
    }
  });
  const qs = searchParams.toString();
  const url = qs
    ? `${API_ENDPOINTS.SUPPLIERS}?${qs}`
    : API_ENDPOINTS.SUPPLIERS;
  const res = await apiClient.get<PageResponse<Supplier>>(url);
  return res.data;
}

/** Fetch single supplier by id */
export async function fetchSupplierById(id: string): Promise<Supplier> {
  const res = await apiClient.get<Supplier>(API_ENDPOINTS.SUPPLIER_DETAIL(id));
  return res.data;
}

/** Create new supplier */
export async function createSupplier(
  data: CreateSupplierRequest
): Promise<Supplier> {
  const res = await apiClient.post<Supplier>(API_ENDPOINTS.SUPPLIERS, data);
  return res.data;
}

/** Update supplier */
export async function updateSupplier(
  id: string,
  data: UpdateSupplierRequest
): Promise<Supplier> {
  const res = await apiClient.put<Supplier>(
    API_ENDPOINTS.SUPPLIER_DETAIL(id),
    data
  );
  return res.data;
}

/** Deactivate supplier (soft delete) */
export async function deleteSupplier(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.SUPPLIER_DETAIL(id));
}