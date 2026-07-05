// =====================================================
// PCMS Home API wrappers
// =====================================================

import { api } from './client';
import type {
  HomePageResponse,
  FlashSale,
  Category,
  HealthArticle,
  Disease,
  HomeBannerAdmin,
} from '@/types/home';

export async function getHomePage() {
  return api.get<HomePageResponse>('/shop/home');
}

export async function getActiveFlashSales() {
  return api.get<FlashSale[]>('/ecom-ops/flash-sales/active');
}

export async function listCategories(params?: { page?: number; size?: number; search?: string }) {
  return api.get('/categories', { params });
}

export async function getCategoryBySlug(slug: string) {
  return api.get(`/categories/slug/${slug}`);
}

export async function listHealthArticles(params?: { status?: string }) {
  return api.get('/health-articles', { params });
}

export async function listDiseases() {
  return api.get('/diseases');
}

// Admin
export interface AdminPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function listAdminBanners(params?: { status?: string; page?: number; size?: number }) {
  return api.get<AdminPageResponse<HomeBannerAdmin>>('/admin/home-banners', { params });
}

export async function createAdminBanner(payload: Partial<HomeBannerAdmin>) {
  return api.post<HomeBannerAdmin>('/admin/home-banners', payload);
}

export async function updateAdminBanner(id: string, payload: Partial<HomeBannerAdmin>) {
  return api.put<HomeBannerAdmin>(`/admin/home-banners/${id}`, payload);
}

export async function deleteAdminBanner(id: string) {
  return api.delete(`/admin/home-banners/${id}`);
}

export async function uploadAdminBannerImage(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  return api.post<{ url: string; filename: string }>('/admin/uploads', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
