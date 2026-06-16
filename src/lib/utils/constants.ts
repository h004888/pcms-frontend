// =====================================================
// PCMS - Constants & Status Maps (Vietnamese labels & colors)
// =====================================================

/**
 * Role display label (Vietnamese)
 */
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  CEO: 'Giám đốc điều hành',
  BRANCH_MANAGER: 'Quản lý chi nhánh',
  PHARMACIST: 'Dược sĩ',
  CUSTOMER: 'Khách hàng',
};

/**
 * Order status display label (Vietnamese)
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

/**
 * Order status color for badges
 */
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-accent-100 text-accent-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

/**
 * Payment method display label
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Tiền mặt',
  CARD: 'Thẻ',
  QR: 'QR Code',
  LOYALTY_POINTS: 'Điểm thưởng',
};

/**
 * Generic status color
 */
export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-accent-100 text-accent-800',
  INACTIVE: 'bg-ink-100 text-ink-700',
  LOCKED: 'bg-red-100 text-red-800',
  SENT: 'bg-accent-100 text-accent-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  READ: 'bg-blue-100 text-blue-800',
  DRAFT: 'bg-ink-100 text-ink-700',
  SIGNED: 'bg-accent-100 text-accent-800',
  SUCCESS: 'bg-accent-100 text-accent-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

/**
 * Get status color with fallback
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'bg-ink-100 text-ink-700';
}
