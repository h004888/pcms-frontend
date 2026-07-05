// =====================================================
// PCMS - Axios HTTP Client
// Calls backend directly at NEXT_PUBLIC_API_URL (cross-origin).
// CORS is configured on the Spring Cloud Gateway side
// =====================================================

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const TOKEN_KEY = 'pcms_access_token';
const REFRESH_KEY = 'pcms_refresh_token';

/** Track refresh promise to prevent multiple simultaneous refresh calls */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

/**
 * Save tokens to localStorage
 */
export function saveTokens(access: string, refresh: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

/**
 * Clear all tokens (used on logout)
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem('pcms_user');
  refreshPromise = null;
}

/**
 * Try to refresh the access token using the stored refresh token.
 * Returns the new access token or null if refresh failed.
 */
async function tryRefreshToken(): Promise<string | null> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      { refreshToken },
      { headers: { Authorization: `Bearer ${getAccessToken()}` } }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    saveTokens(accessToken, newRefreshToken || refreshToken);
    return accessToken;
  } catch {
    return null;
  }
}

/**
 * Create configured axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor - attach JWT token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - try refresh on 401 before redirecting
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401 || typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // Don't try refresh for auth endpoints themselves (prevents infinite loop)
    const url = error.config?.url || '';
    if (url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    // Try to refresh the token once
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (newToken && error.config) {
      // Retry the original request with the new token
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient.request(error.config);
    }

    // Refresh failed — clear and redirect to login
    clearTokens();
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Extract human-readable error message from Axios error
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string; code?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.message) return error.message;
    return `HTTP ${error.response?.status || 'unknown'}: ${error.response?.statusText || 'Error'}`;
  }
  if (error instanceof Error) return error.message;
  return 'Đã xảy ra lỗi không xác định';
}

export default apiClient;
export { API_URL };
