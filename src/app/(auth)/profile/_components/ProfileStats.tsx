// =====================================================
// ProfileStats — 3 stat cards ngay sau hero
// Extracted từ profile page
// =====================================================

import { Sparkles, Gift, Heart, type LucideIcon } from "lucide-react";

interface StatItem {
	icon: LucideIcon;
	label: string;
	value: string;
	color: "accent" | "warning" | "danger";
}

const COLOR_CLASSES: Record<StatItem["color"], string> = {
	accent: "text-accent-700 bg-accent-50",
	warning: "text-warning-700 bg-warning-50",
	danger: "text-danger-700 bg-danger-50",
};

export function ProfileStats({ stats }: { stats: StatItem[] }) {
	return (
		<div className="grid grid-cols-3 gap-3">
			{stats.map((s) => {
				const Icon = s.icon;
				return (
					<div
						key={s.label}
						className="flex items-center gap-3 p-3 bg-white border border-ink-200 rounded-lg"
					>
						<div
							className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${COLOR_CLASSES[s.color]}`}
						>
							<Icon className="w-5 h-5" aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<p className="text-xs text-ink-500 truncate">{s.label}</p>
							<p className="text-base font-bold text-ink-900 font-mono tabular-nums truncate">
								{s.value}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
