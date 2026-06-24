// =====================================================
// /suc-khoe/kiem-tra/[slug] — HEALTH-QUIZ-RESULT (real API)
// /api/v1/health/quizzes/:slug
// =====================================================

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Clock, Stethoscope } from 'lucide-react';
import { fetchQuizBySlug } from '@/features/health-tools';
import { HealthQuizForm } from '@/components/health/HealthQuizForm';

interface PageProps {
  params: { slug: string };
}

export default async function HealthQuizDetailPage({ params }: PageProps) {
  let quiz;
  try {
    quiz = await fetchQuizBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!quiz) notFound();

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra' },
              { label: quiz.title },
            ]}
          />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-success-50 text-success-700 text-xs font-semibold rounded-full">
            <Stethoscope className="w-3 h-3" aria-hidden="true" />
            {quiz.category ?? 'Tổng quát'}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900 text-balance">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="mt-1 text-sm text-ink-600 text-pretty">
              {quiz.description}
            </p>
          )}
          {quiz.estimatedMinutes && (
            <p className="mt-2 text-xs text-ink-500 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              Khoảng {quiz.estimatedMinutes} phút
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
        {quiz.questions && quiz.questions.length > 0 ? (
          <HealthQuizForm quiz={quiz} />
        ) : (
          <div className="p-6 bg-ink-50 border border-ink-200 rounded-md text-center">
            <p className="text-sm text-ink-600">
              Bài kiểm tra này hiện chưa có câu hỏi. Vui lòng quay lại sau.
            </p>
            <Link
              href="/suc-khoe/kiem-tra"
              className="mt-3 inline-block text-sm text-accent-700 hover:underline"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        )}
      </div>
    </>
  );
}