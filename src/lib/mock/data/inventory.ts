// =====================================================
// PCMS - Mock Inventory batches seed (25 records)
// Phân bổ theo 5 chi nhánh × nhiều thuốc + số lô + hạn dùng
// Status: ACTIVE / LOW_STOCK / EXPIRING_SOON / EXPIRED
// =====================================================

import { v4 as uuid } from '@/lib/mock/uuid';
import { SEED_MEDICINES } from './medicines';
import { SEED_BRANCHES } from './branches';

export type InventoryBatchStatus =
  | 'ACTIVE'
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED';

export interface MockInventoryBatch {
  id: string;
  medicineId: string;
  branchId: string;
  batchNo: string;
  barcode: string;
  qtyOnHand: number;
  expiryDate: string; // YYYY-MM-DD
  minStockLevel: number;
  receivedAt: string;
  status: InventoryBatchStatus;
}

// Helper: derive status từ qtyOnHand vs minStockLevel + expiryDate
function deriveStatus(
  qty: number,
  minStock: number,
  expiryDate: string,
  now: Date = new Date('2026-06-22T10:00:00Z')
): InventoryBatchStatus {
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'EXPIRED';
  const monthsToExpiry =
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsToExpiry <= 3) return 'EXPIRING_SOON';
  if (qty <= minStock) return 'LOW_STOCK';
  return 'ACTIVE';
}

function batch(
  medicineIdx: number,
  branchIdx: number,
  batchNo: string,
  qty: number,
  expiryDate: string,
  receivedAt: string,
  minStock = 20
): MockInventoryBatch {
  const medicine = SEED_MEDICINES[medicineIdx];
  const branch = SEED_BRANCHES[branchIdx];
  if (!medicine || !branch) {
    throw new Error(`Invalid medicineIdx/branchIdx: ${medicineIdx}/${branchIdx}`);
  }
  const expiryISO = expiryDate;
  return {
    id: uuid(),
    medicineId: medicine.id,
    branchId: branch.id,
    batchNo,
    barcode: `${medicine.sku}-${batchNo}`,
    qtyOnHand: qty,
    expiryDate: expiryISO,
    minStockLevel: minStock,
    receivedAt,
    status: deriveStatus(qty, minStock, expiryISO),
  };
}

export const SEED_INVENTORY_BATCHES: MockInventoryBatch[] = [
  // ============ Branch HCM-Q1 ============
  batch(0, 0, 'LOT-DHG-2601', 120, '2027-12-31', '2026-01-15T09:00:00Z', 30),
  batch(1, 0, 'LOT-DHG-2602', 80, '2027-08-30', '2026-01-20T09:00:00Z', 30),
  batch(2, 0, 'LOT-IMP-2601', 250, '2027-06-30', '2026-02-01T09:00:00Z', 50),
  batch(7, 0, 'LOT-IMP-2602', 45, '2026-09-15', '2026-02-10T09:00:00Z', 20), // expiring soon
  batch(11, 0, 'LOT-TRP-2601', 200, '2027-04-30', '2026-03-01T09:00:00Z', 50),
  batch(15, 0, 'LOT-IMP-2603', 12, '2027-12-31', '2026-03-15T09:00:00Z', 50), // low stock

  // ============ Branch HCM-Bình Thạnh ============
  batch(3, 1, 'LOT-IMP-2604', 180, '2027-10-31', '2026-01-25T09:00:00Z', 40),
  batch(4, 1, 'LOT-TRP-2602', 95, '2026-08-15', '2026-02-05T09:00:00Z', 30), // expiring
  batch(8, 1, 'LOT-IMP-2605', 8, '2027-05-31', '2026-02-20T09:00:00Z', 20), // low stock
  batch(10, 1, 'LOT-DHG-2603', 60, '2027-09-30', '2026-03-10T09:00:00Z', 20),
  batch(13, 1, 'LOT-IMP-2606', 25, '2028-02-28', '2026-03-20T09:00:00Z', 15),

  // ============ Branch HN-Hoàn Kiếm ============
  batch(5, 2, 'LOT-DHG-2604', 150, '2025-12-31', '2026-01-10T09:00:00Z', 40), // expired
  batch(6, 2, 'LOT-IMP-2607', 320, '2027-11-30', '2026-02-15T09:00:00Z', 60),
  batch(9, 2, 'LOT-TRP-2603', 70, '2026-07-30', '2026-02-25T09:00:00Z', 25), // expiring
  batch(14, 2, 'LOT-IMP-2608', 100, '2028-01-31', '2026-03-25T09:00:00Z', 30),
  batch(16, 2, 'LOT-IMP-2609', 220, '2027-07-31', '2026-04-05T09:00:00Z', 50),

  // ============ HN-Cầu Giấy ============
  batch(17, 3, 'LOT-IMP-2610', 90, '2026-10-31', '2026-01-30T09:00:00Z', 25), // expiring
  batch(18, 3, 'LOT-IMP-2611', 40, '2027-12-31', '2026-02-10T09:00:00Z', 30),
  batch(19, 3, 'LOT-IMP-2612', 65, '2027-09-30', '2026-03-01T09:00:00Z', 25),
  batch(20, 3, 'LOT-IMP-2613', 110, '2028-03-31', '2026-04-10T09:00:00Z', 35),
  batch(21, 3, 'LOT-DHG-2605', 75, '2026-09-30', '2026-04-15T09:00:00Z', 25), // expiring

  // ============ DN-Hải Châu ============
  batch(22, 4, 'LOT-TRP-2604', 18, '2027-12-31', '2026-03-15T09:00:00Z', 20), // low stock
  batch(23, 4, 'LOT-IMP-2614', 55, '2027-08-31', '2026-03-20T09:00:00Z', 25),
  batch(26, 4, 'LOT-DHG-2606', 300, '2028-06-30', '2026-04-01T09:00:00Z', 100),
  batch(28, 4, 'LOT-IMP-2615', 5, '2027-04-30', '2026-04-20T09:00:00Z', 30), // low stock
];