// =====================================================
// PCMS - Categories feature barrel (P1.7)
// =====================================================

export { default as CategoryForm, type CategoryFormProps } from './components/CategoryForm';
export { CategoriesView } from './components/CategoriesView';
export * from './services/categoryService';
export type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './types';
