// =====================================================
// PCMS - Mock BFF: /api/v1/categories/[id]
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

  const cat = mockStore.categories.find((c) => c.id === params.id);
  if (!cat) {
    return NextResponse.json(
      { message: 'Category not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  return NextResponse.json(cat);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.categories.findIndex((c) => c.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Category not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const body = await req.json();
  const current = mockStore.categories[idx];
  const updated = {
    ...current,
    ...body,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };
  mockStore.categories[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.categories.findIndex((c) => c.id === params.id);
  if (idx < 0) {
    return NextResponse.json(
      { message: 'Category not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  mockStore.categories.splice(idx, 1);
  return NextResponse.json({ success: true });
}
