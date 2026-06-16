// =====================================================
// PCMS - Inventory feature types (UC05)
// =====================================================

import type { UUID, ISODate, TransactionType } from './common';

export interface InventoryBatch {
  id: UUID;
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  qtyOnHand: number;
  expiryDate: string;
  minStockLevel: number;
  receivedAt: ISODate;
}

export interface InventoryTransaction {
  id: UUID;
  batchId: UUID;
  type: TransactionType;
  qty: number;
  reason?: string;
  refId?: UUID;
  actorId: UUID;
  createdAt: ISODate;
}

export type ImportStockRequest = {
  medicineId: UUID;
  branchId: UUID;
  batchNo: string;
  qty: number;
  expiryDate: string;
  actorId: UUID;
  poRef?: UUID;
};

export type ExportStockRequest = {
  medicineId: UUID;
  branchId: UUID;
  qty: number;
  reason: string;
  actorId: UUID;
};
