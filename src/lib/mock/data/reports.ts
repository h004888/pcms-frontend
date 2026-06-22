// =====================================================
// PCMS - Mock Reports seed (10 records)
// Pre-computed revenue/inventory/sales reports
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_BRANCHES } from './branches';

export type ReportType = 'REVENUE' | 'INVENTORY' | 'SALES' | 'PRESCRIPTION' | 'CUSTOMER' | 'PROFIT';
export type ReportFormat = 'EXCEL' | 'PDF' | 'CSV';
export type ReportStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';

export interface MockReport {
  id: string;
  reportNumber: string;       // RPT-YYYYMMDD-####
  type: ReportType;
  title: string;
  branchId: string | null;
  branchName: string | null;
  periodFrom: string;         // YYYY-MM-DD
  periodTo: string;
  format: ReportFormat;
  status: ReportStatus;
  totalAmount?: number;
  totalCount?: number;
  generatedBy: string;
  generatedByName: string;
  fileUrl?: string;
  generatedAt: string;
}

const branches = SEED_BRANCHES;
const generators = [
  { id: 'staff-001', name: 'Nguyễn Văn A' },
  { id: 'staff-002', name: 'Trần Thị B' },
  { id: 'admin-001', name: 'System Administrator' },
];

const titles: Record<ReportType, string> = {
  REVENUE: 'Báo cáo doanh thu',
  INVENTORY: 'Báo cáo tồn kho',
  SALES: 'Báo cáo bán hàng',
  PRESCRIPTION: 'Báo cáo đơn thuốc',
  CUSTOMER: 'Báo cáo khách hàng',
  PROFIT: 'Báo cáo lợi nhuận',
};

const types: ReportType[] = ['REVENUE', 'INVENTORY', 'SALES', 'PRESCRIPTION', 'CUSTOMER'];
const formats: ReportFormat[] = ['EXCEL', 'PDF', 'CSV'];
const statuses: ReportStatus[] = ['READY', 'READY', 'READY', 'GENERATING', 'FAILED'];

const NOW = new Date('2026-06-22T10:00:00Z');

export const SEED_REPORTS: MockReport[] = Array.from({ length: 10 }, (_, i) => {
  const t = types[i % types.length];
  const f = formats[i % formats.length];
  const s = statuses[i % statuses.length];
  const b = i % 2 === 0 ? null : branches[i % branches.length];
  const g = generators[i % generators.length];
  const daysAgo = i * 3;
  const from = new Date(NOW.getTime() - (daysAgo + 30) * 24 * 3600 * 1000);
  const to = new Date(NOW.getTime() - daysAgo * 24 * 3600 * 1000);
  const date = new Date(NOW.getTime() - daysAgo * 24 * 3600 * 1000);
  return {
    id: uuid(),
    reportNumber: `RPT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`,
    type: t,
    title: `${titles[t]} ${b ? `- ${b.name}` : '- Toàn hệ thống'}`,
    branchId: b?.id ?? null,
    branchName: b?.name ?? null,
    periodFrom: from.toISOString().slice(0, 10),
    periodTo: to.toISOString().slice(0, 10),
    format: f,
    status: s,
    totalAmount: t === 'REVENUE' || t === 'SALES' || t === 'PROFIT' ? 100000000 + i * 25000000 : undefined,
    totalCount: 50 + i * 12,
    generatedBy: g.id,
    generatedByName: g.name,
    fileUrl: s === 'READY' ? `/mock-files/reports/${t.toLowerCase()}-${i + 1}.${f.toLowerCase()}` : undefined,
    generatedAt: date.toISOString(),
  };
});
