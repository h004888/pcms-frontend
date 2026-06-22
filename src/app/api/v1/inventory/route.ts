// =====================================================
// PCMS - Mock BFF: /api/v1/inventory (UC05)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import {
  mockDelay,
  paginate,
  filterBy,
  requireAuth,
  isAuthError,
  newId,
} from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);

  // Lọc theo search trên batchNo, barcode
  const filtered = filterBy(mockStore.inventoryBatches, searchParams, [
    'batchNo',
    'barcode',
  ]);

  // Lọc theo branchId, medicineId (UUID exact match)
  const branchId = searchParams.get('branchId');
  const medicineId = searchParams.get('medicineId');
  const status = searchParams.get('status');

  let result = filtered;
  if (branchId) result = result.filter((b) => b.branchId === branchId);
  if (medicineId) result = result.filter((b) => b.medicineId === medicineId);
  if (status) result = result.filter((b) => b.status === status);

  return NextResponse.json(paginate(result, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  if (auth.role === 'CUSTOMER') {
    return NextResponse.json(
      { message: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const now = new Date().toISOString();
  const newBatch = {
    id: newId(),
    medicineId: body.medicineId ?? '',
    branchId: body.branchId ?? '',
    batchNo: body.batchNo ?? '',
    barcode: body.barcode ?? body.batchNo ?? '',
    qtyOnHand: Number(body.qtyOnHand ?? 0),
    expiryDate: body.expiryDate ?? '',
    minStockLevel: Number(body.minStockLevel ?? 10),
    receivedAt: now,
    status: body.status ?? 'ACTIVE',
  };
  mockStore.inventoryBatches.push(newBatch);
  return NextResponse.json(newBatch, { status: 201 });
}