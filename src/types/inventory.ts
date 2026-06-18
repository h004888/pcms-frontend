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

/**
 * Lý do xuất kho chuẩn hoá (BR05 — lý do phải có khi xuất).
 * Enum này map sang danh sách chọn trong UI và lưu trong DB.
 */
export const EXPORT_REASONS = [
  { value: 'SALE', label: 'Bán hàng (ghi nhận doanh thu)' },
  { value: 'DAMAGED', label: 'Hư hỏng / vỡ' },
  { value: 'EXPIRED', label: 'Hết hạn dùng' },
  { value: 'INTERNAL_USE', label: 'Dùng nội bộ' },
  { value: 'RETURN', label: 'Trả nhà cung cấp' },
] as const;

export type ExportReason = (typeof EXPORT_REASONS)[number]['value'];

/**
 * Chuyển kho giữa hai chi nhánh (UC05 - SCR-INV-TRANSFER).
 * Backend dựa trên `batchId` để trừ tồn nguồn + cộng tồn đích theo đúng lô (FIFO).
 */
export type TransferStockRequest = {
  batchId: UUID;
  qty: number;
  fromBranchId: UUID;
  toBranchId: UUID;
  reason?: string;
  actorId: UUID;
};

export type TransferStockResponse = {
  sourceTransactionId: UUID;
  destinationTransactionId: UUID;
  batchNo: string;
  qty: number;
  fromBranch: { id: UUID; code: string; name: string };
  toBranch: { id: UUID; code: string; name: string };
  transferredAt: ISODate;
};
