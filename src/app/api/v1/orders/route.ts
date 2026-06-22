// =====================================================
// PCMS - Mock BFF: /api/v1/orders (UC06)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, paginate, filterBy, requireAuth, isAuthError, newId } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);
  const status = searchParams.get('status');

  const filtered = filterBy(mockStore.orders, searchParams, ['orderNumber', 'customerName', 'branchName']);
  const after = status ? filtered.filter((o) => o.status === status) : filtered;

  return NextResponse.json(paginate(after, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json();
  const now = new Date().toISOString();
  const newOrder = {
    id: newId(),
    orderNumber: `ORD-${now.slice(0, 10).replace(/-/g, '')}-${String(mockStore.orders.length + 1).padStart(4, '0')}`,
    customerId: body.customerId,
    customerName: body.customerName || 'Khách lẻ',
    branchId: body.branchId,
    branchName: body.branchName || '',
    staffId: auth.userId,
    staffName: auth.userId,
    prescriptionId: body.prescriptionId ?? null,
    couponCode: body.couponCode ?? null,
    subtotal: Number(body.subtotal ?? 0),
    discount: Number(body.discount ?? 0),
    total: Number(body.total ?? 0),
    status: 'PENDING_PAYMENT' as const,
    items: body.items ?? [],
    createdAt: now,
    updatedAt: now,
  };
  mockStore.orders.unshift(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}
