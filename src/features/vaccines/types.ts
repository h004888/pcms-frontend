// =====================================================
// PCMS - Vaccines feature types
// =====================================================

export type VaccineAudience = 'CHILD' | 'ADULT' | 'PREGNANT' | 'ELDERLY';

export interface Vaccine {
  id: string;
  name: string;
  category: VaccineAudience;
  description?: string;
  manufacturer?: string;
  origin?: string;
  ageRange?: string;
  doses?: number;
  schedule?: string;
  price: number;
}

export interface VaccineSlot {
  id: string;
  vaccineId: string;
  branchId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
}

export interface VaccineBooking {
  id: string;
  vaccineId: string;
  slotId: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  bookedAt: string;
  scheduledAt: string;
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  doseNumber: number;
  administeredAt: string;
  branchName: string;
}

export interface VaccinesResponse {
  vaccines: Vaccine[];
  total: number;
}

export interface VaccineSlotsResponse {
  slots: VaccineSlot[];
}

export interface VaccineBookingsResponse {
  bookings: VaccineBooking[];
  total: number;
}

export interface VaccinationLedgerResponse {
  records: VaccinationRecord[];
  total: number;
}