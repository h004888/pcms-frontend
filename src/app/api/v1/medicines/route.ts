// =====================================================
// PCMS - Mock BFF: /api/v1/medicines
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

  const filtered = filterBy(mockStore.medicines, searchParams, [
    'name',
    'sku',
    'activeIngredient',
    'manufacturer',
  ]);

  // Optional status filter
  const status = searchParams.get('status');
  const after = status ? filtered.filter((m) => m.status === status) : filtered;

  return NextResponse.json(paginate(after, page, size));
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
  const newMed = {
    id: newId(),
    sku: body.sku ?? '',
    name: body.name ?? '',
    categoryId: body.categoryId ?? '',
    supplierId: body.supplierId ?? '',
    price: Number(body.price ?? 0),
    unit: body.unit ?? 'box',
    prescriptionRequired: Boolean(body.prescriptionRequired),
    imageUrl: body.imageUrl,
    description: body.description,
    manufacturer: body.manufacturer ?? '',
    activeIngredient: body.activeIngredient ?? '',
    status: body.status ?? 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  mockStore.medicines.push(newMed);
  return NextResponse.json(newMed, { status: 201 });
}
