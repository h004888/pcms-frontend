// =====================================================
// PCMS - Favorites feature types
// =====================================================

import type { ProductSummary } from '@/types/shop/catalog';

export interface FavoriteProduct extends ProductSummary {
  addedAt: string; // ISO date
}

export interface FavoritesResponse {
  favorites: FavoriteProduct[];
  total: number;
}
