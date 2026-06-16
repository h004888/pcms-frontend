// =====================================================
// PCMS - Users feature types
// =====================================================

import type { UUID, ISODate, UserStatus } from '@/types/common';
import type { Role } from '@/types/auth';

export interface User {
  id: UUID;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  branchId?: UUID;
  status: UserStatus;
  lastLoginAt?: ISODate;
  lastLoginIp?: string;
  failedLoginCount?: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'lastLoginIp' | 'failedLoginCount' | 'status'>
  & { status?: UserStatus; password?: string };

export type UpdateUserRequest = Partial<Pick<User, 'fullName' | 'phone' | 'role' | 'branchId' | 'status'>>;
