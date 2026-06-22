// =====================================================
// PCMS - Mock BFF: /api/v1/users/[id]
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

  const user = mockStore.users.find((u) => u.id === params.id);
  if (!user) {
    return NextResponse.json(
      { message: 'User not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.users.findIndex((u) => u.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'User not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.users[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id, // id immutable
    updatedAt: new Date().toISOString(),
  };
  mockStore.users[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.users.findIndex((u) => u.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'User not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  // Soft delete: set status=INACTIVE
  mockStore.users[idx] = {
    ...mockStore.users[idx],
    status: 'INACTIVE',
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}
