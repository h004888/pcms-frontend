// =====================================================
// PCMS - Auth feature types
// =====================================================

import type { UUID, ISODate, UserStatus } from './common';

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
  user: AuthUser; // ← nested (P1.4)
}

export interface AuthUser {
  id: UUID;
  email: string;
  fullName: string;
  role: Role;
  branchId: UUID | null;
  status: UserStatus; // ← added (P1.4)
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  /**
   * True sau khi AuthContext đã hydrate từ localStorage.
   * Components cần check `hydrated` trước `isAuthenticated` để tránh
   * redirect sai trong initial render (trước khi localStorage được đọc).
   */
  hydrated: boolean;
}
