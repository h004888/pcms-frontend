// =====================================================
// PCMS - Mock BFF: /api/v1/notifications/[id] (UC13)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(_req);
  if (isAuthError(auth)) return auth;

  const n = mockStore.notifications.find((x) => x.id === params.id);
  if (!n) return NextResponse.json({ message: 'Notification not found', code: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json(n);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.notifications.findIndex((n) => n.id === params.id);
  if (idx === -1) return NextResponse.json({ message: 'Notification not found', code: 'NOT_FOUND' }, { status: 404 });

  // Mark as READ
  mockStore.notifications[idx] = {
    ...mockStore.notifications[idx],
    status: 'READ',
    readAt: new Date().toISOString(),
  };
  return NextResponse.json(mockStore.notifications[idx]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const idx = mockStore.notifications.findIndex((n) => n.id === params.id);
  if (idx === -1) return NextResponse.json({ message: 'Notification not found', code: 'NOT_FOUND' }, { status: 404 });
  mockStore.notifications.splice(idx, 1);
  return NextResponse.json({ message: 'Deleted' });
}
