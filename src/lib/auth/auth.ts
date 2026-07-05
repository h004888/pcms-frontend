// =====================================================
// PCMS - Auth helpers (login/logout/register/getCurrentUser)
// Uses localStorage for token storage (suitable for SPA)
// =====================================================

import { AuthUser, LoginRequest, LoginResponse } from '@/types';
import apiClient, { clearTokens, getAccessToken, saveTokens } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const USER_KEY = 'pcms_user';

/**
 * Login user, save tokens + user info
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, credentials);
  const { accessToken, refreshToken, user } = response.data;
  saveTokens(accessToken, refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return response.data;
}

/**
 * Register a new customer account
 */
export async function register(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH_REGISTER, data);
  const { accessToken, refreshToken, user } = response.data;
  saveTokens(accessToken, refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return response.data;
}

/**
 * Send forgot password request
 */
export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
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
