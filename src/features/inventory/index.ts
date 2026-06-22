// =====================================================
// PCMS - Inventory feature barrel (P1.10)
// =====================================================

export { default as InventoryList } from './components/InventoryList';
export { default as InventoryForm } from './components/InventoryForm';
export * from './services/inventoryService';
export type {
  InventoryBatch,
  InventoryBatchStatus,
  CreateInventoryBatchRequest,
  UpdateInventoryBatchRequest,
} from './types';