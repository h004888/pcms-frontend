// =====================================================
// PCMS - Review Service (SPRINT 3 - T11)
// =====================================================
// Backend endpoints (customer-portal-service):
//   GET  /reviews?medicineId=<uuid>   — public, list reviews for 1 medicine
//   GET  /reviews/me                  — auth, list my reviews
//   POST /reviews                      — auth, upsert (create or update)
//
// Body for POST: { medicineId, rating (1..5), comment? }
// Auth: header X-User-Id required cho /me + POST.
// =====================================================

import { apiClient } from '@/lib/api';

export interface Review {
  id: string;
  customerId: string;
  medicineId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  medicineId: string;
  rating: number;
  comment?: string;
}

export async function getReviewsByMedicine(medicineId: string): Promise<Review[]> {
  const res = await apiClient.get<Review[]>(`/reviews?medicineId=${medicineId}`);
  return res.data;
}

export async function getMyReviews(token: string): Promise<Review[]> {
  const res = await apiClient.get<Review[]>('/reviews/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createReview(
  body: CreateReviewRequest,
  token: string
): Promise<Review> {
  const res = await apiClient.post<Review>('/reviews', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}