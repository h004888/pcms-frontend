// =====================================================
// ShopHomeHealthTools — Bài kiểm tra sức khỏe (vivid edition)
// Mỗi quiz có gradient riêng theo chủ đề sức khỏe:
//   • Tim mạch → đỏ-cam
//   • Tiểu đường → cyan
//   • Trí nhớ → tím
//   • Hen → xanh dương
// Layout: 1 hero card lớn + grid cards nhỏ (phá vỡ equal-grid pattern)
// =====================================================

import Link from 'next/link';
import {
  Brain,
  Droplet,
  Heart,
  Wind,
  Activity,
  Stethoscope,
  Pill,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

type Theme = {
  bg: string;
  ring: string;
  iconBg: string;
  iconText: string;
  text: string;
  decoration: string;
};

const QUIZZES: Array<{
  slug: string;
  label: string;
  desc: string;
  icon: typeof Brain;
  theme: Theme;
  featured?: boolean;
}> = [
  {
    slug: 'tri-nho',
    label: 'Trí nhớ & Tập trung',
    desc: 'Đánh giá trí nhớ ngắn hạn và khả năng tập trung. Phù hợp với dược sĩ tư vấn người cao tuổi.',
    icon: Brain,
    theme: {
      bg: 'bg-gradient-to-br from-distinct-50 to-distinct-100/60',
      ring: 'hover:border-distinct-500',
      iconBg: 'bg-distinct-600',
      iconText: 'text-white',
      text: 'text-distinct-800',
      decoration: 'bg-distinct-200/40',
    },
    featured: true,
  },
  {
    slug: 'tim-mach',
    label: 'Nguy cơ tim mạch',
    desc: 'Sàng lọc nguy cơ nhồi máu cơ tim, đột quỵ trong 10 năm tới.',
    icon: Heart,
    theme: {
      bg: 'bg-gradient-to-br from-danger-50 to-danger-100/60',
      ring: 'hover:border-danger-500',
      iconBg: 'bg-danger-600',
      iconText: 'text-white',
      text: 'text-danger-700',
      decoration: 'bg-danger-200/40',
    },
  },
  {
    slug: 'tien-dai-thao-duong',
    label: 'Tiền đái tháo đường',
    desc: 'Phát hiện sớm nguy cơ tiểu đường type 2.',
    icon: Droplet,
    theme: {
      bg: 'bg-gradient-to-br from-info-50 to-info-100/60',
      ring: 'hover:border-info-500',
      iconBg: 'bg-info-600',
      iconText: 'text-white',
      text: 'text-info-700',
      decoration: 'bg-info-200/40',
    },
  },
  {
    slug: 'hen',
    label: 'Kiểm soát hen (ACT)',
    desc: 'Đánh giá mức độ kiểm soát cơn hen trong 4 tuần qua.',
    icon: Wind,
    theme: {
      bg: 'bg-gradient-to-br from-primary-50 to-info-100/60',
      ring: 'hover:border-primary-500',
      iconBg: 'bg-primary-600',
      iconText: 'text-white',
      text: 'text-primary-700',
      decoration: 'bg-primary-200/40',
    },
  },
  {
    slug: 'suy-giap',
    label: 'Suy giáp',
    desc: 'Sàng lọc triệu chứng suy giáp thường gặp.',
    icon: ShieldCheck,
    theme: {
      bg: 'bg-gradient-to-br from-accent-50 to-accent-100/60',
      ring: 'hover:border-accent-500',
      iconBg: 'bg-accent-600',
      iconText: 'text-white',
      text: 'text-accent-700',
      decoration: 'bg-accent-200/40',
    },
  },
  {
    slug: 'gerd',
    label: 'Trào ngược dạ dày',
    desc: 'Đánh giá triệu chứng GERD và nguy cơ biến chứng.',
    icon: Pill,
    theme: {
      bg: 'bg-gradient-to-br from-warning-50 to-warning-100/60',
      ring: 'hover:border-warning-500',
      iconBg: 'bg-warning-600',
      iconText: 'text-white',
      text: 'text-warning-700',
      decoration: 'bg-warning-200/40',
    },
  },
  {
    slug: 'alzheimer',
    label: 'Nguy cơ Alzheimer',
    desc: 'Sàng lọc sớm cho người > 50 tuổi có yếu tố gia đình.',
    icon: Brain,
    theme: {
      bg: 'bg-gradient-to-br from-warning-50 to-warning-100/60',
      ring: 'hover:border-warning-500',
      iconBg: 'bg-warning-600',
      iconText: 'text-white',
      text: 'text-warning-700',
      decoration: 'bg-warning-200/40',
    },
  },
  {
    slug: 'binh-xit',
    label: 'Phụ thuộc bình xịt',
    desc: 'Đánh giá mức độ lệ thuộc thuốc giãn phế quản.',
    icon: Stethoscope,
    theme: {
      bg: 'bg-gradient-to-br from-success-50 to-success-100/60',
      ring: 'hover:border-success-500',
      iconBg: 'bg-success-600',
      iconText: 'text-white',
      text: 'text-success-700',
      decoration: 'bg-success-200/40',
    },
  },
];

export function ShopHomeHealthTools() {
  const [featured, ...rest] = QUIZZES;
  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      aria-labelledby="health-tools-title"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-700 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Miễn phí · 5 phút · Không cần đăng nhập
          </div>
          <h2
            id="health-tools-title"
            className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance leading-tight"
          >
            Bài kiểm tra sức khỏe
          </h2>
          <p className="mt-2 text-sm text-ink-600 text-pretty max-w-2xl">
            Tự đánh giá nhanh theo chuẩn WHO, nhận gợi ý từ dược sĩ sau khi hoàn thành.
          </p>
        </div>
        <Link
          href="/suc-khoe/kiem-tra"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
        >
          Tất cả bài test
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
        {/* Featured card — lớn hơn, prominent */}
        <Link
          href={`/suc-khoe/kiem-tra/${featured.slug}`}
          className={`group relative lg:row-span-2 lg:col-span-1 flex flex-col justify-between p-6 md:p-8 ${featured.theme.bg} border border-ink-200 ${featured.theme.ring} rounded-xl overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500`}
        >
          <div
            aria-hidden="true"
            className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${featured.theme.decoration} group-hover:scale-110 transition-transform duration-500`}
          />
          <div className="relative">
            <div className={`inline-flex items-center gap-1.5 px-2.5 h-6 ${featured.theme.iconBg} text-white text-xs font-semibold rounded-full mb-4`}>
              <Activity className="w-3 h-3" aria-hidden="true" />
              Nổi bật
            </div>
            <div
              className={`w-16 h-16 ${featured.theme.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-150 ring-2 ring-white/50`}
            >
              <featured.icon className={`w-8 h-8 ${featured.theme.iconText}`} aria-hidden="true" />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold ${featured.theme.text} text-balance leading-tight`}>
              {featured.label}
            </h3>
            <p className="mt-2 text-sm text-ink-700 text-pretty leading-relaxed">
              {featured.desc}
            </p>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-ink-900 group-hover:gap-3 transition-all">
            <Clock className="w-4 h-4" aria-hidden="true" />
            5 phút
            <ArrowRight className="w-4 h-4 ml-auto" aria-hidden="true" />
          </div>
        </Link>

        {/* Regular cards grid */}
        {rest.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <Link
              key={quiz.slug}
              href={`/suc-khoe/kiem-tra/${quiz.slug}`}
              className={`group relative p-5 ${quiz.theme.bg} border border-ink-200 ${quiz.theme.ring} rounded-xl transition-colors overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500`}
            >
              <div
                aria-hidden="true"
                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${quiz.theme.decoration} group-hover:scale-125 transition-transform duration-300`}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 ${quiz.theme.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-150 ring-1 ring-white/50`}
                >
                  <Icon className={`w-6 h-6 ${quiz.theme.iconText}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm md:text-base font-bold ${quiz.theme.text} leading-snug text-balance`}>
                    {quiz.label}
                  </h3>
                  <p className="mt-1 text-xs text-ink-600 text-pretty line-clamp-2 leading-relaxed">
                    {quiz.desc}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    5 phút
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
