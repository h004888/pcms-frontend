// =====================================================
// PCMS - Search feature types
// =====================================================

import type { Medicine } from '@/types';
export type { Medicine };

export interface SearchResult {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
}
