// =====================================================
// PCMS - Customer Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { PageResponse } from '@/types';
import type { Customer } from '../types';

export async function fetchCustomers(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') searchParams.set(k, String(v));
  });
  const queryString = searchParams.toString();
  const url = queryString ? `${API_ENDPOINTS.CUSTOMERS}?${queryString}` : API_ENDPOINTS.CUSTOMERS;
  const res = await apiClient.get<PageResponse<Customer>>(url);
  return res.data;
}

export async function fetchCustomerById(id: string) {
  const res = await apiClient.get<Customer>(API_ENDPOINTS.CUSTOMER_DETAIL(id));
  return res.data;
}

export async function createCustomer(data: Omit<Customer, 'id' | 'code' | 'points' | 'createdAt' | 'updatedAt'>) {
  const res = await apiClient.post<Customer>(API_ENDPOINTS.CUSTOMERS, data);
  return res.data;
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  const res = await apiClient.put<Customer>(API_ENDPOINTS.CUSTOMER_DETAIL(id), data);
  return res.data;
}

export async function fetchCustomerOrders(customerId: string) {
  const res = await apiClient.get<PageResponse<unknown>>(`${API_ENDPOINTS.ORDERS}?customerId=${customerId}&size=50`);
  return res.data;
}
