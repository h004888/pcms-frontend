// =====================================================
// PCMS - Shop Service
// SPRINT 1 - T05: thêm getHomePage() trỏ vào /shop/home
//
// Mapping:
// - Backend trả ShopHomeData { bestsellers: [...] } với shape rỗng
//   (id/name/price/oldPrice/imageUrl/slug).
// - ProductSummary của @/types/shop/catalog đòi nhiều field hơn (brand,
//   country, rating, ...). Ở đây throw nếu rỗng (fail-loud mode).
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { ShopHomeData, ShopSearchResult } from '../types';

export async function fetchShopHome() {
  const res = await apiClient.get<ShopHomeData>(API_ENDPOINTS.SHOP_HOME);
  return res.data;
}

/**
 * T05 — Server-side helper cho ShopHomeBestseller.
 * Trả về danh sách bestSellers từ /shop/home. Throw nếu rỗng (mode fail-loud).
 */
export async function getHomePage() {
  const home = await fetchShopHome();
  if (!home.bestsellers?.length) {
    throw new Error('SHOP_HOME_BESTSELLERS_EMPTY');
  }
  return home.bestsellers;
}

export async function fetchShopPDP(id: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_PDP(id));
  return res.data;
}

export async function fetchShopPDPBySlug(slug: string) {
  const res = await apiClient.get(API_ENDPOINTS.SHOP_PDP_SLUG(slug));
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