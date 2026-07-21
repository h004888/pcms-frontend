/**
 * Centralized route paths for the entire PCMS application.
 *
 * Static paths are plain strings for use with <Link to={ROUTES.X} />.
 * Dynamic paths are functions that return a string for use with
 * <Link to={ROUTES.X(id)} /> or navigate(ROUTES.X(id)).
 */
export const ROUTES = {
  // ── B2C Shop (customer-facing) ──────────────────────────
  HOME: '/',
  SEARCH: '/search',
  PRODUCT: (slug) => `/product/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: (orderNumber) => `/order-success/${orderNumber}`,
  PAYMENT_PENDING: (orderNumber) => `/payment/pending/${orderNumber}`,
  ORDER_TRACKING: '/order-tracking',
  STORES: '/stores',
  MY_ACCOUNT: '/my-account',
  MY_ORDERS: '/my-orders',
  ORDER_DETAIL: (id) => `/my-orders/${id}`,

  // ── Auth ────────────────────────────────────────────────
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // ── Admin Dashboard ─────────────────────────────────────
  DASHBOARD: '/user-dashboard',
  USERS: '/users',
  USER_NEW: '/users/new',
  USER_DETAIL: (id) => `/users/${id}`,
  USER_EDIT: (id) => `/users/${id}/edit`,
  AUDIT_LOGS: '/audit-logs',

  // ── Branch Management ───────────────────────────────────
  BRANCHES: '/branches',
  BRANCH_NEW: '/branches/new',
  BRANCH_DETAIL: (id) => `/branches/${id}`,
  BRANCH_EDIT: (id) => `/branches/${id}/edit`,

  // ── Medicine Catalog ────────────────────────────────────
  MEDICINES: '/medicines',
  MEDICINE_NEW: '/medicines/new',
  MEDICINE_DETAIL: (id) => `/medicines/${id}`,
  MEDICINE_EDIT: (id) => `/medicines/${id}/edit`,

  // ── Customer Management ─────────────────────────────────
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id) => `/customers/${id}`,

  // ── Order Management ────────────────────────────────────
  ORDERS: '/orders',
  ORDER_NEW: '/orders/new',
  ADMIN_ORDER_DETAIL: (id) => `/orders/${id}`,

  // ── Payment Management ───────────────────────────────────
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: (id) => `/payments/${id}`,

  // ── Inventory ───────────────────────────────────────────
  INVENTORY: '/inventory',
  INVENTORY_STOCKS: '/inventory/stocks',
  INVENTORY_IMPORT: '/inventory/import',
  INVENTORY_EXPORT: '/inventory/export',
  INVENTORY_TRANSFER: '/inventory/transfer',
  INVENTORY_TRANSFER_APPROVAL: '/inventory/transfer-approval',
  INVENTORY_ALERTS: '/inventory/alerts',
  INVENTORY_HISTORY: '/inventory/history',
  INVENTORY_BATCH: (id) => `/inventory/batches/${id}`,

  // ── Notifications ───────────────────────────────────────
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_ADMIN: '/dashboard/notifications',
  NOTIFICATIONS_COMPOSE: '/dashboard/notifications/compose',

  // ── Analytics ───────────────────────────────────────────
  ANALYTICS: '/analytics',

  // ── Reports ─────────────────────────────────────────────
  REPORTS: '/dashboard/reports',

  // ── Supplier Management ─────────────────────────────────
  SUPPLIERS: '/dashboard/suppliers',

  // ── Prescription ────────────────────────────────────────
  PRESCRIPTIONS: '/dashboard/prescriptions',
}
