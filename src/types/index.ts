// =====================================================
// PCMS - Re-export all types (barrel file)
// Backward compatible - existing imports from '@/types' still work
// Note: InventoryBatchStatus comes from common.ts (line 36) to avoid conflict
// =====================================================

export * from './common';
export * from './auth';
export * from './user';
export * from './branch';
export * from './medicine';
export * from './supplier';
export * from './customer';
export {
  type InventoryBatch,
  type InventoryTransaction,
  type ImportStockRequest,
  type ExportStockRequest,
  type TransferStockRequest,
  type TransferStockResponse,
  EXPORT_REASONS,
  type ExportReason,
} from './inventory';
export * from './order';
export * from './prescription';
export * from './notification';
