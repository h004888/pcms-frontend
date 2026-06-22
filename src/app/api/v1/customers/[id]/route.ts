// =====================================================
// PCMS - Mock BFF: /api/v1/customers/[id]
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

  const cust = mockStore.customers.find((c) => c.id === params.id);
  if (!cust) {
    return NextResponse.json(
      { message: 'Customer not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(cust);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.customers.findIndex((c) => c.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Customer not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.customers[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    code: current.code,
    updatedAt: new Date().toISOString(),
  };
  mockStore.customers[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.customers.findIndex((c) => c.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Customer not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  // Soft delete: set status=INACTIVE
  mockStore.customers[idx] = {
    ...mockStore.customers[idx],
    status: 'INACTIVE',
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}
