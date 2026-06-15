// =====================================================
// PCMS - Auth helpers (login/logout/getCurrentUser)
// Uses localStorage for token storage (suitable for SPA)
// =====================================================

import { AuthUser, LoginRequest, LoginResponse } from '@/types';
import apiClient, { clearTokens, getAccessToken, saveTokens } from './api';

const USER_KEY = 'pcms_user';

/**
 * Login user, save tokens + user info
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  const { accessToken, refreshToken, user } = response.data;
  saveTokens(accessToken, refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return response.data;
}

/**
 * Logout - clear all auth state
 */
export function logout(): void {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (has token)
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null && getCurrentUser() !== null;
}

/**
 * Check if user has one of the allowed roles
 */
export function hasRole(user: AuthUser | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
