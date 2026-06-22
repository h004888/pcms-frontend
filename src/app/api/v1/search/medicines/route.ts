// =====================================================
// PCMS - Mock BFF: /api/v1/search/medicines (UC10)
// Medicine-only autocomplete — kept for backward compat
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!q) return NextResponse.json([]);

  const results = mockStore.medicines
    .filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        ((m as any).activeIngredient || '').toLowerCase().includes(q)
    )
    .slice(0, limit);

  return NextResponse.json(results);
}
