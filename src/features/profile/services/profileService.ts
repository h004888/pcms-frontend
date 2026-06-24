// =====================================================
// PCMS - Profile Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Profile, UpdateProfileRequest } from '../types';

export async function fetchProfile() {
  const res = await apiClient.get<Profile>(API_ENDPOINTS.PROFILE);
  return res.data;
}

export async function updateProfile(data: UpdateProfileRequest) {
  const res = await apiClient.put<Profile>(API_ENDPOINTS.PROFILE, data);
  return res.data;
}

export async function uploadAvatar(formData: FormData) {
  const res = await apiClient.post(API_ENDPOINTS.PROFILE_AVATAR, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
