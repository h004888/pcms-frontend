// =====================================================
// PCMS - Shop Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { ShopHomeData, ShopSearchResult } from '../types';

export async function fetchShopHome() {
  const res = await apiClient.get<ShopHomeData>(API_ENDPOINTS.SHOP_HOME);
  return res.data;
}

export async function fetchShopPDP(id: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_PDP(id));
  return res.data;
}

interface PageResponse<T> {
  data?: T[];
  products?: T[];
  total?: number;
  totalPages?: number;
}

export async function searchShop(query: string, params?: Record<string, unknown>) {
  const res = await apiClient.get<PageResponse<ShopSearchResult['products'][number]>>(
    API_ENDPOINTS.SHOP_SEARCH,
    { params: { q: query, ...params } }
  );
  const body = res.data;
  // Handle both formats: Page wrapper {data: []} or direct {products: []}
  const products = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body?.products)
      ? body.products
      : [];
  return { products, total: body?.total ?? products.length };
}

export async function lookupDrug(query: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_LOOKUP_DRUG, {
    params: { q: query },
  });
  return res.data;
}

export async function lookupIngredient(query: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_LOOKUP_INGREDIENT, {
    params: { q: query },
  });
  return res.data;
}

export async function lookupHerb(query: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_LOOKUP_HERB, {
    params: { q: query },
  });
  return res.data;
}