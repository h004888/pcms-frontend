// =====================================================
// PCMS - Articles Service
// =====================================================

import { apiClient, API_ENDPOINTS } from '@/lib/api';
import type { Article } from '../types';

interface PageResponse<T> {
  data?: T[] | null;
  articles?: T[] | null;
  total?: number;
}

export async function fetchArticles(params?: { cat?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.cat) searchParams.set('cat', params.cat);
  const queryString = searchParams.toString();
  const url = queryString
    ? `${API_ENDPOINTS.ARTICLES}?${queryString}`
    : API_ENDPOINTS.ARTICLES;
  const res = await apiClient.get<PageResponse<Article>>(url);
  const body = res.data;
  const articles = (body?.articles ?? body?.data ?? []) as Article[];
  return { articles, total: body?.total ?? articles.length };
}

export async function fetchArticleBySlug(slug: string) {
  const res = await apiClient.get<Article>(API_ENDPOINTS.ARTICLE_DETAIL(slug));
  return res.data;
}