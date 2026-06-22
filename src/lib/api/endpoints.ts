// =====================================================
// PCMS - API Endpoints (centralized paths)
// Phase 1.5: thêm 30+ endpoints mới cho 9 services còn lại.
// =====================================================

export const API_ENDPOINTS = {
  // ============= Auth =============
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',

  // ============= Users =============
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,

  // ============= Branches =============
  BRANCHES: '/branches',
  BRANCH_DETAIL: (id: string) => `/branches/${id}`,

  // ============= Medicines =============
  MEDICINES: '/medicines',
  MEDICINE_DETAIL: (id: string) => `/medicines/${id}`,

  // ============= Categories (UC04) =============
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,

  // ============= Suppliers (UC11) =============
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAIL: (id: string) => `/suppliers/${id}`,

  // ============= Customers =============
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,

  // ============= Inventory (UC05) =============
  INVENTORY: '/inventory',
  INVENTORY_DETAIL: (id: string) => `/inventory/${id}`,
  INVENTORY_LOW_STOCK: '/inventory/low-stock',
  INVENTORY_IMPORT: '/inventory/import',
  INVENTORY_EXPORT: '/inventory/export',
  INVENTORY_TRANSFER: '/inventory/transfer',
  INVENTORY_BATCHES: '/inventory/batches',

  // ============= Orders (UC06) =============
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  ORDER_PAY: (id: string) => `/orders/${id}/pay`,

  // ============= Payments (UC07) =============
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: (id: string) => `/payments/${id}`,
  PAYMENT_INVOICE: (id: string) => `/payments/${id}/invoice`,

  // ============= Prescriptions (UC12) =============
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_DETAIL: (id: string) => `/prescriptions/${id}`,
  PRESCRIPTION_SIGN: (id: string) => `/prescriptions/${id}/sign`,

  // ============= Notifications (UC13) =============
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_DETAIL: (id: string) => `/notifications/${id}`,
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,

  // ============= Reports (UC09) =============
  REPORTS: '/reports',
  REPORT_REVENUE: '/reports/revenue',
  REPORT_INVENTORY: '/reports/inventory',
  REPORT_EXPORT_EXCEL: '/reports/export/excel',
  REPORT_EXPORT_PDF: '/reports/export/pdf',

  // ============= Search =============
  SEARCH: '/search',
  SEARCH_MEDICINES: '/search/medicines',
} as const;
