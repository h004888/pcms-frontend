// =====================================================
// PCMS - Mock BFF: /api/v1/prescriptions/[id] (UC12)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(_req);
  if (isAuthError(auth)) return auth;

  const rx = mockStore.prescriptions.find((p) => p.id === params.id);
  if (!rx) return NextResponse.json({ message: 'Prescription not found', code: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json(rx);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'ADMIN' && auth.role !== 'BRANCH_MANAGER') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const idx = mockStore.prescriptions.findIndex((p) => p.id === params.id);
  if (idx === -1) return NextResponse.json({ message: 'Prescription not found', code: 'NOT_FOUND' }, { status: 404 });
  if (mockStore.prescriptions[idx].status === 'SIGNED') {
    return NextResponse.json({ message: 'Cannot delete signed prescription', code: 'INVALID_STATE' }, { status: 409 });
  }
  mockStore.prescriptions[idx] = { ...mockStore.prescriptions[idx], status: 'CANCELLED', updatedAt: new Date().toISOString() };
  return NextResponse.json(mockStore.prescriptions[idx]);
}
