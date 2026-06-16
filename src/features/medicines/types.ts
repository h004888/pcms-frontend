// =====================================================
// PCMS - Medicines feature types
// =====================================================

import type { UUID, ISODate, MedicineStatus } from '@/types/common';

export interface Category {
  id: UUID;
  name: string;
  description?: string;
  createdAt: ISODate;
}

export interface Medicine {
  id: UUID;
  sku: string;
  name: string;
  categoryId: UUID;
  supplierId?: UUID;
  price: number;
  unit: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  status: MedicineStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateMedicineRequest = Omit<Medicine, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  & { status?: MedicineStatus };

export type UpdateMedicineRequest = Partial<Pick<Medicine, 'name' | 'price' | 'unit' | 'categoryId' | 'supplierId' | 'prescriptionRequired' | 'imageUrl' | 'status'>>;
