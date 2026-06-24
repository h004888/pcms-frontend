// =====================================================
// PCMS - Health Tools feature types
// =====================================================

export interface HealthQuiz {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  questions?: HealthQuizQuestion[];
  estimatedMinutes?: number;
}

export interface HealthQuizQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'scale';
  options?: Array<{ id: string; label: string; score?: number }>;
}

export interface HealthQuizResult {
  quizSlug: string;
  totalScore: number;
  maxScore: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation?: string;
  completedAt: string;
}

export interface HealthQuizResultsResponse {
  results: HealthQuizResult[];
  total: number;
}