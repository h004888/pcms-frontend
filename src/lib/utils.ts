// =====================================================
// PCMS - API utility functions (format, validate, etc.)
// Vietnamese locale defaults per SRS §4.4
// =====================================================

/**
 * Format number as Vietnamese Dong (VND)
 * @example formatVND(1000000) => "1.000.000 ₫"
 */
export function formatVND(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '—';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '—';
  return new Intl.NumberFormat('vi-VN').format(n);
}

/**
 * Format date as dd/MM/yyyy
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Format datetime as dd/MM/yyyy HH:mm
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Format date for input[type=date] (yyyy-MM-dd)
 */
export function toInputDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number = 30): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '…';
}

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
  PAID: 'bg-green-100 text-green-800',
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
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  LOCKED: 'bg-red-100 text-red-800',
  SENT: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  READ: 'bg-blue-100 text-blue-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  SIGNED: 'bg-green-100 text-green-800',
  SUCCESS: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
};

/**
 * Get status color with fallback
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone (Vietnamese)
 */
export function isValidPhone(phone: string): boolean {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Truncate UUID for display
 */
export function shortId(id: string | null | undefined, length: number = 8): string {
  if (!id) return '—';
  return id.slice(0, length) + '…';
}
