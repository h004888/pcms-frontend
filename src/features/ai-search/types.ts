// =====================================================
// PCMS - AI Semantic Search feature types
// =====================================================

import type { ProductSummary } from '@/types/shop/catalog';

export interface SemanticSearchResult {
  symptom: string;
  severity: 'self' | 'consult' | 'urgent';
  drugs: ProductSummary[];
  advice: string;
}

export interface SemanticSearchRequest {
  query: string;
}

export interface SemanticSearchResponse {
  symptom: string;
  severity: 'self' | 'consult' | 'urgent';
  drugs: ProductSummary[];
  advice: string;
}
