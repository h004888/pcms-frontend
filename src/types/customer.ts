// =====================================================
// PCMS - Customer feature types (UC08)
// =====================================================

import type { UUID, ISODate, Gender } from './common';

export interface Customer {
  id: UUID;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  points: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateCustomerRequest = Omit<Customer, 'id' | 'code' | 'points' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerRequest = Partial<Pick<Customer, 'name' | 'phone' | 'email' | 'address' | 'dob' | 'gender'>>;
