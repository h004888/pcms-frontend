// =====================================================
// PCMS - Suppliers feature barrel (P1.9)
// =====================================================

export { default as SupplierForm, type SupplierFormProps } from './components/SupplierForm';
export { SuppliersView } from './components/SuppliersView';
export * from './services/supplierService';
export type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from './types';