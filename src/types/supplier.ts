// =====================================================
// PCMS - Supplier feature types (UC11)
// =====================================================

import type { UUID, ISODate, SupplierStatus } from './common';

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
