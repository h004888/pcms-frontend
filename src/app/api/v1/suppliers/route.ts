// =====================================================
// PCMS - Mock BFF: /api/v1/suppliers (UC11)
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

  const filtered = filterBy(mockStore.suppliers, searchParams, [
    'name',
    'taxCode',
    'contactPerson',
    'phone',
    'email',
    'address',
  ]);

  // Optional status filter
  const status = searchParams.get('status');
  const after = status
    ? filtered.filter((s) => s.status === status)
    : filtered;

  return NextResponse.json(paginate(after, page, size));
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
  const newSupplier = {
    id: newId(),
    name: body.name ?? '',
    taxCode: body.taxCode ?? '',
    contactPerson: body.contactPerson ?? '',
    phone: body.phone ?? '',
    email: body.email ?? '',
    address: body.address ?? '',
    bankName: body.bankName,
    bankAccount: body.bankAccount,
    status: body.status ?? 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  mockStore.suppliers.push(newSupplier);
  return NextResponse.json(newSupplier, { status: 201 });
}