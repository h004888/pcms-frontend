// =====================================================
// PCMS - Points Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PointsResponse, RedeemRequest } from '../types';

export async function fetchPoints() {
  const res = await apiClient.get<PointsResponse>(API_ENDPOINTS.POINTS);
  return res.data;
}

export async function redeemReward(data: RedeemRequest) {
  const res = await apiClient.post(API_ENDPOINTS.POINTS_REDEEM, data);
  return res.data;
}
