// =====================================================
// PCMS - Categories feature types
// =====================================================

import type { UUID, ISODate } from '@/types/common';

export interface Category {
  id: UUID;
  code: string;
  name: string;
  slug?: string;
  description?: string;
  parentId: UUID | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export type CreateCategoryRequest = Omit<
  Category,
  'id' | 'createdAt' | 'updatedAt'
> & {
  code?: string;
  parentId?: UUID | null;
};

export type UpdateCategoryRequest = Partial<
  Pick<Category, 'name' | 'description' | 'code' | 'parentId'>
>;
