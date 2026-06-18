// =====================================================
// /suc-khoe/kiem-tra/[slug] — HEALTH-QUIZ-RESULT (polished)
// Multi-step form 5 câu + scoring + risk level + advice
// =====================================================

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { HEALTH_QUIZZES } from '@/data/shop/health-quizzes';
import {
  QUIZZES,
  getQuizBySlugFull,
  computeScore,
} from '@/data/shop/quiz-questions';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

interface PageProps {
  params: { slug: string };
}

export default function HealthQuizDetailPage({ params }: PageProps) {
  const healthQuiz = HEALTH_QUIZZES.find((q) => q.slug === params.slug);
  if (!healthQuiz) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra' }]} />
        <h1 className="mt-3 text-xl font-bold text-ink-900">Không tìm thấy bài kiểm tra</h1>
        <Link href="/suc-khoe/kiem-tra" className="text-sm text-accent-700">
          ← Quay lại
        </Link>
      </>
    );
  }

  const fullQuiz = getQuizBySlugFull(params.slug);

  // Nếu không có questions → show sample
  if (!fullQuiz || fullQuiz.questions.length === 0) {
    return <SampleQuizView slug={params.slug} title={healthQuiz.title} description={healthQuiz.description} duration={healthQuiz.durationMin} />;
  }

  return <QuizForm quiz={fullQuiz} />;
}

function QuizForm({ quiz }: { quiz: ReturnType<typeof getQuizBySlugFull> }) {
  // quiz is non-null here
  const q = quiz!;
  const [step, setStep] = useState(0); // 0..q.questions.length (length = result screen)
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const result = useMemo(() => {
    if (step !== q.questions.length) return null;
    return computeScore(q, answers);
  }, [step, answers, q]);

  const setAnswer = (qid: string, score: number) => {
    setAnswers((p) => ({ ...p, [qid]: score }));
  };

  const next = () => {
    if (step < q.questions.length) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
  };
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const isResult = step === q.questions.length;
  const currentQ = q.questions[step];
  const totalSteps = q.questions.length;
  const progress = isResult ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra' },
              { label: q.title },
            ]}
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">{q.title}</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">{q.description}</p>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3 text-xs text-ink-500">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{q.questions.length} câu · ~{Math.ceil(q.questions.length * 0.5)} phút</span>
            {!isResult && (
              <span className="font-mono ml-auto">
                {step + 1}/{totalSteps}
              </span>
            )}
          </div>
          <div className="mt-2 w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
        {!isResult ? (
          <div className="p-6 bg-white border border-ink-200 rounded-md">
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-9 h-9 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center font-bold text-sm font-mono">
                {step + 1}
              </span>
              <h2 className="text-base font-semibold text-ink-900 flex-1">{currentQ.text}</h2>
            </div>

            <div className="space-y-2" role="radiogroup">
              {currentQ.options.map((opt, i) => (
                <label
                  key={i}
                  className={clsx(
                    'flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors',
                    answers[currentQ.id] === opt.score
                      ? 'border-accent-600 bg-accent-50'
                      : 'border-ink-200 hover:border-ink-300'
                  )}
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    checked={answers[currentQ.id] === opt.score}
                    onChange={() => setAnswer(currentQ.id, opt.score)}
                    className="w-4 h-4 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="flex-1 text-sm text-ink-900">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-ink-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-1 px-3 h-9 text-sm font-medium text-ink-700 hover:bg-ink-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Câu trước
              </button>
              <button
                type="button"
                onClick={next}
                disabled={answers[currentQ.id] === undefined}
                className="inline-flex items-center gap-1 px-4 h-9 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors disabled:bg-ink-300 disabled:cursor-not-allowed"
              >
                {step === totalSteps - 1 ? 'Xem kết quả' : 'Câu tiếp'}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : result ? (
          <QuizResult
            result={result}
            quiz={q}
            onRestart={restart}
          />
        ) : null}
      </div>
    </>
  );
}

function QuizResult({
  result,
  quiz,
  onRestart,
}: {
  result: ReturnType<typeof computeScore>;
  quiz: NonNullable<ReturnType<typeof getQuizBySlugFull>>;
  onRestart: () => void;
}) {
  const levelConfig = {
    low: {
      icon: CheckCircle2,
      label: 'Kết quả tốt',
      class: 'bg-success-50 border-success-300 text-success-900',
      iconClass: 'text-success-600',
    },
    medium: {
      icon: AlertCircle,
      label: 'Cần chú ý',
      class: 'bg-warning-50 border-warning-300 text-warning-900',
      iconClass: 'text-warning-600',
    },
    high: {
      icon: AlertTriangle,
      label: 'Cần tư vấn y khoa',
      class: 'bg-danger-50 border-danger-300 text-danger-900',
      iconClass: 'text-danger-600',
    },
  } as const;

  const cfg = levelConfig[result.level];
  const Icon = cfg.icon;
  const advice = quiz.advice[result.level];

  return (
    <div className="space-y-4">
      <div className={`p-6 border-2 rounded-md ${cfg.class}`}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className={`w-6 h-6 ${cfg.iconClass}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold opacity-80">Kết quả</p>
            <h2 className="text-xl font-bold">{cfg.label}</h2>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-current/10 space-y-2">
          <p className="text-sm font-mono opacity-80">
            Điểm: {result.totalScore} / {result.maxScore} ({Math.round(result.ratio * 100)}%)
          </p>
          {/* Score bar */}
          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                result.level === 'low' && 'bg-success-500',
                result.level === 'medium' && 'bg-warning-500',
                result.level === 'high' && 'bg-danger-500'
              )}
              style={{ width: `${result.ratio * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border border-ink-200 rounded-md">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink-900 mb-2">
          <Sparkles className="w-4 h-4 text-accent-600" aria-hidden="true" />
          Lời khuyên cho bạn
        </h3>
        <p className="text-sm text-ink-700 leading-relaxed">{advice}</p>
      </div>

      <div className="p-4 bg-info-50 border border-info-200 rounded-md flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-info-800">
          Kết quả chỉ mang tính sàng lọc sơ bộ, không thay thế chẩn đoán y khoa. Nếu có lo ngại,
          vui lòng đặt lịch tư vấn với dược sĩ hoặc bác sĩ.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 bg-white border border-ink-200 text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Làm lại
        </button>
        <Link
          href="/ai/chat"
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Tư vấn AI
        </Link>
      </div>
    </div>
  );
}

function SampleQuizView({
  slug,
  title,
  description,
  duration,
}: {
  slug: string;
  title: string;
  description: string;
  duration: number;
}) {
  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra' },
              { label: title },
            ]}
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">{title}</h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">{description}</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-ink-500">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>~{duration} phút</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="p-6 bg-white border border-ink-200 rounded-md text-center">
          <Sparkles className="w-12 h-12 mx-auto text-accent-600" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-ink-900">Bài kiểm tra đang phát triển</h2>
          <p className="mt-2 text-sm text-ink-600 text-pretty">
            Form câu hỏi cho bài này sẽ sớm được bổ sung. Hiện tại bạn có thể thử các bài đã có sẵn.
          </p>
          <Link
            href="/suc-khoe/kiem-tra"
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 h-10 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    </>
  );
}