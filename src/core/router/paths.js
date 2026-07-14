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
  PRODUCT: (id) => `/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: (orderNumber) => `/order-success/${orderNumber}`,
  ORDER_TRACKING: '/order-tracking',
  STORES: '/stores',

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

  // ── Inventory ───────────────────────────────────────────
  INVENTORY: '/inventory',
  INVENTORY_IMPORT: '/inventory/import',
  INVENTORY_EXPORT: '/inventory/export',
  INVENTORY_TRANSFER: '/inventory/transfer',
  INVENTORY_ALERTS: '/inventory/alerts',
  INVENTORY_HISTORY: '/inventory/history',
  INVENTORY_BATCH: (id) => `/inventory/batches/${id}`,
}
