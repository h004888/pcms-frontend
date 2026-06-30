// =====================================================
// PCMS - Category Service (P1.6)
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types';

/** Fetch categories (paginated + search) */
export async function fetchCategories(
  params: Record<string, unknown> = {}
): Promise<PageResponse<Category>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      searchParams.set(k, String(v));
    }
  });
  const qs = searchParams.toString();
  const url = qs
    ? `${API_ENDPOINTS.CATEGORIES}?${qs}`
    : API_ENDPOINTS.CATEGORIES;
  const res = await apiClient.get<PageResponse<Category>>(url);
  return res.data;
}

/** Fetch single category by id */
export async function fetchCategoryById(id: string): Promise<Category> {
  const res = await apiClient.get<Category>(
    API_ENDPOINTS.CATEGORY_DETAIL(id)
  );
  return res.data;
}

/** Fetch single category by slug */
export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiClient.get<Category>(
    API_ENDPOINTS.CATEGORY_BY_SLUG(slug)
  );
  return res.data;
}

/** Create new category */
export async function createCategory(
  data: CreateCategoryRequest
): Promise<Category> {
  const res = await apiClient.post<Category>(API_ENDPOINTS.CATEGORIES, data);
  return res.data;
}

/** Update category */
export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest
): Promise<Category> {
  const res = await apiClient.put<Category>(
    API_ENDPOINTS.CATEGORY_DETAIL(id),
    data
  );
  return res.data;
}

/** Delete category */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.CATEGORY_DETAIL(id));
}
