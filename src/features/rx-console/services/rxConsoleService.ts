// =====================================================
// PCMS - RX Console Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  CrossSellProduct,
  Customer360,
  DrugCheckRequest,
  DrugCheckResult,
  FollowUp,
  VipMark,
} from '../types';

export async function fetchCustomer360(customerId: string) {
  const res = await apiClient.get<Customer360>(
    API_ENDPOINTS.RX_CUSTOMER_360(customerId)
  );
  return res.data;
}

export async function aiCrossSell(payload: {
  customerId: string;
  currentMedicines: string[];
}) {
  const res = await apiClient.post<{ products: CrossSellProduct[] }>(
    API_ENDPOINTS.RX_CROSS_SELL,
    payload
  );
  return res.data ?? { products: [] };
}

export async function aiDrugCheck(payload: DrugCheckRequest) {
  const res = await apiClient.post<DrugCheckResult>(
    API_ENDPOINTS.RX_DRUG_CHECK,
    payload
  );
  return res.data;
}

export async function fetchFollowUpsByCustomer(customerId: string) {
  const res = await apiClient.get<{ followUps: FollowUp[] }>(
    API_ENDPOINTS.FOLLOW_UPS_BY_CUSTOMER(customerId)
  );
  return res.data ?? { followUps: [] };
}

export async function createFollowUp(payload: {
  customerId: string;
  notes: string;
  dueDate: string;
}) {
  const res = await apiClient.post<FollowUp>(
    API_ENDPOINTS.FOLLOW_UPS,
    payload
  );
  return res.data;
}

export async function respondFollowUp(id: string, response: string) {
  await apiClient.post(API_ENDPOINTS.FOLLOW_UP_RESPONSE(id), { response });
}

export async function fetchVipMarksByCustomer(customerId: string) {
  const res = await apiClient.get<{ marks: VipMark[] }>(
    API_ENDPOINTS.VIP_MARKS_BY_CUSTOMER(customerId)
  );
  return res.data ?? { marks: [] };
}

export async function createVipMark(payload: {
  customerId: string;
  tier: string;
  reason: string;
}) {
  const res = await apiClient.post<VipMark>(API_ENDPOINTS.VIP_MARKS, payload);
  return res.data;
}