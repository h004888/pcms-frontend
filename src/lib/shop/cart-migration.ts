// =====================================================
// Cart migration util — sync localStorage cart lên backend
// Chạy 1 lần sau khi user đăng nhập, lần đầu mount CartProvider
// Xem PLAN_INTEGRATION.md section 4.4.1
// =====================================================

import { addCartItem } from '@/features/cart';
import type { CartState } from '@/lib/shop/cart';

const STORAGE_KEY = 'pcms-cart';
const SYNCED_FLAG_KEY = 'pcms-cart-synced';

/**
 * Đọc cart từ localStorage (server CartItemResponse có UUID itemId,
 * khác với ProductSummary.productId từ FE).
 */
export function readLocalCart(): CartState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearLocalCart(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function alreadySynced(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SYNCED_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

function markSynced(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SYNCED_FLAG_KEY, '1');
  } catch {
    // ignore
  }
}

export interface SyncUpResult {
  synced: number;
  failed: number;
  skipped: boolean;
}

/**
 * Sync cart từ localStorage lên backend.
 * - Skip nếu đã sync trước đó (cờ SYNCED_FLAG_KEY).
 * - Skip nếu không có token (chưa đăng nhập).
 * - Retry 3 lần mỗi item.
 * - Trả về số item sync thành công / thất bại.
 */
export async function syncLocalCartToBackend(
  hasAuthToken: () => boolean
): Promise<SyncUpResult> {
  if (alreadySynced()) return { synced: 0, failed: 0, skipped: true };
  if (!hasAuthToken()) return { synced: 0, failed: 0, skipped: true };

  const local = readLocalCart();
  if (!local) return { synced: 0, failed: 0, skipped: false };

  let synced = 0;
  let failed = 0;

  for (const item of local.items) {
    let attempts = 0;
    let ok = false;
    while (attempts < 3 && !ok) {
      attempts++;
      try {
        await addCartItem({ medicineId: item.productId, qty: item.qty });
        ok = true;
        synced++;
      } catch {
        // retry
      }
    }
    if (!ok) failed++;
  }

  if (failed === 0) {
    clearLocalCart();
  }
  markSynced();
  return { synced, failed, skipped: false };
}
