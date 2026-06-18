// =====================================================
// HomeQuickActions — 1 primary + 3 outline tiles
// Extracted từ HomeView
// =====================================================

import Link from "next/link";
import {
	ShoppingCart,
	Boxes,
	Pill,
	PillBottle,
	ArrowRight,
	type LucideIcon,
} from "lucide-react";

export interface QuickAction {
	label: string;
	desc: string;
	icon: LucideIcon;
	href: string;
	variant: "primary" | "outline";
}

const QUICK_ACTIONS: QuickAction[] = [
	{
		label: "Tạo đơn hàng",
		icon: ShoppingCart,
		href: "/orders/new",
		variant: "primary",
		desc: "POS nhanh",
	},
	{
		label: "Nhập kho",
		icon: Boxes,
		href: "/inventory/import",
		variant: "outline",
		desc: "Từ nhà cung cấp",
	},
	{
		label: "Tra thuốc",
		icon: Pill,
		href: "/search",
		variant: "outline",
		desc: "SKU / hoạt chất",
	},
	{
		label: "Thêm khách",
		icon: PillBottle,
		href: "/customers",
		variant: "outline",
		desc: "Tạo hồ sơ",
	},
];

interface HomeQuickActionsProps {
	onNavigate: (href: string) => void;
}

export function HomeQuickActions({ onNavigate }: HomeQuickActionsProps) {
	return (
		<section className="mt-6" aria-label="Truy cập nhanh">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-base font-bold text-ink-900">Truy cập nhanh</h2>
				<span className="text-xs text-ink-500">Phím tắt cho ca làm việc</span>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{QUICK_ACTIONS.map((action) => {
					const isPrimary = action.variant === "primary";
					return (
						<Link
							key={action.href}
							href={action.href}
							onClick={(e) => {
								e.preventDefault();
								onNavigate(action.href);
							}}
							className={
								isPrimary
									? "group relative overflow-hidden flex flex-col items-start justify-center gap-1.5 p-5 rounded-lg bg-gradient-to-br from-ink-900 to-ink-800 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
									: "group flex flex-col items-start justify-center gap-1.5 p-5 rounded-lg bg-white border border-ink-200 text-ink-700 hover:border-accent-500 hover:-translate-y-0.5 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
							}
						>
							{isPrimary && (
								<div
									aria-hidden="true"
									className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent-500/20 group-hover:scale-125 transition-transform"
								/>
							)}
							<div className="relative flex items-center justify-between w-full">
								<action.icon
									className={
										isPrimary
											? "w-5 h-5 text-accent-400"
											: "w-5 h-5 text-accent-600"
									}
									aria-hidden="true"
								/>
								<ArrowRight
									className={
										isPrimary
											? "w-4 h-4 text-ink-300 group-hover:translate-x-0.5 transition-transform"
											: "w-4 h-4 text-ink-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all"
									}
									aria-hidden="true"
								/>
							</div>
							<p
								className={`relative text-sm font-bold ${isPrimary ? "text-white" : "text-ink-900"}`}
							>
								{action.label}
							</p>
							<p
								className={`relative text-xs ${isPrimary ? "text-ink-300" : "text-ink-500"}`}
							>
								{action.desc}
							</p>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
