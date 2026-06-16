// =====================================================
// PCMS - Search Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Medicine } from '@/types';

export async function searchMedicines(query: string): Promise<Medicine[]> {
  const res = await apiClient.get<Medicine[]>(`${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
  return res.data;
}
