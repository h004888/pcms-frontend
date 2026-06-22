// =====================================================
// PCMS - Mock BFF: /api/v1/notifications (UC13)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, paginate, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);

  // Only show notifications addressed to current user (unless admin)
  const recipientId = searchParams.get('recipientId');
  let result = mockStore.notifications;
  if (auth.role !== 'ADMIN' || recipientId === 'me') {
    result = result.filter((n) => n.recipientId === auth.userId);
  } else if (recipientId) {
    result = result.filter((n) => n.recipientId === recipientId);
  }

  // Filter by status
  const status = searchParams.get('status');
  if (status) result = result.filter((n) => n.status === status);

  return NextResponse.json(paginate(result, page, size));
}
