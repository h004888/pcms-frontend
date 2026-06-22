// =====================================================
// PCMS - Mock BFF: /api/v1/suppliers/[id] (UC11)
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

  const supplier = mockStore.suppliers.find((s) => s.id === params.id);
  if (!supplier) {
    return NextResponse.json(
      { message: 'Supplier not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(supplier);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  if (auth.role !== 'ADMIN' && auth.role !== 'CEO') {
    return NextResponse.json(
      { message: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  const idx = mockStore.suppliers.findIndex((s) => s.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Supplier not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.suppliers[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };
  mockStore.suppliers[idx] = updated;
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

  const idx = mockStore.suppliers.findIndex((s) => s.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Supplier not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  // Soft delete: set status=INACTIVE (theo pattern branch BFF)
  mockStore.suppliers[idx] = {
    ...mockStore.suppliers[idx],
    status: 'INACTIVE',
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}