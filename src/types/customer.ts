// =====================================================
// PCMS - Customer feature types (UC08)
// =====================================================

import type { UUID, ISODate, Gender } from './common';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Customer {
  id: UUID;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  status: CustomerStatus; // ← added (P1.4)
  points: number;
  tier: LoyaltyTier; // ← added (P1.4)
  totalSpent?: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateCustomerRequest = Omit<
  Customer,
  'id' | 'code' | 'points' | 'tier' | 'status' | 'createdAt' | 'updatedAt'
>;
export type UpdateCustomerRequest = Partial<
  Pick<
    Customer,
    'name' | 'phone' | 'email' | 'address' | 'dob' | 'gender' | 'status' | 'tier' | 'points'
  >
>;
