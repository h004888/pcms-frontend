// =====================================================
// PCMS - EmptyState, LoadingSpinner, StatCard (vivid edition)
// Upgrades:
//   • StatCard có gradient icon container + corner glow + hover lift
//   • Color variants match design system palette (ink, accent, info, success, warning, danger)
// =====================================================

import clsx from "clsx";
import { ReactNode } from "react";
import {
	Inbox,
	TrendingUp,
	TrendingDown,
	Minus,
	type LucideIcon,
} from "lucide-react";

export function EmptyState({
	icon: Icon = Inbox,
	title = "Không có dữ liệu",
	description,
	action,
}: {
	icon?: LucideIcon;
	title?: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
			<div className="w-14 h-14 rounded-full bg-ink-50 flex items-center justify-center mb-3">
				<Icon className="w-7 h-7 text-ink-300" aria-hidden="true" />
			</div>
			<h3 className="text-base font-semibold text-ink-900 mb-1">{title}</h3>
			{description && (
				<p className="text-sm text-ink-500 max-w-sm mb-4">{description}</p>
			)}
			{action}
		</div>
	);
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
	const sizeClass = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" }[size];
	return (
		<div className="flex items-center justify-center py-8">
			<div
				className={clsx(
					"animate-spin rounded-full border-4 border-accent-500 border-t-transparent",
					sizeClass,
				)}
			></div>
		</div>
	);
}

export type StatColor =
	| "ink"
	| "accent"
	| "info"
	| "success"
	| "warning"
	| "danger";

export function StatCard({
	title,
	value,
	icon: Icon,
	trend,
	trendDirection = "up",
	color = "ink",
}: {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: string;
	trendDirection?: "up" | "down" | "flat";
	color?: StatColor;
}) {
	// Vivid color mapping: gradient icon container + corner glow
	const colorClasses: Record<
		StatColor,
		{
			bg: string;
			iconBg: string;
			iconText: string;
			glow: string;
			trend: string;
		}
	> = {
		ink: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-ink-700 to-ink-900",
			iconText: "text-white",
			glow: "bg-ink-100/50",
			trend: "text-ink-700",
		},
		accent: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-accent-500 to-accent-700",
			iconText: "text-white",
			glow: "bg-accent-100/50",
			trend: "text-accent-700",
		},
		info: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-info-500 to-info-700",
			iconText: "text-white",
			glow: "bg-info-100/50",
			trend: "text-info-700",
		},
		success: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-success-500 to-success-700",
			iconText: "text-white",
			glow: "bg-success-100/50",
			trend: "text-success-700",
		},
		warning: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-warning-500 to-warning-700",
			iconText: "text-white",
			glow: "bg-warning-100/50",
			trend: "text-warning-700",
		},
		danger: {
			bg: "bg-white",
			iconBg: "bg-gradient-to-br from-danger-500 to-danger-700",
			iconText: "text-white",
			glow: "bg-danger-100/50",
			trend: "text-danger-700",
		},
	};
	const c = colorClasses[color];

	const TrendIcon =
		trendDirection === "up"
			? TrendingUp
			: trendDirection === "down"
				? TrendingDown
				: Minus;

	return (
		<div
			className={clsx(
				"relative rounded-lg border border-ink-200 p-5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5",
				c.bg,
			)}
		>
			{/* Corner glow */}
			<div
				aria-hidden="true"
				className={clsx(
					"absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-50",
					c.glow,
				)}
			/>
			<div className="relative flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
						{title}
					</p>
					<p className="text-2xl md:text-3xl font-bold text-ink-900 mt-2 font-mono tabular-nums tracking-tight truncate">
						{value}
					</p>
					{trend && (
						<div
							className={clsx(
								"mt-2 inline-flex items-center gap-1 text-xs font-medium",
								c.trend,
							)}
						>
							<TrendIcon className="w-3 h-3" aria-hidden="true" />
							<span>{trend}</span>
						</div>
					)}
				</div>
				<div
					className={clsx(
						"flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ring-1 ring-black/5 shadow-sm",
						c.iconBg,
					)}
				>
					<Icon className={clsx("w-6 h-6", c.iconText)} aria-hidden="true" />
				</div>
			</div>
		</div>
	);
}
