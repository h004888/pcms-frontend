// =====================================================
// PCMS - Prescription feature types (UC12)
// =====================================================

import type { UUID, ISODate, PrescriptionStatus } from './common';

export interface Prescription {
  id: UUID;
  code: string;
  patientId: UUID;
  doctorId: UUID;
  diagnosis: string;
  notes?: string;
  signatureHash: string;
  licenseNo?: string;
  status: PrescriptionStatus;
  issuedAt?: ISODate;
  createdAt: ISODate;
}

export type CreatePrescriptionRequest = Omit<Prescription, 'id' | 'code' | 'signatureHash' | 'status' | 'issuedAt' | 'createdAt'>
  & { status?: PrescriptionStatus };
