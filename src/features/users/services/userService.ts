// =====================================================
// PCMS - User Service
// All API calls for users feature
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { User, CreateUserRequest } from '../types';

/** Fetch all users (paginated) */
export async function fetchUsers(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.USERS}?${queryString}` : API_ENDPOINTS.USERS;
  const res = await apiClient.get<PageResponse<User>>(url);
  return res.data;
}

/** Fetch single user by ID */
export async function fetchUserById(id: string) {
  const res = await apiClient.get<User>(API_ENDPOINTS.USER_DETAIL(id));
  return res.data;
}

/** Create new user */
export async function createUser(data: CreateUserRequest) {
  const res = await apiClient.post<User>(API_ENDPOINTS.USERS, data);
  return res.data;
}

/** Update user */
export async function updateUser(id: string, data: Partial<User>) {
  const res = await apiClient.put<User>(API_ENDPOINTS.USER_DETAIL(id), data);
  return res.data;
}

/** Deactivate user (soft delete) */
export async function deactivateUser(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.USER_DETAIL(id));
  return res.data;
}

/** Send password reset email */
export async function resetUserPassword(id: string) {
  const res = await apiClient.post(API_ENDPOINTS.USER_RESET_PASSWORD(id));
  return res.data;
}
