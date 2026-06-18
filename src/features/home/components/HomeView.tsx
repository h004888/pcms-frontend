// =====================================================
// PCMS - Home (Dashboard) View (SCR-HOME) — vivid edition
// Pharmacist's Workbench — bàn làm việc dược sĩ.
// Orchestrator — composes sub-components from _components/
// =====================================================

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui";
import { DashboardLayout } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { ROLE_LABELS, formatVND, formatDateTime } from "@/lib/utils";
import { fetchDashboardSummary } from "../services/dashboardService";

import { HomeGreeting, getShiftFromHour } from "./_components/HomeGreeting";
import { HomeStats } from "./_components/HomeStats";
import { HomeOrdersList } from "./_components/HomeOrdersList";
import { HomeLowStock } from "./_components/HomeLowStock";
import { HomeQuickActions } from "./_components/HomeQuickActions";

interface DashboardSummary {
	todayRevenue?: number;
	lowStock?: number;
	pendingOrders?: number;
	todayOrders?: number;
	expiringBatches?: number;
	recentOrders?: any[];
	lowStockItems?: any[];
}

export function HomeView() {
	const { state } = useAuth();
	const router = useRouter();
	const [stats, setStats] = useState({
		todayRevenue: 0,
		lowStock: 0,
		pendingOrders: 0,
		expiringBatches: 0,
	});
	const [recentOrders, setRecentOrders] = useState<any[]>([]);
	const [lowStockItems, setLowStockItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		load();
	}, []);

	async function load() {
		setError(null);
		setLoading(true);
		try {
			const summary: DashboardSummary = await fetchDashboardSummary();
			setStats({
				todayRevenue: summary.todayRevenue ?? 0,
				lowStock: summary.lowStock ?? 0,
				pendingOrders: summary.pendingOrders ?? summary.todayOrders ?? 0,
				expiringBatches: summary.expiringBatches ?? 0,
			});
			setRecentOrders(summary.recentOrders ?? []);
			setLowStockItems(summary.lowStockItems ?? []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Không tải được dữ liệu dashboard",
			);
		} finally {
			setLoading(false);
		}
	}

	const now = new Date();
	const shift = getShiftFromHour(now.getHours());
	const todayLabel = now.toLocaleDateString("vi-VN", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
	const timeNow = now.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
	});
	const fullName = state.user?.fullName;
	const roleLabel = state.user ? ROLE_LABELS[state.user.role] : undefined;
	const branchName = state.user?.branchId ? "Chi nhánh Quận 1" : undefined;

	return (
		<DashboardLayout>
			<HomeGreeting
				fullName={fullName || "bạn"}
				roleLabel={roleLabel}
				shift={shift}
				todayLabel={todayLabel}
				timeNow={timeNow}
				pendingOrders={stats.pendingOrders}
				lowStock={stats.lowStock}
				branchName={branchName}
			/>

			{error && !loading && (
				<Alert
					variant="danger"
					title="Không tải được dữ liệu dashboard"
					className="mb-6"
				>
					<div className="flex items-center justify-between gap-3">
						<span className="text-sm">{error}</span>
						<button
							onClick={load}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-danger-600 text-white hover:bg-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-1 transition-colors"
						>
							Thử lại
						</button>
					</div>
				</Alert>
			)}

			<HomeStats
				loading={loading}
				pendingOrders={stats.pendingOrders}
				lowStock={stats.lowStock}
				expiringBatches={stats.expiringBatches}
				todayRevenue={stats.todayRevenue}
				formatRevenue={formatVND}
			/>

			<section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
				<HomeOrdersList
					loading={loading}
					orders={recentOrders}
					formatDateTime={formatDateTime}
					formatVND={formatVND}
					onViewAll={() => router.push("/orders")}
				/>
				<HomeLowStock
					loading={loading}
					items={lowStockItems}
					onManage={() => router.push("/inventory")}
				/>
			</section>

			<HomeQuickActions onNavigate={(href) => router.push(href)} />
		</DashboardLayout>
	);
}

export function HomeViewSkeleton() {
	return (
		<DashboardLayout>
			<div className="space-y-6">
				<div className="h-32 bg-ink-100 rounded-2xl animate-pulse" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[0, 1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-[120px] bg-white rounded-lg border border-ink-200 animate-pulse"
						/>
					))}
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<div className="bg-white rounded-lg border border-ink-200 p-5 h-48 animate-pulse" />
					<div className="bg-white rounded-lg border border-ink-200 p-5 h-48 animate-pulse" />
				</div>
			</div>
		</DashboardLayout>
	);
}
