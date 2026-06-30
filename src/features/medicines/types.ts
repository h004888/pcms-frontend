// =====================================================
// PCMS - Medicines feature types
// =====================================================

import type { UUID, ISODate, MedicineStatus } from '@/types/common';

export interface Category {
  id: UUID;
  name: string;
  slug?: string;
  description?: string;
  createdAt: ISODate;
}

export interface Medicine {
  id: UUID;
  sku: string;
  slug?: string;
  name: string;
  categoryId: UUID;
  supplierId?: UUID;
  price: number;
  unit: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  description?: string;
  usage?: string;
  ingredients?: string;
  status: MedicineStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateMedicineRequest = Omit<Medicine, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  & { status?: MedicineStatus };

export type UpdateMedicineRequest = Partial<Pick<Medicine, 'name' | 'price' | 'unit' | 'categoryId' | 'supplierId' | 'prescriptionRequired' | 'imageUrl' | 'status'>>;
