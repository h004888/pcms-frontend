// =====================================================
// PCMS - Axios HTTP Client
// Calls backend directly at NEXT_PUBLIC_API_URL (cross-origin).
// CORS is configured on the Spring Cloud Gateway side
// (see api-gateway/ApiGatewayApplication.java @Bean corsWebFilter
//  + application.yml spring.cloud.gateway.globalcors).
// =====================================================

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const TOKEN_KEY = 'pcms_access_token';
const REFRESH_KEY = 'pcms_refresh_token';

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
 * Response interceptor - handle 401 by redirecting to login
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 401: unauthorized → clear tokens, redirect to login
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearTokens();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
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
