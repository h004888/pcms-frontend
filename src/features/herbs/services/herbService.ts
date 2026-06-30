// =====================================================
// PCMS - Herb Service (SPRINT 2 - T09)
// =====================================================
// Backend endpoint: GET /shop/lookup/herb?q=<slug>&page=&size=
// Same shape as ingredient: PageResponse<Map<String, Object>>.
// Ở đây định nghĩa type Herb cho FE dùng.
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';

export interface Herb {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  traditionalUses?: string[];
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

export async function searchHerbs(
  q: string,
  page = 0,
  size = 20
): Promise<Herb[]> {
  const url = `${API_ENDPOINTS.SHOP_LOOKUP_HERB}?q=${encodeURIComponent(q)}&page=${page}&size=${size}`;
  const res = await apiClient.get<PageResponse<Herb>>(url);
  const body = res.data;
  return Array.isArray(body?.data) ? body.data : [];
}

export async function getHerbBySlug(slug: string): Promise<Herb> {
  const results = await searchHerbs(slug, 0, 1);
  if (!results.length) {
    throw new Error('HERB_NOT_FOUND');
  }
  return results[0];
}