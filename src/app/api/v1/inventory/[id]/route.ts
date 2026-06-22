// =====================================================
// PCMS - Mock BFF: /api/v1/inventory/[id] (UC05)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import {
  mockDelay,
  requireAuth,
  isAuthError,
} from '@/lib/mock/handlers';

interface Ctx {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const batch = mockStore.inventoryBatches.find((b) => b.id === params.id);
  if (!batch) {
    return NextResponse.json(
      { message: 'Inventory batch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(batch);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  if (auth.role === 'CUSTOMER') {
    return NextResponse.json(
      { message: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  const idx = mockStore.inventoryBatches.findIndex((b) => b.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Inventory batch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.inventoryBatches[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    receivedAt: current.receivedAt, // không cho sửa ngày nhập
  };
  mockStore.inventoryBatches[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  if (auth.role !== 'ADMIN' && auth.role !== 'CEO') {
    return NextResponse.json(
      { message: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  const idx = mockStore.inventoryBatches.findIndex((b) => b.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Inventory batch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  mockStore.inventoryBatches.splice(idx, 1);
  return NextResponse.json({ success: true });
}