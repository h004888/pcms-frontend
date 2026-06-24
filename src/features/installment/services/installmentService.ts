// =====================================================
// PCMS - Installment Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  InstallmentConfirmRequest,
  InstallmentConfirmResponse,
  InstallmentQuote,
  InstallmentQuoteRequest,
} from '../types';

export async function getInstallmentQuote(payload: InstallmentQuoteRequest) {
  const res = await apiClient.post<InstallmentQuote>(
    API_ENDPOINTS.INSTALLMENT_QUOTE,
    payload
  );
  return res.data;
}

export async function confirmInstallment(payload: InstallmentConfirmRequest) {
  const res = await apiClient.post<InstallmentConfirmResponse>(
    API_ENDPOINTS.INSTALLMENT_CONFIRM,
    payload
  );
  return res.data;
}