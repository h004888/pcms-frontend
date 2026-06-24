// =====================================================
// HealthQuizForm — Multi-step form for health quiz
// Submit -> /api/v1/health/quizzes/:slug/submit
// =====================================================

'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { submitQuiz } from '@/features/health-tools';
import type { HealthQuiz, HealthQuizResult } from '@/features/health-tools';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface Props {
  quiz: HealthQuiz;
}

export function HealthQuizForm({ quiz }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<HealthQuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = quiz.questions?.length ?? 0;

  if (result) {
    return (
      <div className="p-5 bg-white border border-ink-200 rounded-md space-y-4">
        <div className="flex items-center gap-2">
          {result.level === 'HIGH' ? (
            <AlertTriangle className="w-6 h-6 text-danger-600" aria-hidden="true" />
          ) : result.level === 'MEDIUM' ? (
            <AlertTriangle className="w-6 h-6 text-warning-600" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-success-600" aria-hidden="true" />
          )}
          <h2 className="text-lg font-semibold text-ink-900">Kết quả của bạn</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-ink-50 rounded-md">
            <p className="text-xs text-ink-500">Điểm</p>
            <p className="mt-1 text-2xl font-bold font-mono text-ink-900">
              {result.totalScore}/{result.maxScore}
            </p>
          </div>
          <div
            className={clsx(
              'p-4 rounded-md',
              result.level === 'HIGH'
                ? 'bg-danger-50'
                : result.level === 'MEDIUM'
                  ? 'bg-warning-50'
                  : 'bg-success-50'
            )}
          >
            <p className="text-xs text-ink-500">Mức độ</p>
            <p
              className={clsx(
                'mt-1 text-lg font-bold',
                result.level === 'HIGH'
                  ? 'text-danger-700'
                  : result.level === 'MEDIUM'
                    ? 'text-warning-700'
                    : 'text-success-700'
              )}
            >
              {result.level === 'HIGH'
                ? 'Cao — nên khám bác sĩ'
                : result.level === 'MEDIUM'
                  ? 'Trung bình — theo dõi'
                  : 'Thấp — tốt!'}
            </p>
          </div>
        </div>
        {result.recommendation && (
          <div className="p-4 bg-info-50 border border-info-200 rounded-md">
            <p className="text-sm font-medium text-info-900">Khuyến nghị</p>
            <p className="mt-1 text-sm text-info-800">{result.recommendation}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setAnswers({});
            setStep(0);
          }}
          className="inline-flex items-center gap-2 px-4 h-10 bg-ink-100 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-200"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Làm lại
        </button>
      </div>
    );
  }

  const question = quiz.questions?.[step];

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await submitQuiz(quiz.slug, answers);
      setResult(res);
    } catch {
      toast.error('Không thể gửi kết quả. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!question) {
    return (
      <p className="text-sm text-ink-500 py-8 text-center">Đang tải câu hỏi...</p>
    );
  }

  return (
    <div className="p-5 bg-white border border-ink-200 rounded-md space-y-5">
      <div className="flex items-center justify-between text-xs text-ink-500 font-mono">
        <span>
          Câu {step + 1}/{totalSteps}
        </span>
        <div className="h-1 flex-1 mx-3 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-600 transition-all"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-ink-900">{question.text}</h2>
        <div className="mt-3 space-y-2">
          {question.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 p-3 border border-ink-200 rounded-md cursor-pointer hover:border-accent-500 has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50"
            >
              <input
                type="radio"
                name={question.id}
                checked={answers[question.id] === opt.id}
                onChange={() =>
                  setAnswers((p) => ({ ...p, [question.id]: opt.id }))
                }
                className="w-4 h-4 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm text-ink-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 px-4 h-10 bg-ink-100 text-ink-700 text-sm font-medium rounded-md hover:bg-ink-200 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Trước
        </button>
        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!answers[question.id]}
            className="inline-flex items-center gap-1 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
          >
            Tiếp <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !answers[question.id]}
            className="inline-flex items-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 disabled:bg-ink-300"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Gửi kết quả
          </button>
        )}
      </div>
    </div>
  );
}