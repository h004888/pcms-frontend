// =====================================================
// PCMS - Validation utilities
// =====================================================

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
