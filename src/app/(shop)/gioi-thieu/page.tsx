// =====================================================
// PAGE-ABOUT — /gioi-thieu (vivid edition)
// Về FPT Long Châu + sứ mệnh + tầm nhìn + giá trị cốt lõi
// Upgrades: hero header, stats strip vivid, colored value cards, timeline với accent line
// =====================================================

import { StaticPageLayout, Prose } from "@/components/shop";
import {
	Building2,
	Target,
	Heart,
	Award,
	Users,
	MapPin,
	ArrowRight,
	Sparkles,
	Calendar,
	Pill,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import clsx from "clsx";

export const metadata: Metadata = {
	title: "Giới thiệu về Long Châu",
	description:
		"FPT Long Châu — Hệ thống nhà thuốc bán lẻ hiện đại với 2,600+ chi nhánh toàn quốc. Sứ mệnh chăm sóc sức khỏe cộng đồng Việt Nam.",
};

const VALUES = [
	{
		icon: Heart,
		title: "Tận tâm vì sức khỏe",
		description:
			"Mỗi sản phẩm, mỗi lời tư vấn đều hướng đến sức khỏe và sự an tâm của khách hàng.",
		color: "danger",
	},
	{
		icon: Award,
		title: "Chính hãng 100%",
		description:
			"Cam kết thuốc chính hãng, có nguồn gốc rõ ràng, bảo quản đúng tiêu chuẩn GPP.",
		color: "accent",
	},
	{
		icon: Users,
		title: "Đội ngũ chuyên môn cao",
		description:
			'Hơn 5.000 dược sĩ được đào tạo bài bản, tư vấn "đúng thuốc, đúng liều, đúng cách, đúng giá".',
		color: "info",
	},
	{
		icon: Sparkles,
		title: "Công nghệ phục vụ con người",
		description:
			"Ứng dụng AI, push notification nhắc thuốc, đặt lịch online — công nghệ giúp chăm sóc dễ dàng hơn.",
		color: "success",
	},
];

const VALUE_TONES = {
	danger: {
		bg: "bg-danger-50",
		ring: "hover:border-danger-300",
		iconBg: "bg-danger-600",
		iconText: "text-white",
	},
	accent: {
		bg: "bg-accent-50",
		ring: "hover:border-accent-300",
		iconBg: "bg-accent-600",
		iconText: "text-white",
	},
	info: {
		bg: "bg-info-50",
		ring: "hover:border-info-300",
		iconBg: "bg-info-600",
		iconText: "text-white",
	},
	success: {
		bg: "bg-success-50",
		ring: "hover:border-success-300",
		iconBg: "bg-success-600",
		iconText: "text-white",
	},
};

const MILESTONES = [
	{
		year: "2007",
		event: "Thành lập Công ty CP Dược phẩm FPT Long Châu",
		highlight: false,
	},
	{ year: "2014", event: "Đạt 100 nhà thuốc trên toàn quốc", highlight: false },
	{
		year: "2018",
		event: "Ra mắt nền tảng e-commerce, giao hàng tận nơi",
		highlight: false,
	},
	{
		year: "2021",
		event: "Vượt 1.000 nhà thuốc — Top đầu ngành dược phẩm Việt Nam",
		highlight: true,
	},
	{
		year: "2023",
		event: 'Ra mắt "Tài khoản Gia đình" + Ví Khỏe Nhà Ta',
		highlight: false,
	},
	{
		year: "2025",
		event: "Hợp tác IHH Singapore về chuyên trang ung thư",
		highlight: false,
	},
	{
		year: "2026",
		event:
			"2.678+ nhà thuốc, 34 tỉnh thành, giải Healthcare Asia Pharma Awards",
		highlight: true,
	},
];

const STATS = [
	{ icon: Building2, value: "2.678+", label: "Nhà thuốc toàn quốc" },
	{ icon: MapPin, value: "34", label: "Tỉnh thành phục vụ" },
	{ icon: Users, value: "5.000+", label: "Dược sĩ tận tâm" },
	{ icon: Heart, value: "50M+", label: "Lượt khách hàng/năm" },
];

export default function AboutPage() {
	return (
		<StaticPageLayout
			title="Về FPT Long Châu"
			description="Hệ thống nhà thuốc bán lẻ hiện đại, đặt sức khỏe cộng đồng làm trọng tâm. Hơn 18 năm đồng hành cùng người Việt."
			breadcrumbs={[{ label: "Giới thiệu" }]}
			heroTone="accent"
		>
			{/* Hero intro — gradient + stats strip */}
			<section className="mb-12 -mt-6">
				<div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white rounded-2xl p-6 md:p-8">
					<div
						aria-hidden="true"
						className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent-500/25"
					/>
					<div
						aria-hidden="true"
						className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-info-500/15"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 opacity-[0.08]"
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
							backgroundSize: "24px 24px",
						}}
					/>
					<div className="relative">
						<div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold mb-3">
							<Pill className="w-3 h-3 text-accent-300" aria-hidden="true" />
							Hệ thống nhà thuốc hiện đại nhất Việt Nam
						</div>
						<h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
							Sứ mệnh của chúng tôi
						</h2>
						<p className="mt-3 text-sm md:text-base text-ink-200 max-w-3xl text-pretty leading-relaxed">
							Mỗi người Việt đều xứng đáng được tiếp cận thuốc chính hãng với
							giá hợp lý, cùng sự tư vấn tận tình từ đội ngũ dược sĩ chuyên môn
							cao.
						</p>

						{/* Stats grid */}
						<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
							{STATS.map((s) => {
								const Icon = s.icon;
								return (
									<div
										key={s.label}
										className="p-3 bg-white/5 backdrop-blur border border-white/10 rounded-lg"
									>
										<div className="flex items-center gap-2 mb-1">
											<Icon
												className="w-3.5 h-3.5 text-accent-300"
												aria-hidden="true"
											/>
											<p className="text-xs text-ink-300">{s.label}</p>
										</div>
										<p className="text-2xl font-bold text-accent-300 font-mono tabular-nums">
											{s.value}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			{/* Mission */}
			<section className="mb-12">
				<Prose>
					<h2>Sứ mệnh &amp; Tầm nhìn</h2>
					<p>
						<strong>Long Châu</strong> ra đời với sứ mệnh mang đến cho người
						Việt một hệ thống chăm sóc sức khỏe hiện đại, đáng tin cậy và dễ
						tiếp cận. Chúng tôi tin rằng mỗi người dân đều xứng đáng được tiếp
						cận thuốc chính hãng với giá hợp lý, cùng sự tư vấn tận tình từ đội
						ngũ dược sĩ chuyên môn cao.
					</p>
					<p>
						Trở thành <strong>hệ thống chăm sóc sức khỏe số 1 Việt Nam</strong>,
						nơi mỗi khách hàng đều có một &ldquo;người bạn tại quầy&rdquo; —
						dược sĩ Long Châu — đồng hành trong hành trình sức khỏe từ khi mua
						thuốc đến khi uống thuốc đúng giờ, đúng liều.
					</p>
				</Prose>
			</section>

			{/* Core values */}
			<section className="mb-12">
				<div className="flex items-end justify-between mb-6">
					<div>
						<div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700 mb-2">
							<Target className="w-3.5 h-3.5" aria-hidden="true" />
							Cam kết của chúng tôi
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance">
							Giá trị cốt lõi
						</h2>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{VALUES.map((v) => {
						const Icon = v.icon;
						const tone = VALUE_TONES[v.color as keyof typeof VALUE_TONES];
						return (
							<article
								key={v.title}
								className={clsx(
									"group relative p-5 md:p-6 rounded-lg border border-ink-200 transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5",
									tone.bg,
									tone.ring,
								)}
							>
								<div
									aria-hidden="true"
									className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-300"
								/>
								<div className="relative flex items-start gap-4">
									<div
										className={clsx(
											"flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
											tone.iconBg,
										)}
									>
										<Icon
											className={clsx("w-6 h-6", tone.iconText)}
											aria-hidden="true"
										/>
									</div>
									<div className="min-w-0">
										<h3 className="text-base md:text-lg font-bold text-ink-900 mb-1.5 leading-tight">
											{v.title}
										</h3>
										<p className="text-sm text-ink-700 leading-relaxed text-pretty">
											{v.description}
										</p>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			</section>

			{/* Timeline */}
			<section className="mb-12">
				<div className="flex items-end justify-between mb-6">
					<div>
						<div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-700 mb-2">
							<Calendar className="w-3.5 h-3.5" aria-hidden="true" />
							Hành trình phát triển
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-tight text-balance">
							18 năm đồng hành
						</h2>
					</div>
				</div>

				{/* Timeline — vertical with accent stripe */}
				<div className="relative pl-6 md:pl-10">
					{/* Vertical accent line */}
					<div
						aria-hidden="true"
						className="absolute left-2 md:left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-accent-500 via-accent-300 to-info-500"
					/>
					<ol className="space-y-3">
						{MILESTONES.map((m) => (
							<li key={m.year} className="relative">
								{/* Dot on the line */}
								<div
									aria-hidden="true"
									className={clsx(
										"absolute -left-[18px] md:-left-[34px] top-3.5 w-4 h-4 rounded-full ring-4 ring-white",
										m.highlight
											? "bg-gradient-to-br from-accent-500 to-accent-700 shadow-md"
											: "bg-ink-200",
									)}
								/>
								<div
									className={clsx(
										"flex items-start gap-4 p-4 rounded-lg border transition-colors",
										m.highlight
											? "bg-gradient-to-br from-accent-50 to-white border-accent-200"
											: "bg-white border-ink-200",
									)}
								>
									<div
										className={clsx(
											"flex-shrink-0 w-16 h-12 rounded-md flex items-center justify-center font-mono",
											m.highlight
												? "bg-gradient-to-br from-accent-600 to-accent-700 text-white shadow-sm"
												: "bg-ink-100 text-ink-900",
										)}
									>
										<span className="text-sm font-bold">{m.year}</span>
									</div>
									<div className="flex-1 min-w-0 pt-1">
										<p
											className={clsx(
												"text-sm md:text-base leading-relaxed",
												m.highlight
													? "font-semibold text-ink-900"
													: "text-ink-700",
											)}
										>
											{m.event}
										</p>
										{m.highlight && (
											<span className="inline-flex items-center gap-1 mt-1.5 px-2 h-5 bg-accent-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
												<Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
												Cột mốc
											</span>
										)}
									</div>
								</div>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* CTA — chuyển sang tra cứu / đặt lịch */}
			<section className="mb-6">
				<div className="relative overflow-hidden bg-gradient-to-br from-accent-600 to-accent-700 text-white rounded-2xl p-6 md:p-8">
					<div
						aria-hidden="true"
						className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10"
					/>
					<div className="relative flex items-center justify-between gap-4 flex-wrap">
						<div>
							<h3 className="text-xl md:text-2xl font-bold tracking-tight text-balance">
								Trải nghiệm PCMS ngay hôm nay
							</h3>
							<p className="mt-2 text-sm text-accent-100 text-pretty">
								Tra cứu thuốc, đặt lịch tư vấn dược sĩ, hoặc tìm nhà thuốc gần
								bạn.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<Link
								href="/tra-cuu-thuoc"
								className="inline-flex items-center gap-2 px-5 h-11 bg-white !text-accent-700 rounded-md text-sm font-bold hover:!bg-ink-50 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent-600"
							>
								Tra cứu thuốc
								<ArrowRight className="w-4 h-4" aria-hidden="true" />
							</Link>
							<Link
								href="/he-thong-cua-hang"
								className="inline-flex items-center gap-2 px-5 h-11 bg-white/10 backdrop-blur border border-white/30 text-white rounded-md text-sm font-semibold hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent-600"
							>
								Tìm nhà thuốc
							</Link>
						</div>
					</div>
				</div>
			</section>
		</StaticPageLayout>
	);
}
