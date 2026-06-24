// =====================================================
// PCMS - Wallet Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { HealthWallet, UpdateWalletRequest } from '../types';

export async function fetchWallet() {
  const res = await apiClient.get<HealthWallet>(API_ENDPOINTS.WALLET);
  return res.data;
}

export async function updateWallet(data: UpdateWalletRequest) {
  const res = await apiClient.put<HealthWallet>(API_ENDPOINTS.WALLET, data);
  return res.data;
}
