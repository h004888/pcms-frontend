// =====================================================
// PCMS - Vouchers feature types
// =====================================================

export type DiscountType = 'PERCENT' | 'FIXED';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  expiresAt: string;
  status: 'available' | 'used' | 'expired';
}

export interface VoucherHistoryItem {
  voucher: Voucher;
  usedAt: string;
  orderCode: string;
}

export interface VouchersResponse {
  vouchers: Voucher[];
  total: number;
}

export interface VoucherHistoryResponse {
  items: VoucherHistoryItem[];
  total: number;
}