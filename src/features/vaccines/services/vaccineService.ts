// =====================================================
// PCMS - Vaccines Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  VaccineBooking,
  VaccineBookingsResponse,
  VaccineSlotsResponse,
  VaccinesResponse,
  VaccinationLedgerResponse,
} from '../types';

interface PageResponse<T> {
  data?: T[] | null;
  vaccines?: T[] | null;
  total?: number;
}

export async function fetchVaccines() {
  const res = await apiClient.get<PageResponse<VaccinesResponse['vaccines'][number]>>(
    API_ENDPOINTS.VACCINES
  );
  const body = res.data;
  const vaccines = (body?.data ?? body?.vaccines ?? []) as VaccinesResponse['vaccines'];
  return { vaccines, total: body?.total ?? vaccines.length };
}

export async function fetchVaccineSlots(vaccineId: string) {
  const res = await apiClient.get<VaccineSlotsResponse>(
    API_ENDPOINTS.VACCINE_SLOTS(vaccineId)
  );
  return res.data ?? { slots: [] };
}

export async function bookVaccine(payload: {
  vaccineId: string;
  slotId: string;
  customerId?: string;
}) {
  const res = await apiClient.post<VaccineBooking>(
    API_ENDPOINTS.VACCINE_BOOKINGS,
    payload
  );
  return res.data;
}

export async function fetchMyVaccineBookings() {
  const res = await apiClient.get<VaccineBookingsResponse>(
    API_ENDPOINTS.VACCINE_BOOKINGS_ME
  );
  return res.data ?? { bookings: [], total: 0 };
}

export async function cancelVaccineBooking(id: string) {
  await apiClient.delete(API_ENDPOINTS.VACCINE_BOOKING_DETAIL(id));
}

export async function fetchVaccinationLedger() {
  const res = await apiClient.get<VaccinationLedgerResponse>(
    API_ENDPOINTS.VACCINATION_LEDGER_ME
  );
  return res.data ?? { records: [], total: 0 };
}