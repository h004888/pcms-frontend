// =====================================================
// PCMS - Inventory feature types (UC05)
// =====================================================

import type { UUID, ISODate } from '@/types/common';

export type InventoryBatchStatus =
  | 'ACTIVE'
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED';

export interface InventoryBatch {
  id: UUID;
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  barcode?: string;
  qtyOnHand: number;
  expiryDate: string; // YYYY-MM-DD
  minStockLevel: number;
  receivedAt: ISODate;
  status?: InventoryBatchStatus;
}

export type CreateInventoryBatchRequest = Omit<
  InventoryBatch,
  'id' | 'receivedAt' | 'status'
> & {
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  qtyOnHand: number;
  expiryDate: string;
};

export type UpdateInventoryBatchRequest = Partial<
  Pick<
    InventoryBatch,
    | 'batchNo'
    | 'barcode'
    | 'qtyOnHand'
    | 'expiryDate'
    | 'minStockLevel'
    | 'status'
  >
>;