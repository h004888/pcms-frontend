// =====================================================
// PCMS - Mock Prescriptions seed (12 records)
// Mix of DRAFT / SIGNED / CANCELLED
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_CUSTOMERS } from './customers';
import { SEED_BRANCHES } from './branches';
import { SEED_MEDICINES } from './medicines';

export type PrescriptionStatus = 'DRAFT' | 'SIGNED' | 'CANCELLED';

export interface MockPrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;       // "1 viên x 3 lần/ngày"
  duration: string;     // "7 ngày"
  notes?: string;
}

export interface MockPrescription {
  id: string;
  prescriptionNumber: string;  // RX-YYYYMMDD-####
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  branchId: string;
  branchName: string;
  diagnosis: string;
  items: MockPrescriptionItem[];
  status: PrescriptionStatus;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const customers = SEED_CUSTOMERS.slice(0, 5);
const branches = SEED_BRANCHES;
const medicines = SEED_MEDICINES.slice(0, 6);
const doctors = [
  { id: 'doctor-001', name: 'BS. Trần Văn X' },
  { id: 'doctor-002', name: 'BS. Lê Thị Y' },
  { id: 'doctor-003', name: 'BS. Nguyễn Văn Z' },
];

const diagnoses = [
  'Viêm họng cấp',
  'Cao huyết áp',
  'Đái tháo đường type 2',
  'Viêm dạ dày',
  'Cảm cúm thông thường',
  'Đau đầu mạn tính',
  'Dị ứng thời tiết',
  'Rối loạn tiêu hóa',
];

const statuses: PrescriptionStatus[] = ['SIGNED', 'SIGNED', 'SIGNED', 'DRAFT', 'CANCELLED'];

const NOW = new Date('2026-06-22T10:00:00Z');

export const SEED_PRESCRIPTIONS: MockPrescription[] = Array.from({ length: 12 }, (_, i) => {
  const c = customers[i % customers.length];
  const b = branches[i % branches.length];
  const d = doctors[i % doctors.length];
  const m1 = medicines[i % medicines.length];
  const m2 = medicines[(i + 1) % medicines.length];
  const date = new Date(NOW.getTime() - i * 12 * 3600 * 1000);
  const status = statuses[i % statuses.length];
  return {
    id: uuid(),
    prescriptionNumber: `RX-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`,
    patientId: c.id,
    patientName: c.name,
    patientPhone: c.phone,
    doctorId: d.id,
    doctorName: d.name,
    branchId: b.id,
    branchName: b.name,
    diagnosis: diagnoses[i % diagnoses.length],
    items: [
      { medicineId: m1.id, medicineName: m1.name, dosage: '1 viên × 3 lần/ngày', duration: '7 ngày' },
      { medicineId: m2.id, medicineName: m2.name, dosage: '1 viên × 2 lần/ngày', duration: '5 ngày', notes: 'Sau ăn' },
    ],
    status,
    signedAt: status === 'SIGNED' ? date.toISOString() : null,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
});
