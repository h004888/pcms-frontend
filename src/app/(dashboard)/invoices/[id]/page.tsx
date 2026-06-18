// =====================================================
// PCMS - Invoice Page (SCR-INVOICE · UC07)
// Route: /invoices/[id] — id ở đây là orderId
// =====================================================

import { InvoiceView } from '@/features/orders';

export default function InvoicePage({ params }: { params: { id: string } }) {
  return <InvoiceView />;
}
