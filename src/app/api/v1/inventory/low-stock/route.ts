// =====================================================
// PCMS - Mock BFF: /api/v1/inventory/low-stock (UC05 - BR02 alerts)
// Trả về array các batch có qtyOnHand <= minStockLevel
// Mặc định threshold = minStockLevel của từng batch (nếu không truyền ?threshold=)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const branchId = searchParams.get('branchId');
  const thresholdParam = searchParams.get('threshold');

  let result = mockStore.inventoryBatches.filter(
    (b) => b.qtyOnHand <= b.minStockLevel
  );

  if (thresholdParam !== null) {
    const t = Number(thresholdParam);
    if (!isNaN(t)) {
      result = mockStore.inventoryBatches.filter((b) => b.qtyOnHand <= t);
    }
  }

  if (branchId) {
    result = result.filter((b) => b.branchId === branchId);
  }

  return NextResponse.json(result);
}