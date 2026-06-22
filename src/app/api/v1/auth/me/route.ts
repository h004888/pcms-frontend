// =====================================================
// PCMS - Mock BFF: GET /api/v1/auth/me
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();

  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const user = mockStore.users.find((u) => u.id === auth.userId);
  if (!user) {
    return NextResponse.json(
      { message: 'User not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    branchId: user.branchId,
    status: user.status,
    phone: user.phone,
    permissions:
      user.role === 'ADMIN' || user.role === 'CEO'
        ? ['*']
        : user.role === 'BRANCH_MANAGER'
          ? ['read:*', 'write:branch:*']
          : ['read:dashboard', 'read:medicines', 'write:orders'],
  });
}
