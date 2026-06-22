// =====================================================
// PCMS - Suppliers feature types (UC11)
// =====================================================

import type { UUID, ISODate, SupplierStatus } from '@/types/common';

export interface Supplier {
  id: UUID;
  name: string;
  taxCode: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  bankName?: string;
  bankAccount?: string;
  status: SupplierStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateSupplierRequest = Omit<
  Supplier,
  'id' | 'createdAt' | 'updatedAt'
> & {
  name: string;
  phone: string;
};

export type UpdateSupplierRequest = Partial<
  Pick<
    Supplier,
    | 'name'
    | 'taxCode'
    | 'contactPerson'
    | 'phone'
    | 'email'
    | 'address'
    | 'bankName'
    | 'bankAccount'
    | 'status'
  >
>;