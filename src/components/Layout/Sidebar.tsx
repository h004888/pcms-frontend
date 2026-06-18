// =====================================================
// PCMS - Sidebar Navigation with role-based menu (vivid edition)
// Visual upgrades:
//   • Logo block với gradient bg + accent dot indicator
//   • Active item có left accent stripe (subtle, 2px)
//   • Group headers dùng color dot + uppercase semantic naming
//   • Footer với gradient bar + version info
// =====================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/lib/auth";
import { getMenuForRole } from "@/lib/config";
import { Pill } from "lucide-react";

export function Sidebar() {
	const pathname = usePathname();
	const { state } = useAuth();
	const menuGroups = getMenuForRole(state.user?.role);

	return (
		<aside className="w-64 bg-white border-r border-ink-200 flex flex-col h-screen sticky top-0 relative overflow-hidden">
			{/* Subtle accent strip on left edge */}
			<div
				aria-hidden="true"
				className="absolute top-0 left-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-500 via-accent-400 to-info-500"
			/>

			{/* Logo */}
			<div className="px-5 py-4 border-b border-ink-200 flex items-center gap-2.5 relative">
				<div className="relative">
					<div className="p-2 bg-gradient-to-br from-ink-900 to-ink-800 rounded-lg shadow-sm">
						<Pill className="w-5 h-5 text-accent-400" aria-hidden="true" />
					</div>
					<div
						aria-hidden="true"
						className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-500 rounded-full ring-2 ring-white"
					/>
				</div>
				<div>
					<h1 className="text-sm font-bold text-ink-900 leading-none tracking-tight">
						PCMS
					</h1>
					<p className="text-[10px] text-ink-500 mt-0.5 uppercase tracking-wider font-semibold">
						Pharmacy Chain
					</p>
				</div>
			</div>

			{/* Nav */}
			<nav
				className="flex-1 overflow-y-auto py-4 scrollbar-thin"
				aria-label="Menu chính"
			>
				{menuGroups.map((group, groupIdx) => (
					<div
						key={group.title}
						className={groupIdx === 0 ? "px-3 mb-4" : "px-3 mb-4 mt-2"}
					>
						<div className="flex items-center gap-1.5 px-2 mb-2">
							<div
								aria-hidden="true"
								className="w-1.5 h-1.5 rounded-full bg-accent-500"
							/>
							<p className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">
								{group.title}
							</p>
						</div>
						<ul>
							{group.items.map((item) => {
								const Icon = item.icon;
								const isActive =
									pathname === item.href ||
									pathname.startsWith(item.href + "/");
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											aria-current={isActive ? "page" : undefined}
											className={clsx(
												"relative flex items-center gap-3 pl-3 pr-3 py-2 rounded-md text-sm transition-colors group",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1",
												isActive
													? "bg-accent-50 text-accent-800 font-semibold"
													: "text-ink-700 hover:bg-ink-50",
											)}
										>
											{/* Active left accent stripe */}
											{isActive && (
												<span
													aria-hidden="true"
													className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-accent-600 rounded-full"
												/>
											)}
											<Icon
												className={clsx(
													"w-4 h-4 transition-colors",
													isActive
														? "text-accent-700"
														: "text-ink-400 group-hover:text-ink-600",
												)}
												aria-hidden="true"
											/>
											<span className="flex-1 truncate">{item.label}</span>
											{item.badge && (
												<span className="px-1.5 h-4 bg-danger-600 text-white text-[10px] font-bold rounded-full flex items-center font-mono">
													{item.badge}
												</span>
											)}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</nav>

			{/* Footer */}
			<div className="border-t border-ink-200">
				<div className="px-5 py-3 bg-gradient-to-b from-transparent to-ink-50/50">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-2 h-2 rounded-full bg-success-500 ring-2 ring-success-100" />
						<p className="text-xs font-medium text-success-700">Đang đồng bộ</p>
					</div>
					<p className="text-[11px] text-ink-500 font-mono">Phiên bản 1.0.0</p>
					<p className="text-[11px] text-ink-500">© 2026 PCMS</p>
				</div>
			</div>
		</aside>
	);
}
