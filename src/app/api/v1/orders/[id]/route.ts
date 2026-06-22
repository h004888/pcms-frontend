// =====================================================
// PCMS - Mock BFF: /api/v1/orders/[id] (UC06)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(_req);
  if (isAuthError(auth)) return auth;

  const o = mockStore.orders.find((x) => x.id === params.id);
  if (!o) return NextResponse.json({ message: 'Order not found', code: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json(o);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const idx = mockStore.orders.findIndex((o) => o.id === params.id);
  if (idx === -1) return NextResponse.json({ message: 'Order not found', code: 'NOT_FOUND' }, { status: 404 });
  if (mockStore.orders[idx].status === 'COMPLETED') {
    return NextResponse.json({ message: 'Cannot cancel completed order', code: 'INVALID_STATE' }, { status: 409 });
  }
  mockStore.orders[idx] = { ...mockStore.orders[idx], status: 'CANCELLED', updatedAt: new Date().toISOString() };
  return NextResponse.json(mockStore.orders[idx]);
}
