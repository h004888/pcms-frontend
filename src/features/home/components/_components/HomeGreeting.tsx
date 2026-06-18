// =====================================================
// HomeGreeting — hero header với greeting, shift chip, role badge
// Extracted từ HomeView để giảm cyclomatic complexity
// =====================================================

import { Activity, Clock } from "lucide-react";

export type Shift = "Ca sáng" | "Ca chiều" | "Ca tối";

export function getShiftFromHour(hour: number): Shift {
	if (hour < 11) return "Ca sáng";
	if (hour < 17) return "Ca chiều";
	return "Ca tối";
}

export function getGreetingFromShift(shift: Shift): string {
	switch (shift) {
		case "Ca sáng":
			return "Buổi sáng tốt lành";
		case "Ca chiều":
			return "Buổi chiều năng suất";
		case "Ca tối":
			return "Ca tối bận rộn";
	}
}

export function buildInsight(
	shift: Shift,
	pendingOrders: number,
	lowStock: number,
): string {
	const parts: string[] = ["Ca làm việc hôm nay"];
	if (pendingOrders > 0) parts.push(`${pendingOrders} đơn chờ xử lý, `);
	parts.push(
		lowStock > 0 ? `${lowStock} lô tồn kho thấp.` : "mọi thứ đang ổn.",
	);
	return parts.join(" — ");
}

interface HomeGreetingProps {
	fullName: string;
	roleLabel?: string;
	shift: Shift;
	todayLabel: string;
	timeNow: string;
	pendingOrders: number;
	lowStock: number;
	branchName?: string;
}

export function HomeGreeting({
	fullName,
	roleLabel,
	shift,
	todayLabel,
	timeNow,
	pendingOrders,
	lowStock,
	branchName,
}: HomeGreetingProps) {
	const greeting = getGreetingFromShift(shift);
	const lastName = fullName?.split(" ").slice(-1)[0] || "bạn";
	const insight = buildInsight(shift, pendingOrders, lowStock);

	return (
		<div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white rounded-2xl mb-6 p-5 md:p-6">
			{/* Ambient glows */}
			<div
				aria-hidden="true"
				className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent-500/25"
			/>
			<div
				aria-hidden="true"
				className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-info-500/15"
			/>
			{/* Dot pattern */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>
			<div className="relative flex items-start justify-between gap-4 flex-wrap">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2 flex-wrap">
						<span className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold">
							<Activity
								className="w-3 h-3 text-accent-300"
								aria-hidden="true"
							/>
							{shift} · {todayLabel}
						</span>
						<span className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/5 border border-white/10 rounded-full text-xs text-ink-200 font-mono">
							<Clock className="w-3 h-3" aria-hidden="true" />
							{timeNow}
						</span>
						{roleLabel && (
							<span className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-accent-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
								{roleLabel}
							</span>
						)}
					</div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
						{greeting}, <span className="text-accent-300">{lastName}</span>
					</h1>
					<p className="mt-1.5 text-sm text-ink-200 text-pretty">{insight}</p>
				</div>
				{/* Quick meta on right */}
				<div className="hidden md:flex items-center gap-2">
					<div className="px-3 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-md">
						<p className="text-[10px] text-ink-300 uppercase tracking-wider">
							Chi nhánh
						</p>
						<p className="text-sm font-semibold mt-0.5">{branchName ?? "—"}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
