// =====================================================
// PCMS - Health Tools Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type {
  HealthQuiz,
  HealthQuizResult,
  HealthQuizResultsResponse,
} from '../types';

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