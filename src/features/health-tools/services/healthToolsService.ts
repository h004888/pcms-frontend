// =====================================================
// PCMS - Health Tools Service
// SPRINT 1 - T07: thêm getDiseaseBySlug (gọi /diseases/{slug})
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  HealthQuiz,
  HealthQuizResult,
  HealthQuizResultsResponse,
} from '../types';

// SPRINT 1 - T07: shape DiseaseInfoResponse khớp DTO backend (id, name, slug,
// targetAudience, season, severity, body, viewCount).
export interface DiseaseInfoResponse {
  id: string;
  name: string;
  slug: string;
  targetAudience?: string;
  season?: string;
  severity?: string;
  body?: string;
  viewCount?: number;
}

/**
 * SPRINT 1 - T07: get disease detail by slug.
 * Trả 404 nếu backend không tìm thấy.
 */
export async function getDiseaseBySlug(slug: string): Promise<DiseaseInfoResponse> {
  const res = await apiClient.get<DiseaseInfoResponse>(
    API_ENDPOINTS.DISEASE_DETAIL(slug)
  );
  return res.data;
}

export async function fetchQuizzes() {
  const res = await apiClient.get<HealthQuiz[] | { quizzes: HealthQuiz[] }>(
    API_ENDPOINTS.HEALTH_QUIZZES
  );
  const body = res.data;
  if (Array.isArray(body)) return body;
  return body?.quizzes ?? [];
}

export async function fetchQuizBySlug(slug: string) {
  const res = await apiClient.get<HealthQuiz>(
    API_ENDPOINTS.HEALTH_QUIZ_DETAIL(slug)
  );
  return res.data;
}

export async function submitQuiz(
  slug: string,
  answers: Record<string, unknown>
) {
  const res = await apiClient.post<HealthQuizResult>(
    API_ENDPOINTS.HEALTH_QUIZ_SUBMIT(slug),
    { answers }
  );
  return res.data;
}

export async function fetchMyQuizResults() {
  const res = await apiClient.get<HealthQuizResultsResponse>(
    API_ENDPOINTS.HEALTH_QUIZ_RESULTS_ME
  );
  return res.data ?? { results: [], total: 0 };
}