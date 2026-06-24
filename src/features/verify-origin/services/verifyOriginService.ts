// =====================================================
// PCMS - Verify Origin Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { VerifyOriginRequest, VerifyOriginResult } from '../types';

export async function scanVerifyOrigin(payload: VerifyOriginRequest) {
  const res = await apiClient.post<VerifyOriginResult>(
    API_ENDPOINTS.VERIFY_ORIGIN_SCAN,
    payload
  );
  return res.data;
}