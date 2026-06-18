// =====================================================
// PAGE-NEWS — /tin-tuc-su-kien
// Tin tức sự kiện, PR, hợp tác chiến lược
// =====================================================

import { StaticPageLayout, Prose } from '@/components/shop';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin tức sự kiện',
  description: 'Tin tức, sự kiện, hợp tác chiến lược và PR mới nhất từ FPT Long Châu.',
};

const CATEGORIES = ['Tất cả', 'Tin khuyến mãi', 'Truyền thông', 'Hợp tác', 'Sự kiện'] as const;

const NEWS = [
  {
    date: '2026-06-10',
    category: 'Truyền thông',
    title: 'Long Châu ra mắt "Ví Khỏe Nhà Ta" — Ví sức khoẻ tích thưởng cho cả nhà',
    excerpt:
      'Lần đầu tiên tại Việt Nam, một hệ thống nhà thuốc ra mắt ví sức khoẻ kết nối cả gia đình, tích điểm và đổi quà chăm sóc sức khoẻ.',
  },
  {
    date: '2026-06-05',
    category: 'Hợp tác',
    title: 'Long Châu hợp tác IHH Healthcare Singapore — Mang 3 đột phá y khoa về Việt Nam',
    excerpt:
      'Chuyên gia Singapore chia sẻ phác đồ điều trị ung thư tiên tiến nhất, mở cơ hội cho bệnh nhân nặng và hiếm gặp tại Việt Nam.',
  },
  {
    date: '2026-05-28',
    category: 'Tin khuyến mãi',
    title: 'Thể lệ chương trình "Tài khoản Gia đình" — Tặng 500K cho gia đình đăng ký đầu tiên',
    excerpt:
      'Chương trình kết nối nhiều thành viên trong gia đình vào một tài khoản chung, đồng bộ đơn thuốc và lịch nhắc thuốc.',
  },
  {
    date: '2026-05-15',
    category: 'Sự kiện',
    title: 'Vòng quay "Chào 2,678 nhà thuốc" — Tổng giải thưởng 10 tỷ đồng',
    excerpt: 'Chương trình tri ân khách hàng nhân dịp cán mốc 2,678 nhà thuốc trên toàn quốc.',
  },
  {
    date: '2026-04-20',
    category: 'Truyền thông',
    title: 'Long Châu đạt giải "Digital Innovation of the Year — Vietnam" tại Healthcare Asia Pharma Awards 2025',
    excerpt:
      'Giải thưởng ghi nhận nền tảng AI nhắc thuốc, sổ tiêm chủng điện tử và hệ thống tư vấn từ xa của Long Châu.',
  },
  {
    date: '2026-04-05',
    category: 'Hợp tác',
    title: 'Triển khai thanh toán VNeID từ 01/01/2026 — Mua thuốc chỉ cần CCCD',
    excerpt:
      'Phối hợp với Cục Cảnh sát QLHC về TTXH, Long Châu tích hợp VNeID giúp người dân mua thuốc mà không cần nhập thủ công thông tin cá nhân.',
  },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function NewsPage() {
  const featured = NEWS[0];
  const rest = NEWS.slice(1);

  return (
    <StaticPageLayout
      title="Tin tức & Sự kiện"
      description="Cập nhật tin tức mới nhất về sản phẩm, chương trình khuyến mãi và sự kiện từ FPT Long Châu."
      breadcrumbs={[{ label: 'Tin tức sự kiện' }]}
    >
      {/* Category filter (visual only — no state for static) */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button
            key={c}
            type="button"
            className={
              i === 0
                ? 'px-3 h-8 text-sm font-medium bg-ink-900 text-white rounded-full'
                : 'px-3 h-8 text-sm font-medium text-ink-700 bg-white border border-ink-200 rounded-full hover:border-accent-500 hover:text-accent-700 transition-colors'
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      <article className="mb-8 p-6 bg-gradient-to-br from-ink-50 to-accent-50 border border-ink-200 rounded-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 h-5 bg-accent-600 text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center">
            Nổi bật
          </span>
          <span className="text-xs text-ink-500 inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {formatDate(featured.date)}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance">
          {featured.title}
        </h2>
        <p className="mt-3 text-base text-ink-600 leading-relaxed">{featured.excerpt}</p>
        <Link
          href="#"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-700 hover:text-accent-800"
        >
          Đọc tiếp
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </article>

      {/* News grid */}
      <h2 className="text-xl font-bold text-ink-900 tracking-tight mb-4">Tin mới nhất</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((n) => (
          <li key={n.title}>
            <article className="h-full flex flex-col p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent-700">
                  <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                  {n.category}
                </span>
                <span className="text-xs text-ink-400 inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {formatDate(n.date)}
                </span>
              </div>
              <h3 className="text-base font-semibold text-ink-900 leading-snug mb-2 flex-1">
                {n.title}
              </h3>
              <p className="text-sm text-ink-600 leading-relaxed line-clamp-3 mb-3">
                {n.excerpt}
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800"
              >
                Đọc tiếp
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
            </article>
          </li>
        ))}
      </ul>
    </StaticPageLayout>
  );
}
