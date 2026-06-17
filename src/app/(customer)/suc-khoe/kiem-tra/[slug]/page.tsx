// =====================================================
// /suc-khoe/kiem-tra/[slug] — HEALTH-QUIZ-RESULT
// Màn hình quiz detail (mock — không có form flow đầy đủ)
// =====================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { HEALTH_QUIZZES, getQuizBySlug } from '@/data/shop/health-quizzes';
import { Clock, AlertCircle, ArrowRight, Stethoscope, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return HEALTH_QUIZZES.map((q) => ({ slug: q.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const q = getQuizBySlug(params.slug);
  if (!q) return { title: 'Không tìm thấy' };
  return { title: q.title, description: q.description };
}

export default function HealthQuizResultPage({ params }: PageProps) {
  const q = getQuizBySlug(params.slug);
  if (!q) notFound();

  return (
    <>
      <div className="bg-white border-b border-ink-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Kiểm tra sức khỏe', href: '/suc-khoe/kiem-tra' },
              { label: q.title },
            ]}
          />
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink-900 text-balance">
            {q.title}
          </h1>
          <p className="mt-1 text-sm text-ink-600 text-pretty">{q.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-ink-500 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {q.durationMin} phút
            </span>
            <span>{q.questionsCount} câu hỏi</span>
            <span className="capitalize">{q.category}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="p-5 bg-white border border-ink-200 rounded-md text-center">
          <Stethoscope className="w-12 h-12 mx-auto text-accent-600" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-ink-900">Bắt đầu kiểm tra</h2>
          <p className="mt-1 text-sm text-ink-600 text-pretty">
            Trả lời {q.questionsCount} câu hỏi để nhận kết quả sàng lọc.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center gap-2 px-5 h-11 bg-accent-600 text-white text-sm font-semibold rounded-md hover:bg-accent-700 transition-colors"
          >
            Bắt đầu
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <p className="mt-3 text-xs text-ink-500">
            (Tính năng đang phát triển — bản demo hiển thị trang kết quả mẫu)
          </p>
        </div>

        <div className="p-4 bg-info-50 border border-info-200 rounded-md">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-info-900 mb-2">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            Kết quả mẫu (demo)
          </h3>
          <div className="p-3 bg-white border border-info-200 rounded text-sm space-y-2">
            <p>
              <strong className="text-success-700">✓ Nguy cơ thấp</strong> — Không phát hiện
              dấu hiệu bất thường.
            </p>
            <p className="text-ink-600">
              Khuyến nghị: duy trì lối sống lành mạnh, khám sức khỏe định kỳ 6 tháng/lần.
            </p>
          </div>
        </div>

        <div className="p-4 bg-success-50 border border-success-200 rounded-md">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-success-900 mb-2">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Hành động tiếp theo
          </h3>
          <ul className="text-sm text-success-800 space-y-1 list-disc pl-5">
            <li>Đặt lịch khám định kỳ với bác sĩ gia đình</li>
            <li>Tư vấn dược sĩ trực tuyến qua AI chat</li>
            <li>Đọc thêm bài viết sức khỏe liên quan</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/suc-khoe/kiem-tra"
            className="text-sm text-accent-700 hover:underline"
          >
            ← Quay lại danh sách bài kiểm tra
          </Link>
        </div>
      </div>
    </>
  );
}