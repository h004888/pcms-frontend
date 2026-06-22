// =====================================================
// PCMS - Mock BFF: /api/v1/payments/[id] (UC07)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(_req);
  if (isAuthError(auth)) return auth;

  const p = mockStore.payments.find((x) => x.id === params.id);
  if (!p) return NextResponse.json({ message: 'Payment not found', code: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json(p);
}
