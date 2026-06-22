// =====================================================
// PCMS - Mock BFF: /api/v1/reports (UC09)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, paginate, filterBy, requireAuth, isAuthError, newId } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER' || auth.role === 'PHARMACIST') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);
  const type = searchParams.get('type');

  let result = filterBy(mockStore.reports, searchParams, ['reportNumber', 'title', 'branchName']);
  if (type) result = result.filter((r) => r.type === type);

  return NextResponse.json(paginate(result, page, size));
}

export async function POST(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER' || auth.role === 'PHARMACIST') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json();
  const now = new Date().toISOString();
  const newReport = {
    id: newId(),
    reportNumber: `RPT-${now.slice(0, 10).replace(/-/g, '')}-${String(mockStore.reports.length + 1).padStart(4, '0')}`,
    type: body.type || 'REVENUE',
    title: body.title || 'Báo cáo mới',
    branchId: body.branchId ?? null,
    branchName: body.branchName ?? null,
    periodFrom: body.periodFrom || now.slice(0, 10),
    periodTo: body.periodTo || now.slice(0, 10),
    format: body.format || 'PDF',
    status: 'GENERATING' as const,
    generatedBy: auth.userId,
    generatedByName: auth.userId,
    generatedAt: now,
  };
  mockStore.reports.unshift(newReport);
  return NextResponse.json(newReport, { status: 201 });
}
