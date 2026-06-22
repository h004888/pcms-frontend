// =====================================================
// PCMS - Mock BFF: /api/v1/categories
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

  const filtered = filterBy(mockStore.categories, searchParams, [
    'name',
    'code',
    'description',
  ]);

  return NextResponse.json(paginate(filtered, page, size));
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
  const newCat = {
    id: newId(),
    code: body.code ?? '',
    name: body.name ?? '',
    description: body.description,
    parentId: body.parentId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  mockStore.categories.push(newCat);
  return NextResponse.json(newCat, { status: 201 });
}
