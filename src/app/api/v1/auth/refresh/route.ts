// =====================================================
// PCMS - Mock BFF: POST /api/v1/auth/refresh
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { signMockJwt, verifyMockJwt } from '@/lib/mock/jwt';
import { mockDelay } from '@/lib/mock/handlers';

interface RefreshBody {
  refreshToken?: string;
}

export async function POST(req: NextRequest) {
  await mockDelay();

  let body: RefreshBody;
  try {
    body = (await req.json()) as RefreshBody;
  } catch {
    return NextResponse.json(
      { message: 'Body không hợp lệ', code: 'BAD_REQUEST' },
      { status: 400 }
    );
  }

  const token = body.refreshToken;
  if (!token) {
    return NextResponse.json(
      { message: 'Thiếu refreshToken', code: 'MISSING_TOKEN' },
      { status: 400 }
    );
  }

  const payload = verifyMockJwt(token);
  if (!payload) {
    return NextResponse.json(
      { message: 'Refresh token không hợp lệ hoặc đã hết hạn', code: 'TOKEN_EXPIRED' },
      { status: 401 }
    );
  }

  const user = mockStore.users.find((u) => u.id === payload.sub);
  if (!user || user.status !== 'ACTIVE') {
    return NextResponse.json(
      { message: 'Tài khoản không khả dụng', code: 'ACCOUNT_INACTIVE' },
      { status: 403 }
    );
  }

  const accessToken = signMockJwt(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId ?? undefined,
    },
    3600
  );

  return NextResponse.json({
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
  });
}
