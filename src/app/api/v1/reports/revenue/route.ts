// =====================================================
// PCMS - Mock BFF: /api/v1/reports/revenue (UC09) - aggregated
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;
  if (auth.role === 'CUSTOMER' || auth.role === 'PHARMACIST') {
    return NextResponse.json({ message: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 });
  }

  // Aggregate from PAID + COMPLETED orders
  const paidOrders = mockStore.orders.filter((o) => o.status === 'PAID' || o.status === 'COMPLETED');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = paidOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Per-branch breakdown
  const byBranch = mockStore.branches.map((b) => {
    const branchOrders = paidOrders.filter((o) => o.branchId === b.id);
    return {
      branchId: b.id,
      branchName: b.name,
      revenue: branchOrders.reduce((s, o) => s + o.total, 0),
      orderCount: branchOrders.length,
    };
  });

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    avgOrderValue,
    byBranch,
    generatedAt: new Date().toISOString(),
  });
}
