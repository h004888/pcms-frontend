// =====================================================
// PCMS - Formatters (VND, date, status colors, etc.)
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
 * Truncate UUID for display
 */
export function shortId(id: string | null | undefined, length: number = 8): string {
  if (!id) return '—';
  return id.slice(0, length) + '…';
}
