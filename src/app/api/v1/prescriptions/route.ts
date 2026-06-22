// =====================================================
// PCMS - Mock BFF: /api/v1/prescriptions (UC12)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, paginate, filterBy, requireAuth, isAuthError, newId } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);
  const status = searchParams.get('status');

  const filtered = filterBy(mockStore.prescriptions, searchParams, ['prescriptionNumber', 'patientName', 'doctorName', 'diagnosis']);
  const after = status ? filtered.filter((p) => p.status === status) : filtered;

  return NextResponse.json(paginate(after, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role !== 'PHARMACIST' && auth.role !== 'BRANCH_MANAGER' && auth.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json();
  const now = new Date().toISOString();
  const newRx = {
    id: newId(),
    prescriptionNumber: `RX-${now.slice(0, 10).replace(/-/g, '')}-${String(mockStore.prescriptions.length + 1).padStart(4, '0')}`,
    patientId: body.patientId,
    patientName: body.patientName || '',
    patientPhone: body.patientPhone || '',
    doctorId: auth.userId,
    doctorName: body.doctorName || auth.userId,
    branchId: body.branchId,
    branchName: body.branchName || '',
    diagnosis: body.diagnosis || '',
    items: body.items ?? [],
    status: 'DRAFT' as const,
    signedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  mockStore.prescriptions.unshift(newRx);
  return NextResponse.json(newRx, { status: 201 });
}
