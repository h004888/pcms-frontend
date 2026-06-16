// =====================================================
// PCMS - Lib barrel re-exports (backward compatible)
// Old imports `@/lib/api`, `@/lib/auth`, etc. still work
// =====================================================

// API
export { apiClient, getErrorMessage, getAccessToken, saveTokens, clearTokens, API_URL, API_ENDPOINTS } from './api';
export { default as apiClientDefault } from './api/client';

// Auth
export { AuthProvider, useAuth, login, logout, getCurrentUser, isAuthenticated, hasRole } from './auth';

// Utils
export * from './utils';

// Config
export * from './config';
