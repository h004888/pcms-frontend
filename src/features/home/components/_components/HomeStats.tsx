// =====================================================
// HomeStats — 4 stat cards row
// Extracted từ HomeView
// =====================================================

import { StatCard, type StatColor } from "@/components/ui/Feedback";
import {
	TrendingUp,
	AlertTriangle,
	ShoppingCart,
	PillBottle,
	type LucideIcon,
} from "lucide-react";

export interface HomeStatItem {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend: string;
	trendDirection: "up" | "down" | "flat";
	color: StatColor;
}

interface HomeStatsProps {
	loading: boolean;
	pendingOrders: number;
	lowStock: number;
	expiringBatches: number;
	todayRevenue: number;
	formatRevenue: (v: number) => string;
}

export function HomeStats({
	loading,
	pendingOrders,
	lowStock,
	expiringBatches,
	todayRevenue,
	formatRevenue,
}: HomeStatsProps) {
	if (loading) {
		return (
			<section
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
				aria-hidden="true"
			>
				{[0, 1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white rounded-lg border border-ink-200 p-5 animate-pulse h-[120px]"
					/>
				))}
			</section>
		);
	}

	const items: HomeStatItem[] = [
		{
			title: "Doanh thu hôm nay",
			value: formatRevenue(todayRevenue),
			icon: TrendingUp,
			trend: "+12% so với hôm qua",
			trendDirection: "up",
			color: "accent",
		},
		{
			title: "Tồn kho thấp",
			value: lowStock,
			icon: AlertTriangle,
			trend: lowStock > 0 ? "Cần nhập gấp" : "Đầy đủ",
			trendDirection: lowStock > 0 ? "down" : "flat",
			color: "warning",
		},
		{
			title: "Đơn chờ thanh toán",
			value: pendingOrders,
			icon: ShoppingCart,
			trend: "Cần xử lý hôm nay",
			trendDirection: "up",
			color: "info",
		},
		{
			title: "Lô sắp hết hạn",
			value: expiringBatches,
			icon: PillBottle,
			trend: expiringBatches > 0 ? "Trong 30 ngày" : "Ổn định",
			trendDirection: expiringBatches > 0 ? "down" : "flat",
			color: "danger",
		},
	];

	return (
		<section
			aria-label="Số liệu ca làm việc"
			aria-live="polite"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
		>
			{items.map((item) => (
				<StatCard
					key={item.title}
					title={item.title}
					value={item.value}
					icon={item.icon}
					trend={item.trend}
					trendDirection={item.trendDirection}
					color={item.color}
				/>
			))}
		</section>
	);
}
