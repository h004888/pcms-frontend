// =====================================================
// /suc-khoe/kiem-tra — HEALTH-QUIZ-LIST (real API)
// /api/v1/health/quizzes
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Clock, Stethoscope, Brain } from 'lucide-react';
import type { Metadata } from 'next';
import { fetchQuizzes } from '@/features/health-tools';

export const metadata: Metadata = {
  title: 'Bài kiểm tra sức khỏe',
  description: 'Tự đánh giá nhanh chức năng cơ thể và nhận gợi ý từ dược sĩ.',
};

export default async function HealthQuizListPage() {
  let quizzes: Awaited<ReturnType<typeof fetchQuizzes>> = [];
  try {
    quizzes = await fetchQuizzes();
  } catch {
    quizzes = [];
  }

  return (
    <>
      <div className="bg-gradient-to-br from-success-50 to-info-50 border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Bài kiểm tra sức khỏe' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-success-600 text-white text-xs font-semibold rounded-full">
            <Stethoscope className="w-3 h-3" aria-hidden="true" />
            Miễn phí · {quizzes.length} bài
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            Kiểm tra sức khỏe nhanh
          </h1>
          <p className="mt-1 text-base text-ink-600 text-pretty">
            Tự đánh giá các chỉ số sức khỏe trong 5 phút — nhận gợi ý từ dược sĩ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid sm:grid-cols-2 gap-3">
          {quizzes.map((q) => (
            <Link
              key={q.slug}
              href={`/suc-khoe/kiem-tra/${q.slug}`}
              className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-md bg-info-50 text-info-700 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-ink-900 text-balance">
                    {q.title}
                  </h3>
                  {q.category && (
                    <p className="mt-1 text-xs text-ink-500 capitalize">
                      {q.category}
                    </p>
                  )}
                  {q.description && (
                    <p className="mt-2 text-sm text-ink-600 line-clamp-2 text-pretty">
                      {q.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-500 font-mono">
                    {q.estimatedMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {q.estimatedMinutes} phút
                      </span>
                    )}
                    {q.questions && <span>{q.questions.length} câu hỏi</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}