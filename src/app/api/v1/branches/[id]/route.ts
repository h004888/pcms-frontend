// =====================================================
// PCMS - Mock BFF: /api/v1/branches/[id]
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

  const branch = mockStore.branches.find((b) => b.id === params.id);
  if (!branch) {
    return NextResponse.json(
      { message: 'Branch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(branch);
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

  const idx = mockStore.branches.findIndex((b) => b.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Branch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.branches[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };
  mockStore.branches[idx] = updated;
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

  const idx = mockStore.branches.findIndex((b) => b.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Branch not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  // Soft delete: set status=INACTIVE
  mockStore.branches[idx] = {
    ...mockStore.branches[idx],
    status: 'INACTIVE',
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true });
}
