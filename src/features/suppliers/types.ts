// =====================================================
// PCMS - Suppliers feature types
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
