// =====================================================
// PCMS - Mock BFF: /api/v1/payments (UC07)
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
  const orderId = searchParams.get('orderId');

  let result = filterBy(mockStore.payments, searchParams, ['invoiceNumber', 'orderNumber', 'transactionRef']);
  if (status) result = result.filter((p) => p.status === status);
  if (orderId) result = result.filter((p) => p.orderId === orderId);

  return NextResponse.json(paginate(result, page, size));
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
  const order = mockStore.orders.find((o) => o.id === body.orderId);
  if (!order) {
    return NextResponse.json({ message: 'Order not found', code: 'NOT_FOUND' }, { status: 404 });
  }
  const isCash = body.paymentMethod === 'CASH';
  const newPay = {
    id: newId(),
    orderId: order.id,
    orderNumber: order.orderNumber,
    invoiceNumber: order.orderNumber.replace('ORD-', 'INV-'),
    paymentMethod: body.paymentMethod || 'CASH',
    amount: order.total,
    refundedAmount: 0,
    tenderedAmount: isCash ? Math.ceil(order.total / 10000) * 10000 : order.total,
    changeAmount: isCash ? Math.ceil(order.total / 10000) * 10000 - order.total : 0,
    transactionRef: body.transactionRef || (isCash ? '' : `TXN${Date.now()}`),
    status: 'SUCCESS' as const,
    cashierId: auth.userId,
    cashierName: auth.userId,
    createdAt: now,
  };
  mockStore.payments.unshift(newPay);
  // Mark order as PAID
  const oIdx = mockStore.orders.findIndex((o) => o.id === body.orderId);
  if (oIdx !== -1) {
    mockStore.orders[oIdx] = { ...mockStore.orders[oIdx], status: 'PAID', updatedAt: now };
  }
  return NextResponse.json(newPay, { status: 201 });
}
