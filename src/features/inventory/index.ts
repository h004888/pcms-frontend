// =====================================================
// PCMS - Inventory feature barrel (P1.10)
// =====================================================

export { default as InventoryList } from './components/InventoryList';
export { InventoryForm } from './components/InventoryForm';
export { ImportStockForm } from './components/ImportStockForm';
export { ExportStockForm } from './components/ExportStockForm';
export { InventoryTransferWizard } from './components/InventoryTransferWizard';
export * from './services/inventoryService';
export type {
  InventoryBatch,
  InventoryBatchStatus,
  CreateInventoryBatchRequest,
  UpdateInventoryBatchRequest,
} from './types';
