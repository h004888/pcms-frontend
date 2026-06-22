// =====================================================
// PCMS - Mock BFF: /api/v1/users
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

  const filtered = filterBy(mockStore.users, searchParams, [
    'fullName',
    'email',
    'phone',
  ]);

  // Optional role filter
  const role = searchParams.get('role');
  const final = role ? filtered.filter((u) => u.role === role) : filtered;

  return NextResponse.json(paginate(final, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  if (auth.role !== 'ADMIN' && auth.role !== 'CEO') {
    return NextResponse.json(
      { message: 'Forbidden', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const now = new Date().toISOString();
  const newUser = {
    id: newId(),
    email: body.email ?? '',
    fullName: body.fullName ?? '',
    phone: body.phone ?? '',
    role: body.role ?? 'PHARMACIST',
    branchId: body.branchId ?? null,
    status: body.status ?? 'ACTIVE',
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  };
  mockStore.users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
