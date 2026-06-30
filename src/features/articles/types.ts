// =====================================================
// PCMS - Articles feature types
// =====================================================

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  thumbnail?: string;
  tags?: string[];
  relatedArticleSlugs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
}
