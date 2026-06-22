// =====================================================
// PCMS - Common types & shared enums
// =====================================================

export type UUID = string;
export type ISODate = string;

/**
 * Standard paginated response from backend
 */
export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

/** Common API result type */
export interface ApiResult<T> {
  data: T;
  message?: string;
  success: boolean;
}

// === Shared Enums ===
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';
export type BranchStatus = 'ACTIVE' | 'INACTIVE';
export type MedicineStatus = 'ACTIVE' | 'INACTIVE';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE';
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'QR' | 'LOYALTY_POINTS' | 'BANK_TRANSFER' | 'INSTALLMENT';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type TransactionType = 'IMPORT' | 'EXPORT' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'SALE' | 'ADJUSTMENT';
export type PrescriptionStatus = 'DRAFT' | 'SIGNED' | 'CANCELLED';
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';
export type InventoryBatchStatus = 'ACTIVE' | 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
export type ReportType = 'REVENUE' | 'INVENTORY' | 'SALES' | 'PRESCRIPTION' | 'CUSTOMER' | 'PROFIT';
export type ReportFormat = 'EXCEL' | 'PDF' | 'CSV';
