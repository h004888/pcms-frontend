// =====================================================
// PCMS - Mock BFF handlers (shared utilities)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_API_DELAY_MS } from '@/lib/config/mock';
import { verifyMockJwt } from './jwt';

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
  branchId?: string;
}

/** Giả lập network delay */
export function mockDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, MOCK_API_DELAY_MS));
}

/** Page response shape khớp backend */
export function paginate<T>(
  items: T[],
  page: number,
  size: number
): {
  data: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
} {
  const start = page * size;
  return {
    data: items.slice(start, start + size),
    page,
    size,
    total: items.length,
    totalPages: Math.ceil(items.length / size),
  };
}

/** Lọc theo ?search=... trên các field cho phép */
export function filterBy<T>(
  items: T[],
  params: URLSearchParams,
  fields: (keyof T)[]
): T[] {
  const search = params.get('search')?.toLowerCase();
  if (!search) return items;
  return items.filter((i) =>
    fields.some((f) => String(i[f] ?? '').toLowerCase().includes(search))
  );
}

/** Kiểm tra Bearer token; trả về context hoặc 401 */
export function requireAuth(req: NextRequest): AuthContext | NextResponse {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
  const payload = verifyMockJwt(auth.slice(7));
  if (!payload) {
    return NextResponse.json(
      { message: 'Token expired or invalid', code: 'TOKEN_EXPIRED' },
      { status: 401 }
    );
  }
  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
    branchId: payload.branchId,
  };
}

export function isAuthError(r: AuthContext | NextResponse): r is NextResponse {
  return r instanceof NextResponse;
}

/** Tạo UUID v4 mới (client-side) */
export function newId(): string {
  // Use crypto.randomUUID if available, fallback to manual generator
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
