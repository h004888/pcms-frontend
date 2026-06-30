// =====================================================
// PCMS - Profile Service
// SPRINT 0 FIX T03: chuyển sang /customers/me (backend route)
//
// Mapping: API trả Customer (id, code, points, tier, ...).
// UI component cũ đang dùng Profile (shape hẹp hơn).
// Để giữ footprint thay đổi nhỏ: map Customer → Profile trước khi trả về.
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Profile, UpdateProfileRequest } from '../types';
import type { Customer } from '@/types/customer';

function customerToProfile(c: Customer): Profile {
  return {
    name: c.name,
    email: c.email ?? '',
    phone: c.phone,
    birthday: c.dob ?? '',
    gender: c.gender ?? '',
    tier: c.tier,
    memberSince: c.createdAt,
  };
}

export async function fetchProfile(): Promise<Profile> {
  const res = await apiClient.get<Customer>(API_ENDPOINTS.PROFILE);
  return customerToProfile(res.data);
}

export async function updateProfile(data: UpdateProfileRequest): Promise<Profile> {
  const res = await apiClient.put<Customer>(API_ENDPOINTS.PROFILE, data);
  return customerToProfile(res.data);
}

// uploadAvatar: giữ nguyên — endpoint chưa có backend, sẽ trả 404
export async function uploadAvatar(formData: FormData) {
  try {
    const res = await apiClient.post(API_ENDPOINTS.PROFILE_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: res.data, error: null as string | null };
  } catch (e) {
    return { data: null, error: 'Backend chưa hỗ trợ upload avatar' };
  }
}
