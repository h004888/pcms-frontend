// =====================================================
// /suc-khoe/kiem-tra — HEALTH-QUIZ-LIST
// Danh sách bài kiểm tra sức khỏe
// =====================================================

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { HEALTH_QUIZZES } from '@/data/shop/health-quizzes';
import { Clock, Brain, Heart, Droplet, Wind, Pill, Stethoscope } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bài kiểm tra sức khỏe',
  description: 'Tự đánh giá nhanh chức năng cơ thể và nhận gợi ý từ dược sĩ.',
};

const ICON_MAP = { Brain, Heart, Droplet, Wind, Pill, Stethoscope };
const COLOR_MAP = {
  info: 'bg-info-50 text-info-700',
  danger: 'bg-danger-50 text-danger-700',
  primary: 'bg-primary-50 text-primary-700',
  warning: 'bg-warning-50 text-warning-700',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
};

export default function HealthQuizListPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-success-50 to-info-50 border-b border-ink-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[{ label: 'Bài kiểm tra sức khỏe' }]} />
          <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 bg-success-600 text-white text-xs font-semibold rounded-full">
            <Stethoscope className="w-3 h-3" aria-hidden="true" />
            Miễn phí · {HEALTH_QUIZZES.length} bài
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
          {HEALTH_QUIZZES.map((q) => {
            const Icon = ICON_MAP[q.icon];
            const colorClass = COLOR_MAP[q.color];
            return (
              <Link
                key={q.slug}
                href={`/suc-khoe/kiem-tra/${q.slug}`}
                className="block p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-ink-900 text-balance">
                      {q.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-500 capitalize">{q.category}</p>
                    <p className="mt-2 text-sm text-ink-600 line-clamp-2 text-pretty">
                      {q.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-ink-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {q.durationMin} phút
                      </span>
                      <span>{q.questionsCount} câu hỏi</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-info-50 border border-info-200 rounded-md">
          <p className="text-sm text-info-800">
            <strong>Lưu ý:</strong> Bài kiểm tra chỉ mang tính sàng lọc sơ bộ, không thay thế
            chẩn đoán y khoa. Vui lòng gặp bác sĩ để được tư vấn chính xác.
          </p>
        </div>
      </div>
    </>
  );
}