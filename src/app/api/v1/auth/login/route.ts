// =====================================================
// PCMS - Mock BFF: POST /api/v1/auth/login
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { signMockJwt } from '@/lib/mock/jwt';
import { mockDelay } from '@/lib/mock/handlers';

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  await mockDelay();

  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: 'Body không hợp lệ', code: 'BAD_REQUEST' },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Thiếu email hoặc mật khẩu', code: 'MISSING_CREDENTIALS' },
      { status: 400 }
    );
  }

  const user = mockStore.users.find((u) => u.email.toLowerCase() === email);
  if (!user) {
    return NextResponse.json(
      { message: 'Email hoặc mật khẩu không đúng', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
    );
  }

  if (user.status === 'LOCKED') {
    return NextResponse.json(
      { message: 'Tài khoản đã bị khóa', code: 'ACCOUNT_LOCKED' },
      { status: 403 }
    );
  }

  if (user.status === 'INACTIVE') {
    return NextResponse.json(
      { message: 'Tài khoản đã bị vô hiệu hóa', code: 'ACCOUNT_INACTIVE' },
      { status: 403 }
    );
  }

  // Mock chấp nhận 2 password scheme:
  // - admin@pcms.vn / ceo@pcms.vn / manager.* → admin123
  // - pharmacist*@pcms.vn / customer → pharma123
  const expected =
    user.role === 'PHARMACIST' || user.role === 'CUSTOMER'
      ? 'pharma123'
      : 'admin123';
  if (password !== expected) {
    return NextResponse.json(
      { message: 'Email hoặc mật khẩu không đúng', code: 'INVALID_CREDENTIALS' },
      { status: 401 }
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
  const refreshToken = signMockJwt(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId ?? undefined,
    },
    60 * 60 * 24 * 7 // 7 days
  );

  return NextResponse.json({
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      branchId: user.branchId,
      status: user.status,
    },
  });
}
