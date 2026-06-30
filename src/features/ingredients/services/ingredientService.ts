// =====================================================
// PCMS - Ingredient Service (SPRINT 2 - T08)
// =====================================================
// Backend endpoint: GET /shop/lookup/ingredient?q=<slug>&page=&size=
// Trả về PageResponse<Map<String, Object>> vì backend dùng generic map.
// Ở đây định nghĩa type Ingredient cho FE dùng.
//
// Note (Sprint 2 plan): backend chỉ có search-by-q, không có detail-by-slug
// trực tiếp. Workaround: search với slug = chính nó, lấy phần tử đầu.
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';

export interface Ingredient {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  benefits?: string[];
  sideEffects?: string[];
  // Generic fields - backend returns Map
  [key: string]: unknown;
}

interface PageResponse<T> {
  data?: T[];
  total?: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

/**
 * Search ingredients by query string.
 * Pass slug = chính nó to find a specific ingredient.
 */
export async function searchIngredients(
  q: string,
  page = 0,
  size = 20
): Promise<Ingredient[]> {
  const url = `${API_ENDPOINTS.SHOP_LOOKUP_INGREDIENT}?q=${encodeURIComponent(q)}&page=${page}&size=${size}`;
  const res = await apiClient.get<PageResponse<Ingredient>>(url);
  const body = res.data;
  return Array.isArray(body?.data) ? body.data : [];
}

/**
 * Get a single ingredient by slug. Throws if not found.
 * Workaround: search with slug as query, return first match.
 */
export async function getIngredientBySlug(slug: string): Promise<Ingredient> {
  const results = await searchIngredients(slug, 0, 1);
  if (!results.length) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }
  return results[0];
}