// =====================================================
// PCMS - Mock BFF: /api/v1/search (UC10) - global search
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import { mockDelay, requireAuth, isAuthError } from '@/lib/mock/handlers';

export async function GET(req: NextRequest) {
  await mockDelay();
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const { searchParams } = req.nextUrl;
  const q = (searchParams.get('q') || searchParams.get('query') || '').toLowerCase().trim();
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!q) {
    return NextResponse.json({
      medicines: [],
      customers: [],
      orders: [],
      prescriptions: [],
    });
  }

  const medicines = mockStore.medicines
    .filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        (m as any).activeIngredient?.toLowerCase().includes(q)
    )
    .slice(0, limit);

  const customers = mockStore.customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    )
    .slice(0, limit);

  const orders = mockStore.orders
    .filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))
    .slice(0, limit);

  const prescriptions = mockStore.prescriptions
    .filter(
      (p) =>
        p.prescriptionNumber.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q)
    )
    .slice(0, limit);

  return NextResponse.json({ medicines, customers, orders, prescriptions, total: medicines.length + customers.length + orders.length + prescriptions.length });
}
