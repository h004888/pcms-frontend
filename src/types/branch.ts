// =====================================================
// PCMS - Branch feature types (UC03)
// =====================================================

import type { UUID, ISODate, BranchStatus } from './common';

export interface Branch {
  id: UUID;
  code: string;
  name: string;
  address: string;
  phone: string;
  managerId?: UUID;
  status: BranchStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateBranchRequest = Omit<Branch, 'id' | 'createdAt' | 'updatedAt' | 'managerId' | 'status'>
  & { status?: BranchStatus; managerId?: UUID };

export type UpdateBranchRequest = Partial<Pick<Branch, 'name' | 'address' | 'phone' | 'status' | 'managerId'>>;
