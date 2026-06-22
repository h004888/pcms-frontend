// =====================================================
// PCMS - Mock BFF: /api/v1/medicines/[id]
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

  const med = mockStore.medicines.find((m) => m.id === params.id);
  if (!med) {
    return NextResponse.json(
      { message: 'Medicine not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(med);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.medicines.findIndex((m) => m.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Medicine not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.medicines[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };
  mockStore.medicines[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.medicines.findIndex((m) => m.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Medicine not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  // Soft delete: set status=INACTIVE
  mockStore.medicines[idx] = {
    ...mockStore.medicines[idx],
    status: 'INACTIVE',
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}
