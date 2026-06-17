// =====================================================
// PCMS - Inventory feature barrel
// =====================================================

export { InventoryList } from './components/InventoryList';
export { ImportStockForm } from './components/ImportStockForm';
export { ExportStockForm } from './components/ExportStockForm';
export { InventoryTransferWizard } from './components/InventoryTransferWizard';
export * from './services/inventoryService';
export type {
  InventoryBatch,
  InventoryTransaction,
  ImportStockRequest,
  ExportStockRequest,
  TransferStockRequest,
  TransferStockResponse,
  ExportReason,
} from '../../types/inventory';
export { EXPORT_REASONS } from '../../types/inventory';
