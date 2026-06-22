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
import { SEED_INVENTORY_BATCHES, type MockInventoryBatch } from './data/inventory';
import { SEED_ORDERS, type MockOrder } from './data/orders';
import { SEED_PAYMENTS, type MockPayment } from './data/payments';
import { SEED_PRESCRIPTIONS, type MockPrescription } from './data/prescriptions';
import { SEED_NOTIFICATIONS, type MockNotification } from './data/notifications';
import { SEED_REPORTS, type MockReport } from './data/reports';

interface MockStore {
  users: MockUser[];
  medicines: MockMedicine[];
  customers: MockCustomer[];
  branches: MockBranch[];
  categories: MockCategory[];
  suppliers: MockSupplier[];
  inventoryBatches: MockInventoryBatch[];
  orders: MockOrder[];
  payments: MockPayment[];
  prescriptions: MockPrescription[];
  notifications: MockNotification[];
  reports: MockReport[];
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
    inventoryBatches: [...SEED_INVENTORY_BATCHES],
    orders: [...SEED_ORDERS],
    payments: [...SEED_PAYMENTS],
    prescriptions: [...SEED_PRESCRIPTIONS],
    notifications: [...SEED_NOTIFICATIONS],
    reports: [...SEED_REPORTS],
  });

export type {
  MockUser, MockMedicine, MockCustomer, MockBranch, MockCategory, MockSupplier,
  MockInventoryBatch, MockOrder, MockPayment, MockPrescription, MockNotification, MockReport,
};
