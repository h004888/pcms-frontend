// =====================================================
// PCMS - Address Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../types';

export async function fetchAddresses() {
  const res = await apiClient.get<Address[]>(API_ENDPOINTS.ADDRESSES);
  return res.data;
}

export async function createAddress(data: CreateAddressRequest) {
  const res = await apiClient.post<Address>(API_ENDPOINTS.ADDRESSES, data);
  return res.data;
}

export async function updateAddress(id: string, data: UpdateAddressRequest) {
  const res = await apiClient.put<Address>(API_ENDPOINTS.ADDRESS_DETAIL(id), data);
  return res.data;
}

export async function deleteAddress(id: string) {
  const res = await apiClient.delete(API_ENDPOINTS.ADDRESS_DETAIL(id));
  return res.data;
}

export async function setDefaultAddress(id: string) {
  const res = await apiClient.post(API_ENDPOINTS.ADDRESS_SET_DEFAULT(id));
  return res.data;
}
