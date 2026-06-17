// =====================================================
// PAGE-ABOUT — /gioi-thieu
// Về FPT Long Châu + sứ mệnh + tầm nhìn + giá trị cốt lõi
// =====================================================

import { StaticPageLayout, Prose } from '@/components/shop';
import { Building2, Target, Heart, Award, Users, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu về Long Châu',
  description: 'FPT Long Châu — Hệ thống nhà thuốc bán lẻ hiện đại với 2,600+ chi nhánh toàn quốc. Sứ mệnh chăm sóc sức khỏe cộng đồng Việt Nam.',
};

const VALUES = [
  {
    icon: Heart,
    title: 'Tận tâm vì sức khỏe',
    description:
      'Mỗi sản phẩm, mỗi lời tư vấn đều hướng đến sức khỏe và sự an tâm của khách hàng.',
  },
  {
    icon: Award,
    title: 'Chính hãng 100%',
    description:
      'Cam kết thuốc chính hãng, có nguồn gốc rõ ràng, bảo quản đúng tiêu chuẩn GPP.',
  },
  {
    icon: Users,
    title: 'Đội ngũ chuyên môn cao',
    description:
      'Hơn 5,000 dược sĩ được đào tạo bài bản, tư vấn "đúng thuốc, đúng liều, đúng cách, đúng giá".',
  },
  {
    icon: Target,
    title: 'Công nghệ phục vụ con người',
    description:
      'Ứng dụng AI, push notification nhắc thuốc, đặt lịch online — công nghệ giúp chăm sóc dễ dàng hơn.',
  },
];

const MILESTONES = [
  { year: '2007', event: 'Thành lập Công ty CP Dược phẩm FPT Long Châu' },
  { year: '2014', event: 'Đạt 100 nhà thuốc trên toàn quốc' },
  { year: '2018', event: 'Ra mắt nền tảng e-commerce, giao hàng tận nơi' },
  { year: '2021', event: 'Vượt 1,000 nhà thuốc — Top đầu ngành dược phẩm Việt Nam' },
  { year: '2023', event: 'Ra mắt "Tài khoản Gia đình" + Ví Khỏe Nhà Ta' },
  { year: '2025', event: 'Hợp tác IHH Singapore về chuyên trang ung thư' },
  { year: '2026', event: '2,678+ nhà thuốc, 34 tỉnh thành, giải Healthcare Asia Pharma Awards' },
];

const STATS = [
  { icon: Building2, value: '2,678+', label: 'Nhà thuốc toàn quốc' },
  { icon: MapPin, value: '34', label: 'Tỉnh thành phục vụ' },
  { icon: Users, value: '5,000+', label: 'Dược sĩ tận tâm' },
  { icon: Heart, value: '50M+', label: 'Lượt khách hàng/năm' },
];

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="Về FPT Long Châu"
      description="Hệ thống nhà thuốc bán lẻ hiện đại, đặt sức khỏe cộng đồng làm trọng tâm. Hơn 18 năm đồng hành cùng người Việt."
      breadcrumbs={[{ label: 'Giới thiệu' }]}
      heroTone="accent"
    >
      {/* Stats strip */}
      <section className="mb-12 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 p-4 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-accent-50 rounded-md flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-700" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-ink-900 font-mono">{s.value}</p>
                  <p className="text-xs text-ink-500 truncate">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <Prose>
          <h2>Sứ mệnh</h2>
          <p>
            <strong>Long Châu</strong> ra đời với sứ mệnh mang đến cho người Việt một hệ thống chăm sóc
            sức khỏe hiện đại, đáng tin cậy và dễ tiếp cận. Chúng tôi tin rằng mỗi người dân đều xứng
            đáng được tiếp cận thuốc chính hãng với giá hợp lý, cùng sự tư vấn tận tình từ đội ngũ dược
            sĩ chuyên môn cao.
          </p>

          <h2>Tầm nhìn</h2>
          <p>
            Trở thành <strong>hệ thống chăm sóc sức khỏe số 1 Việt Nam</strong>, nơi mỗi khách
            hàng đều có một "người bạn tại quầy" — dược sĩ Long Châu — đồng hành trong hành trình sức
            khỏe từ khi mua thuốc đến khi uống thuốc đúng giờ, đúng liều.
          </p>
        </Prose>
      </section>

      {/* Core values */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <article
                key={v.title}
                className="flex gap-4 p-5 bg-white border border-ink-200 rounded-md"
              >
                <div className="flex-shrink-0 w-11 h-11 bg-accent-50 rounded-md flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-700" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink-900 mb-1">{v.title}</h3>
                  <p className="text-sm text-ink-600 leading-relaxed">{v.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold text-ink-900 tracking-tight mb-6 text-balance">
          Hành trình 18 năm
        </h2>
        <ol className="space-y-3">
          {MILESTONES.map((m, idx) => (
            <li
              key={m.year}
              className="flex gap-4 p-4 bg-white border border-ink-200 rounded-md"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-ink-900 text-white rounded-md flex flex-col items-center justify-center font-mono">
                <span className="text-base font-bold leading-none">{m.year}</span>
              </div>
              <div className="flex-1 flex items-center">
                <p className="text-sm text-ink-700 leading-relaxed">{m.event}</p>
              </div>
              {idx < MILESTONES.length - 1 && (
                <span className="sr-only">Cột mốc tiếp theo →</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </StaticPageLayout>
  );
}
