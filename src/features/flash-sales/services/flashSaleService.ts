// =====================================================
// PCMS - Flash Sales Service (ecom-ops-service)
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { FlashSale } from '../types';

export async function fetchFlashSalesActive() {
  const res = await apiClient.get<FlashSale[]>(
    API_ENDPOINTS.FLASH_SALES_ACTIVE
  );
  return res.data ?? [];
}

export async function fetchFlashSaleDetail(id: string) {
  const res = await apiClient.get<FlashSale>(
    API_ENDPOINTS.FLASH_SALE_DETAIL(id)
  );
  return res.data;
}