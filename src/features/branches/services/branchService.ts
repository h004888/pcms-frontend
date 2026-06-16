// =====================================================
// PCMS - Branch Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Branch } from '../types';

export async function fetchBranches(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.BRANCHES}?${queryString}` : API_ENDPOINTS.BRANCHES;
  const res = await apiClient.get<PageResponse<Branch>>(url);
  return res.data;
}

export async function fetchBranchById(id: string) {
  const res = await apiClient.get<Branch>(API_ENDPOINTS.BRANCH_DETAIL(id));
  return res.data;
}

export async function createBranch(data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) {
  const res = await apiClient.post<Branch>(API_ENDPOINTS.BRANCHES, data);
  return res.data;
}

export async function updateBranch(id: string, data: Partial<Branch>) {
  const res = await apiClient.put<Branch>(API_ENDPOINTS.BRANCH_DETAIL(id), data);
  return res.data;
}

export async function deactivateBranch(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.BRANCH_DETAIL(id));
  return res.data;
}
