// =====================================================
// PAGE-CAREERS — /tuyen-dung
// Cơ hội nghề nghiệp tại Long Châu
// =====================================================

import { StaticPageLayout, Prose } from '@/components/shop';
import { MapPin, Briefcase, Clock, ArrowRight, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tuyển dụng',
  description: 'Cơ hội nghề nghiệp tại FPT Long Châu — Dược sĩ, quản lý nhà thuốc, IT, marketing, kế toán trên toàn quốc.',
};

const DEPARTMENTS = [
  { name: 'Dược sĩ tại quầy', count: 850, icon: '💊' },
  { name: 'Quản lý nhà thuốc', count: 320, icon: '🏪' },
  { name: 'Công nghệ thông tin', count: 180, icon: '💻' },
  { name: 'Marketing & Sáng tạo', count: 95, icon: '🎨' },
  { name: 'Kế toán & Tài chính', count: 110, icon: '📊' },
  { name: 'Vận hành & Logistics', count: 240, icon: '🚚' },
  { name: 'Chăm sóc khách hàng', count: 165, icon: '🎧' },
];

const JOBS = [
  {
    title: 'Dược sĩ tại quầy — Quận 1, TP.HCM',
    department: 'Dược sĩ tại quầy',
    location: 'TP. Hồ Chí Minh',
    type: 'Toàn thời gian',
    salary: '12–18 triệu',
    posted: '2 ngày trước',
  },
  {
    title: 'Senior Frontend Engineer (Next.js)',
    department: 'Công nghệ thông tin',
    location: 'Hà Nội / Hybrid',
    type: 'Toàn thời gian',
    salary: '40–70 triệu',
    posted: '5 ngày trước',
  },
  {
    title: 'Quản lý nhà thuốc — Hà Đông, Hà Nội',
    department: 'Quản lý nhà thuốc',
    location: 'Hà Nội',
    type: 'Toàn thời gian',
    salary: '18–25 triệu',
    posted: '1 tuần trước',
  },
  {
    title: 'AI/ML Engineer (RAG + LLM)',
    department: 'Công nghệ thông tin',
    location: 'TP. Hồ Chí Minh / Hybrid',
    type: 'Toàn thời gian',
    salary: '50–80 triệu',
    posted: '3 ngày trước',
  },
  {
    title: 'Content Creator — Góc sức khỏe',
    department: 'Marketing & Sáng tạo',
    location: 'Remote',
    type: 'Part-time',
    salary: '8–15 triệu',
    posted: '1 ngày trước',
  },
  {
    title: 'Dược sĩ tư vấn từ xa (Video call)',
    department: 'Dược sĩ tại quầy',
    location: 'Toàn quốc / Remote',
    type: 'Bán thời gian',
    salary: '20–35 triệu',
    posted: '4 ngày trước',
  },
];

const BENEFITS = [
  {
    icon: '💰',
    title: 'Lương thưởng cạnh tranh',
    desc: 'Lương cứng + thưởng KPI + thưởng tháng/quý/năm + ESOP cho vị trí quản lý.',
  },
  {
    icon: '🏥',
    title: 'Bảo hiểm sức khỏe cao cấp',
    desc: 'Bảo hiểm PVI / Bảo Việt cho nhân viên + người thân. Khám sức khỏe định kỳ tại Long Châu.',
  },
  {
    icon: '📚',
    title: 'Đào tạo & phát triển',
    desc: 'Đào tạo chuyên môn dược, chứng chỉ GPP, khóa học leadership, hỗ trợ học Thạc sĩ Dược.',
  },
  {
    icon: '🏖️',
    title: 'Nghỉ phép linh hoạt',
    desc: '20 ngày phép/năm + 5 ngày phép ốm có lương. Làm việc hybrid cho vị trí IT/Back office.',
  },
  {
    icon: '🎁',
    title: 'Mua thuốc miễn phí',
    desc: 'Mỗi nhân viên được 2 triệu VND/tháng mua thuốc/thực phẩm chức năng miễn phí tại Long Châu.',
  },
  {
    icon: '📈',
    title: 'Lộ trình thăng tiến rõ ràng',
    desc: 'Đánh giá KPI 2 lần/năm. Quản lý nhà thuốc sau 18-24 tháng, ASM khu vực sau 3-5 năm.',
  },
];

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Cơ hội nghề nghiệp tại Long Châu"
      description="Gia nhập đội ngũ 5,000+ dược sĩ và nhân viên đang xây dựng hệ thống chăm sóc sức khỏe hàng đầu Việt Nam."
      breadcrumbs={[{ label: 'Tuyển dụng' }]}
      heroTone="accent"
    >
      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-6 mb-12">
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <p className="text-2xl font-bold text-ink-900 font-mono">2,000+</p>
          <p className="text-xs text-ink-500">Vị trí đang tuyển</p>
        </div>
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <p className="text-2xl font-bold text-ink-900 font-mono">34</p>
          <p className="text-xs text-ink-500">Tỉnh thành</p>
        </div>
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <p className="text-2xl font-bold text-ink-900 font-mono">18+</p>
          <p className="text-xs text-ink-500">Phòng ban</p>
        </div>
        <div className="p-4 bg-white border border-ink-200 rounded-md">
          <p className="text-2xl font-bold text-ink-900 font-mono">4.6/5</p>
          <p className="text-xs text-ink-500">Đánh giá nội bộ</p>
        </div>
      </div>

      {/* Departments */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Phòng ban đang tuyển
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DEPARTMENTS.map((d) => (
            <div
              key={d.name}
              className="p-4 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2" aria-hidden="true">{d.icon}</div>
              <p className="text-sm font-semibold text-ink-900">{d.name}</p>
              <p className="text-xs text-ink-500 mt-0.5">
                <span className="font-mono font-bold text-accent-700">{d.count}</span> vị trí
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open jobs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Vị trí nổi bật
        </h2>
        <ul className="space-y-3">
          {JOBS.map((j) => (
            <li key={j.title}>
              <a
                href="#"
                className="group block p-5 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-ink-900 group-hover:text-accent-700 transition-colors">
                      {j.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" aria-hidden="true" />
                        {j.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" aria-hidden="true" />
                        {j.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        {j.posted}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-accent-700 font-mono whitespace-nowrap">
                      {j.salary}
                    </p>
                    <p className="text-xs text-ink-500 whitespace-nowrap mt-0.5">{j.type}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end text-sm text-accent-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ứng tuyển ngay <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 px-4 h-10 text-sm font-semibold text-ink-900 bg-white border border-ink-200 rounded-md hover:border-accent-500 transition-colors"
          >
            Xem tất cả 2,000+ vị trí
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Phúc lợi dành cho bạn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <article
              key={b.title}
              className="p-5 bg-white border border-ink-200 rounded-md"
            >
              <div className="text-2xl mb-3" aria-hidden="true">{b.icon}</div>
              <h3 className="text-base font-semibold text-ink-900 mb-1.5">{b.title}</h3>
              <p className="text-sm text-ink-600 leading-relaxed">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 p-8 md:p-10 bg-gradient-to-br from-ink-900 to-accent-800 text-white rounded-md text-center">
        <GraduationCap className="w-10 h-10 mx-auto mb-3 text-accent-300" aria-hidden="true" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
          Bạn chưa tìm được vị trí phù hợp?
        </h2>
        <p className="mt-3 text-accent-100 max-w-2xl mx-auto">
          Gửi CV của bạn về <span className="font-mono font-semibold text-white">tuyendung@longchau.vn</span>.
          Chúng tôi sẽ liên hệ khi có vị trí phù hợp.
        </p>
        <a
          href="mailto:tuyendung@longchau.vn"
          className="mt-5 inline-flex items-center gap-2 px-5 h-11 bg-white text-ink-900 text-sm font-semibold rounded-md hover:bg-ink-50 transition-colors"
        >
          Gửi CV ngay
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </section>
    </StaticPageLayout>
  );
}
