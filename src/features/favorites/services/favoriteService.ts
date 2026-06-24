// =====================================================
// PCMS - Favorites Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { FavoritesResponse } from '../types';

export async function fetchFavorites() {
  const res = await apiClient.get<FavoritesResponse>(API_ENDPOINTS.FAVORITES);
  return res.data;
}

export async function addFavorite(productId: string) {
  const res = await apiClient.post(API_ENDPOINTS.FAVORITES, { productId });
  return res.data;
}

export async function removeFavorite(productId: string) {
  const res = await apiClient.delete(`${API_ENDPOINTS.FAVORITES}/${productId}`);
  return res.data;
}
