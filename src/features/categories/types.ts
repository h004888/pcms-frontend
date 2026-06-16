// =====================================================
// PCMS - Categories feature types
// =====================================================

import type { UUID, ISODate } from '@/types/common';

export interface Category {
  id: UUID;
  name: string;
  description?: string;
  createdAt: ISODate;
}
