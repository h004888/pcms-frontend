// =====================================================
// PCMS - AI Chat Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { AIChatRequest, AIChatResponse } from '../types';

export async function sendChatMessage(data: AIChatRequest) {
  const res = await apiClient.post<AIChatResponse>(API_ENDPOINTS.AI_CHAT, data);
  return res.data;
}
