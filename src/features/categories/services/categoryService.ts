// =====================================================
// PCMS - Category Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Category } from '../types';

export async function fetchCategories(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.CATEGORIES}?${queryString}` : API_ENDPOINTS.CATEGORIES;
  const res = await apiClient.get<PageResponse<Category>>(url);
  return res.data;
}

export async function createCategory(data: Omit<Category, 'id' | 'createdAt'>) {
  const res = await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES, data);
  return res.data;
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const res = await apiClient.put<Category>(API_ENDPOINTS.CATEGORY_DETAIL(id), data);
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.CATEGORY_DETAIL(id));
  return res.data;
}
