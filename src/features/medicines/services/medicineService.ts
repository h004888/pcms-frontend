// =====================================================
// PCMS - Medicine Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Medicine, Category } from '../types';

// === Medicines ===
export async function fetchMedicines(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.MEDICINES}?${queryString}` : API_ENDPOINTS.MEDICINES;
  const res = await apiClient.get<PageResponse<Medicine>>(url);
  return res.data;
}

export async function fetchMedicineById(id: string) {
  const res = await apiClient.get<Medicine>(API_ENDPOINTS.MEDICINE_DETAIL(id));
  return res.data;
}

export async function fetchMedicineBySlug(slug: string): Promise<Medicine> {
  const res = await apiClient.get<Medicine>(
    API_ENDPOINTS.MEDICINE_BY_SLUG(slug)
  );
  return res.data;
}

export async function createMedicine(data: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) {
  const res = await apiClient.post<Medicine>(API_ENDPOINTS.MEDICINES, data);
  return res.data;
}

export async function updateMedicine(id: string, data: Partial<Medicine>) {
  const res = await apiClient.put<Medicine>(API_ENDPOINTS.MEDICINE_DETAIL(id), data);
  return res.data;
}

export async function deactivateMedicine(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.MEDICINE_DETAIL(id));
  return res.data;
}

// === Categories ===
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

export async function fetchCategoryBySlug(slug: string) {
  const res = await apiClient.get<Category>(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
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
