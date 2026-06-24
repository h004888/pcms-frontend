// =====================================================
// PCMS - Consultations Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  Consultation,
  ConsultationMessage,
  ConsultationsResponse,
} from '../types';

export async function createConsultation(payload: {
  customerId: string;
  pharmacistId?: string;
  type: string;
  topic: string;
  scheduledAt: string;
}) {
  const res = await apiClient.post<Consultation>(
    API_ENDPOINTS.CONSULTATIONS,
    payload
  );
  return res.data;
}

export async function fetchConsultationById(id: string) {
  const res = await apiClient.get<Consultation>(
    API_ENDPOINTS.CONSULTATION_DETAIL(id)
  );
  return res.data;
}

export async function endConsultation(id: string) {
  await apiClient.post(API_ENDPOINTS.CONSULTATION_END(id));
}

export async function addConsultationMessage(
  id: string,
  message: string
) {
  const res = await apiClient.post<ConsultationMessage>(
    API_ENDPOINTS.CONSULTATION_MESSAGES(id),
    { message }
  );
  return res.data;
}

export async function fetchConsultationsByCustomer(customerId: string) {
  const res = await apiClient.get<ConsultationsResponse>(
    API_ENDPOINTS.CONSULTATIONS_BY_CUSTOMER(customerId)
  );
  return res.data ?? { consultations: [], total: 0 };
}

export async function fetchConsultationsByPharmacist(pharmacistId: string) {
  const res = await apiClient.get<ConsultationsResponse>(
    API_ENDPOINTS.CONSULTATIONS_BY_PHARMACIST(pharmacistId)
  );
  return res.data ?? { consultations: [], total: 0 };
}