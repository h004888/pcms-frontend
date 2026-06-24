// =====================================================
// PCMS - Stores Service (store locator)
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { StoreLocation } from '../types';

interface StoreLocatorApiResponse {
  data?: StoreLocation[];
  stores?: StoreLocation[];
  branches?: StoreLocation[];
  total?: number;
}

export async function fetchStores() {
  const res = await apiClient.get<StoreLocatorApiResponse | StoreLocation[]>(
    API_ENDPOINTS.STORE_LOCATOR
  );
  const body = res.data;
  if (Array.isArray(body)) return { stores: body, total: body.length };
  const stores = (body?.stores ?? body?.data ?? body?.branches ?? []) as StoreLocation[];
  return { stores, total: body?.total ?? stores.length };
}

export async function fetchStoreDetail(branchId: string) {
  const res = await apiClient.get<StoreLocation>(
    API_ENDPOINTS.STORE_DETAIL(branchId)
  );
  return res.data;
}