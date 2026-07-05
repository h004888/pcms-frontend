// =====================================================
// /health-quiz — Danh sách bài kiểm tra sức khỏe
// =====================================================

import Link from 'next/link';
import { Stethoscope, Heart, Activity, Brain } from 'lucide-react';

const QUIZZES = [
  {
    title: 'Kiểm tra nguy cơ tim mạch',
    slug: 'nguy-co-tim-mach',
    icon: Heart,
    description: 'Đánh giá nguy cơ mắc bệnh tim mạch dựa trên lối sống và tiền sử bệnh.',
    duration: '3 phút',
    questions: 8,
  },
  {
    title: 'Kiểm tra mức độ kiểm soát hen suyễn',
    slug: 'kiem-soat-hen-suyen',
    icon: Activity,
    description: 'Đánh giá mức độ kiểm soát hen suyễn hiện tại của bạn.',
    duration: '5 phút',
    questions: 10,
  },
  {
    title: 'Kiểm tra nguy cơ tiền đái tháo đường',
    slug: 'nguy-co-tien-dai-thao-duong',
    icon: Activity,
    description: 'Đánh giá nguy cơ mắc tiền đái tháo đường type 2.',
    duration: '4 phút',
    questions: 7,
  },
  {
    title: 'Kiểm tra nguy cơ suy giáp',
    slug: 'nguy-co-suy-giap',
    icon: Stethoscope,
    description: 'Đánh giá triệu chứng và nguy cơ suy giáp.',
    duration: '3 phút',
    questions: 6,
  },
  {
    title: 'Kiểm tra nguy cơ trào ngược dạ dày',
    slug: 'nguy-co-trao-nguoc-da-day',
    icon: Activity,
    description: 'Đánh giá triệu chứng trào ngược dạ dày thực quản.',
    duration: '4 phút',
    questions: 9,
  },
  {
    title: 'Kiểm tra nguy cơ Alzheimer',
    slug: 'suy-giam-tri-nho',
    icon: Brain,
    description: 'Đánh giá tình trạng suy giảm trí nhớ và nguy cơ Alzheimer.',
    duration: '6 phút',
    questions: 12,
  },
  {
    title: 'Kiểm tra nguy cơ phụ thuộc bình xịt',
    slug: 'phu-thuoc-binh-xit',
    icon: Activity,
    description: 'Đánh giá mức độ phụ thuộc bình xịt cắt cơn trong điều trị hen.',
    duration: '3 phút',
    questions: 5,
  },
];

export default function HealthQuizPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700 transition-colors">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Kiểm tra sức khỏe</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Kiểm tra sức khỏe</h1>
        <p className="mt-2 text-slate-600">Tự đánh giá nhanh sức khỏe qua các bài kiểm tra chuyên khoa. Kết quả mang tính tham khảo, không thay thế chẩn đoán y khoa.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {QUIZZES.map((quiz) => (
          <Link
            key={quiz.slug}
            href={`/suc-khoe/kiem-tra/${quiz.slug}`}
            className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <quiz.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{quiz.title}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{quiz.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span>⏱ {quiz.duration}</span>
                  <span>📋 {quiz.questions} câu hỏi</span>
                </div>
              </div>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100 rounded-xl p-6 text-center">
        <Stethoscope className="w-10 h-10 text-blue-500 mx-auto" />
        <h3 className="mt-3 font-bold text-slate-900">Cần tư vấn chuyên sâu?</h3>
        <p className="mt-1 text-sm text-slate-600">Liên hệ tổng đài miễn phí để được dược sĩ tư vấn trực tiếp.</p>
        <a href="tel:18006928" className="mt-3 inline-flex items-center gap-2 text-blue-700 font-bold text-lg hover:text-blue-800 transition-colors">
          📞 1800 6928
        </a>
      </div>
    </div>
  );
}
