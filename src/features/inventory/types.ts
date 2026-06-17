// =====================================================
// PCMS - Inventory feature types (UC05)
// Re-export từ @/types/inventory để giữ single source of truth
// (the new TransferStockRequest + EXPORT_REASONS được khai báo ở đó)
// =====================================================

export type {
  InventoryBatch,
  InventoryTransaction,
  ImportStockRequest,
  ExportStockRequest,
  TransferStockRequest,
  TransferStockResponse,
  ExportReason,
} from '@/types/inventory';
export { EXPORT_REASONS } from '@/types/inventory';
