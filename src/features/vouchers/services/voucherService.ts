// =====================================================
// PCMS - Vouchers Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  VouchersResponse,
  VoucherHistoryResponse,
  Voucher,
} from '../types';

interface PageResponse<T> {
  data?: T[] | null;
  vouchers?: T[] | null;
  items?: T[] | null;
  total?: number;
}

export async function fetchVouchers() {
  const res = await apiClient.get<PageResponse<Voucher> | Voucher[]>(
    API_ENDPOINTS.VOUCHERS
  );
  const body = res.data;
  if (Array.isArray(body)) return { vouchers: body, total: body.length };
  const items = (body?.data ?? body?.vouchers ?? []) as Voucher[];
  return { vouchers: items, total: body?.total ?? items.length };
}

export async function fetchVoucherHistory() {
  const res = await apiClient.get<PageResponse<Voucher> | VoucherHistoryResponse>(
    API_ENDPOINTS.VOUCHERS_HISTORY
  );
  const body = res.data;
  if (Array.isArray(body)) return { items: [], total: 0 };
  const items = (body as VoucherHistoryResponse).items ?? [];
  return { items, total: items.length };
}

export async function applyVoucher(code: string) {
  const res = await apiClient.post<Voucher>(API_ENDPOINTS.VOUCHERS_APPLY, {
    code,
  });
  return res.data;
}