// =====================================================
// PCMS - Prescription Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Prescription } from '../types';

export async function fetchPrescriptions(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.PRESCRIPTIONS}?${queryString}` : API_ENDPOINTS.PRESCRIPTIONS;
  const res = await apiClient.get<PageResponse<Prescription>>(url);
  return res.data;
}

export async function createPrescription(data: Omit<Prescription, 'id' | 'code' | 'signatureHash' | 'status' | 'issuedAt' | 'createdAt'>) {
  const res = await apiClient.post<Prescription>(API_ENDPOINTS.PRESCRIPTIONS, data);
  return res.data;
}
