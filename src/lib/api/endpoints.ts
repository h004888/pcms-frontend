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

  // ============= Favorites =============
  FAVORITES: '/favorites',

  // ============= Points (SPRINT 0 FIX T02: redeem uses /wallet/redeem) =============
  POINTS: '/points',
  POINTS_REDEEM: '/wallet/redeem',

  // ============= Family =============
  FAMILY: '/family',
  FAMILY_MEMBER_DETAIL: (id: string) => `/family/${id}`,

  // ============= Addresses =============
  ADDRESSES: '/addresses',
  ADDRESS_DETAIL: (id: string) => `/addresses/${id}`,
  ADDRESS_SET_DEFAULT: (id: string) => `/addresses/${id}/set-default`,

  // ============= Profile (SPRINT 0 FIX T03: backend exposes profile under /customers/me) =============
  PROFILE: '/customers/me',
  PROFILE_AVATAR: '/profile/avatar',  // (Backend chưa hỗ trợ — placeholder, sẽ trả 404)

  // ============= Wallet =============
  WALLET: '/wallet',

  // ============= Articles (UC14 - SPRINT 0 FIX T01: backend uses /health-articles) =============
  ARTICLES: '/health-articles',
  ARTICLE_DETAIL: (slug: string) => `/health-articles/${slug}`,

  // ============= Users =============
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  // SPRINT 0 FIX T04: admin reset flows qua auth-level endpoint với header X-User-Id override
  USER_RESET_PASSWORD: '/auth/reset-password',

  // ============= Branches =============
  BRANCHES: '/branches',
  BRANCH_DETAIL: (id: string) => `/branches/${id}`,

  // ============= Medicines =============
  MEDICINES: '/medicines',
  MEDICINE_DETAIL: (id: string) => `/medicines/${id}`,
  MEDICINE_BY_SLUG: (slug: string) => `/medicines/slug/${slug}`,

  // ============= Categories (UC04) =============
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,

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

  // ============= Shop (customer-portal-service) =============
  SHOP_HOME: '/shop/home',
  SHOP_PDP: (id: string) => `/shop/pdp/${id}`,
  SHOP_SEARCH: '/shop/search',
  SHOP_LOOKUP_DRUG: '/shop/lookup/drug',
  SHOP_LOOKUP_INGREDIENT: '/shop/lookup/ingredient',
  SHOP_LOOKUP_HERB: '/shop/lookup/herb',

  // ============= Store locator (customer-portal-service) =============
  STORE_LOCATOR: '/store/locator',
  STORE_DETAIL: (id: string) => `/store/locator/${id}`,

  // ============= Diseases (customer-portal-service) =============
  DISEASES: '/diseases',
  DISEASE_DETAIL: (slug: string) => `/diseases/${slug}`,

  // ============= Cart (customer-portal-service) =============
  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CART_ITEM_DETAIL: (itemId: string) => `/cart/items/${itemId}`,
  CART_CHECKOUT_PREVIEW: '/cart/checkout/preview',
  CART_CHECKOUT_CONFIRM: '/cart/checkout/confirm',

  // ============= Vouchers (customer-portal-service) =============
  VOUCHERS: '/vouchers',
  VOUCHERS_APPLY: '/vouchers/apply',
  VOUCHERS_HISTORY: '/vouchers/history',

  // ============= Order tracking (customer-portal-service) =============
  ORDER_TRACK: (id: string) => `/orders/${id}/track`,
  ORDER_HISTORY: '/orders/history',

  // ============= Wallet (customer-portal-service) =============
  WALLET_TRANSACTIONS: '/wallet/transactions',
  WALLET_REDEEM: '/wallet/redeem',

  // ============= Vaccines (customer-portal-service) =============
  VACCINES: '/vaccines',
  VACCINE_SLOTS: (id: string) => `/vaccines/${id}/slots`,
  VACCINE_BOOKINGS: '/vaccine-bookings',
  VACCINE_BOOKINGS_ME: '/vaccine-bookings/me',
  VACCINE_BOOKING_DETAIL: (id: string) => `/vaccine-bookings/${id}`,
  VACCINATION_LEDGER_ME: '/vaccination-ledger/me',

  // ============= Verify origin (customer-portal-service) =============
  VERIFY_ORIGIN_SCAN: '/verify-origin/scan',

  // ============= Installment (customer-portal-service) =============
  INSTALLMENT_QUOTE: '/installment/quote',
  INSTALLMENT_CONFIRM: '/installment/confirm',

  // ============= Consultations (pharmacist-workbench) =============
  CONSULTATIONS: '/consultations',
  CONSULTATION_DETAIL: (id: string) => `/consultations/${id}`,
  CONSULTATION_END: (id: string) => `/consultations/${id}/end`,
  CONSULTATION_MESSAGES: (id: string) => `/consultations/${id}/messages`,
  CONSULTATIONS_BY_CUSTOMER: (id: string) => `/consultations/by-customer/${id}`,
  CONSULTATIONS_BY_PHARMACIST: (id: string) => `/consultations/by-pharmacist/${id}`,

  // ============= Health tools (health-tools-service) =============
  HEALTH_QUIZZES: '/health/quizzes',
  HEALTH_QUIZ_DETAIL: (slug: string) => `/health/quizzes/${slug}`,
  HEALTH_QUIZ_SUBMIT: (slug: string) => `/health/quizzes/${slug}/submit`,
  HEALTH_QUIZ_RESULTS_ME: '/health/quiz-results/me',

  // ============= Flash sales (ecom-ops-service) =============
  FLASH_SALES_ACTIVE: '/ecom-ops/flash-sales/active',
  FLASH_SALE_DETAIL: (id: string) => `/ecom-ops/flash-sales/${id}`,

  // ============= Videos (admin/customer-portal-service) =============
  VIDEOS: '/admin/videos',
  VIDEO_DETAIL: (id: string) => `/admin/videos/${id}`,

  // ============= Notification settings (customer-portal-service) =============
  NOTIF_SETTINGS: '/notif-settings',

  // ============= Rx console (pharmacist-workbench-service) =============
  RX_CUSTOMER_360: (id: string) => `/rx/customers/${id}/profile-360`,
  RX_CROSS_SELL: '/rx/cross-sell',
  RX_DRUG_CHECK: '/rx/drug-check',

  // ============= Follow-ups (pharmacist-workbench-service) =============
  FOLLOW_UPS: '/follow-ups',
  FOLLOW_UPS_BY_CUSTOMER: (id: string) => `/follow-ups/by-customer/${id}`,
  FOLLOW_UP_RESPONSE: (id: string) => `/follow-ups/${id}/response`,

  // ============= VIP marks (pharmacist-workbench-service) =============
  VIP_MARKS: '/vip-marks',
  VIP_MARKS_BY_CUSTOMER: (id: string) => `/vip-marks/by-customer/${id}`,
  VIP_MARKS_BY_TIER: (tier: string) => `/vip-marks/by-tier/${tier}`,

  // ============= Prescription history (customer-portal-service) =============
  PRESCRIPTIONS_ME: '/prescriptions/me',
  PRESCRIPTION_REDOWNLOAD: (id: string) => `/prescriptions/${id}/re-download`,
} as const;
