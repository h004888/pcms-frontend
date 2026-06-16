// =====================================================
// PCMS - Supplier Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Supplier } from '../types';

export async function fetchSuppliers(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.SUPPLIERS}?${queryString}` : API_ENDPOINTS.SUPPLIERS;
  const res = await apiClient.get<PageResponse<Supplier>>(url);
  return res.data;
}

export async function createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) {
  const res = await apiClient.post<Supplier>(API_ENDPOINTS.SUPPLIERS, data);
  return res.data;
}

export async function updateSupplier(id: string, data: Partial<Supplier>) {
  const res = await apiClient.put<Supplier>(API_ENDPOINTS.SUPPLIER_DETAIL(id), data);
  return res.data;
}

export async function deactivateSupplier(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.SUPPLIER_DETAIL(id));
  return res.data;
}
