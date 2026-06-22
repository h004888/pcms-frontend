// =====================================================
// PCMS - In-memory mock store (singleton, hot-reload safe)
// Dùng globalThis pattern để Next.js dev mode không reset state.
// =====================================================

import { SEED_USERS, type MockUser } from './data/users';
import { SEED_MEDICINES, type MockMedicine } from './data/medicines';
import { SEED_CUSTOMERS, type MockCustomer } from './data/customers';
import { SEED_BRANCHES, type MockBranch } from './data/branches';
import { SEED_CATEGORIES, type MockCategory } from './data/categories';
import { SEED_SUPPLIERS, type MockSupplier } from './data/suppliers';

interface MockStore {
  users: MockUser[];
  medicines: MockMedicine[];
  customers: MockCustomer[];
  branches: MockBranch[];
  categories: MockCategory[];
  suppliers: MockSupplier[];
}

declare global {
  // eslint-disable-next-line no-var
  var __pcms_mock_store: MockStore | undefined;
}

export const mockStore: MockStore =
  globalThis.__pcms_mock_store ??
  (globalThis.__pcms_mock_store = {
    users: [...SEED_USERS],
    medicines: [...SEED_MEDICINES],
    customers: [...SEED_CUSTOMERS],
    branches: [...SEED_BRANCHES],
    categories: [...SEED_CATEGORIES],
    suppliers: [...SEED_SUPPLIERS],
  });

export type { MockUser, MockMedicine, MockCustomer, MockBranch, MockCategory, MockSupplier };
