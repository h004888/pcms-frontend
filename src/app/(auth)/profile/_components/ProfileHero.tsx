// =====================================================
// ProfileHero — gradient header với avatar + role chip
// Extracted từ profile page để giảm cyclomatic complexity
// =====================================================

"use client";

import {
	Calendar,
	Edit2,
	Award,
	Check,
	User,
	type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

const TIER_TONES: Record<string, { bg: string; text: string }> = {
	Bronze: { bg: "bg-warning-500", text: "text-white" },
	Silver: { bg: "bg-ink-300", text: "text-ink-900" },
	Gold: { bg: "bg-warning-500", text: "text-white" },
	Platinum: { bg: "bg-info-500", text: "text-white" },
	Diamond: { bg: "bg-info-500", text: "text-white" },
	VIP: {
		bg: "bg-gradient-to-br from-accent-500 to-accent-700",
		text: "text-white",
	},
};

// Tier lookup key — Vietnamese display names mapped to internal tier ids.
const TIER_KEY_BY_LABEL: Record<string, keyof typeof TIER_TONES> = {
	Đồng: "Bronze",
	Bạc: "Silver",
	Vàng: "Gold",
	"Bạch kim": "Platinum",
	"Kim cương": "Diamond",
	VIP: "VIP",
};

interface ProfileHeroProps {
	name: string;
	tier: string;
	memberSince: string;
	editing: boolean;
	onStartEdit: () => void;
}

export function ProfileHero({
	name,
	tier,
	memberSince,
	editing,
	onStartEdit,
}: ProfileHeroProps) {
	const toneKey = TIER_KEY_BY_LABEL[tier] ?? "Gold";
	const tone = TIER_TONES[toneKey];
	return (
		<div className="relative overflow-hidden bg-gradient-to-br from-accent-600 via-accent-700 to-ink-800 text-white rounded-2xl p-5 md:p-6">
			<div
				aria-hidden="true"
				className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-info-500/20"
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
			<div className="relative flex items-start gap-4">
				<div className="relative">
					<div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-accent-100 flex items-center justify-center text-2xl font-bold text-accent-700 ring-4 ring-white/20">
						{name.charAt(0).toUpperCase()}
					</div>
					<div
						aria-hidden="true"
						className="absolute -bottom-1 -right-1 w-5 h-5 bg-success-500 rounded-full ring-2 ring-accent-700 flex items-center justify-center"
					>
						<Check className="w-2.5 h-2.5 text-white" />
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/15 backdrop-blur border border-white/20 rounded-full text-xs font-semibold mb-2">
						<User className="w-3 h-3" aria-hidden="true" />
						Hồ sơ cá nhân
					</div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight truncate">
						{name}
					</h1>
					<div className="mt-2 flex items-center gap-2 flex-wrap">
						<span
							className={clsx(
								"inline-flex items-center gap-1 px-2 h-6 rounded-full text-xs font-bold",
								tone.bg,
								tone.text,
							)}
						>
							<Award className="w-3 h-3" aria-hidden="true" />
							Thành viên {tier}
						</span>
						<span className="inline-flex items-center gap-1 px-2 h-6 bg-white/15 backdrop-blur border border-white/20 rounded-full text-xs">
							<Calendar className="w-3 h-3" aria-hidden="true" />
							Từ {new Date(memberSince).toLocaleDateString("vi-VN")}
						</span>
					</div>
				</div>
				{!editing && (
					<button
						onClick={onStartEdit}
						className="inline-flex items-center gap-1.5 px-4 h-10 bg-white !text-accent-700 rounded-md text-sm font-bold hover:!bg-ink-50 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent-700"
					>
						<Edit2 className="w-4 h-4" aria-hidden="true" />
						Chỉnh sửa
					</button>
				)}
			</div>
		</div>
	);
}

// Helper exported for use by other profile components
export { TIER_TONES };
export type { LucideIcon };
