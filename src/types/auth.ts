// =====================================================
// PCMS - Auth feature types
// =====================================================

import type { UUID, ISODate } from './common';
import type { UserStatus } from './common';

export type Role = 'ADMIN' | 'CEO' | 'BRANCH_MANAGER' | 'PHARMACIST' | 'CUSTOMER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface AuthUser {
  id: UUID;
  email: string;
  fullName: string;
  role: Role;
  branchId: UUID | null;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
