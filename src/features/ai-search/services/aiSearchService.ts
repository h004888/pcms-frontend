// =====================================================
// PCMS - AI Semantic Search Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { SemanticSearchResponse } from '../types';

export async function semanticSearch(query: string) {
  const res = await apiClient.post<SemanticSearchResponse>(API_ENDPOINTS.AI_SEMANTIC_SEARCH, { query });
  return res.data;
}
