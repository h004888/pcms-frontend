// =====================================================
// PCMS - Mock BFF: /api/v1/customers
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

  const filtered = filterBy(mockStore.customers, searchParams, [
    'name',
    'phone',
    'email',
    'code',
  ]);

  return NextResponse.json(paginate(filtered, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const body = await req.json();
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const seq = String(mockStore.customers.length + 1).padStart(4, '0');
  const newCust = {
    id: newId(),
    code: `CUST-${year}${seq}`,
    name: body.name ?? '',
    phone: body.phone ?? '',
    email: body.email,
    address: body.address,
    dob: body.dob,
    gender: body.gender,
    status: 'ACTIVE',
    points: 0,
    tier: 'BRONZE',
    totalSpent: 0,
    createdAt: now,
    updatedAt: now,
  };
  mockStore.customers.push(newCust);
  return NextResponse.json(newCust, { status: 201 });
}
