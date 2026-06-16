// =====================================================
// PCMS - API Endpoints (centralized paths)
// =====================================================

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',

  // Users
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,

  // Branches
  BRANCHES: '/branches',
  BRANCH_DETAIL: (id: string) => `/branches/${id}`,

  // Medicines
  MEDICINES: '/medicines',
  MEDICINE_DETAIL: (id: string) => `/medicines/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,

  // Suppliers
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAIL: (id: string) => `/suppliers/${id}`,

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_LOW_STOCK: '/inventory/low-stock',
  INVENTORY_IMPORT: '/inventory/import',
  INVENTORY_EXPORT: '/inventory/export',
  INVENTORY_TRANSFER: '/inventory/transfer',

  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ORDER_PAY: (id: string) => `/orders/${id}/pay`,

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: (id: string) => `/payments/${id}`,

  // Prescriptions
  PRESCRIPTIONS: '/prescriptions',

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,

  // Reports
  REPORT_REVENUE: '/reports/revenue',
  REPORT_INVENTORY: '/reports/inventory',

  // Search
  SEARCH: '/search',
} as const;
