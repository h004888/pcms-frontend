// =====================================================
// PCMS - Family Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { FamilyMember, CreateFamilyMemberRequest, UpdateFamilyMemberRequest } from '../types';

export async function fetchFamilyMembers() {
  const res = await apiClient.get<FamilyMember[]>(API_ENDPOINTS.FAMILY);
  return res.data;
}

export async function createFamilyMember(data: CreateFamilyMemberRequest) {
  const res = await apiClient.post<FamilyMember>(API_ENDPOINTS.FAMILY, data);
  return res.data;
}

export async function updateFamilyMember(id: string, data: UpdateFamilyMemberRequest) {
  const res = await apiClient.put<FamilyMember>(API_ENDPOINTS.FAMILY_MEMBER_DETAIL(id), data);
  return res.data;
}

export async function deleteFamilyMember(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.FAMILY_MEMBER_DETAIL(id));
  return res.data;
}
