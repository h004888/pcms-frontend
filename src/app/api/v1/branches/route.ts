// =====================================================
// PCMS - Mock BFF: /api/v1/branches
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

  const filtered = filterBy(mockStore.branches, searchParams, [
    'name',
    'code',
    'province',
    'address',
    'phone',
  ]);

  return NextResponse.json(paginate(filtered, page, size));
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
  const newBranch = {
    id: newId(),
    code: body.code ?? '',
    name: body.name ?? '',
    address: body.address ?? '',
    province: body.province ?? '',
    phone: body.phone ?? '',
    email: body.email,
    managerId: body.managerId,
    status: body.status ?? 'ACTIVE',
    openHours: body.openHours ?? '07:00 - 22:00',
    createdAt: now,
    updatedAt: now,
  };
  mockStore.branches.push(newBranch);
  return NextResponse.json(newBranch, { status: 201 });
}
