// =====================================================
// PCMS - Inventory List View (UC05) — vivid edition
// Upgrades: hero header, low-stock alert với action, batch rows với stock indicators
// =====================================================

"use client";

import { DashboardLayout } from "@/components/Layout";
import { ListPage } from "@/components/shared/ListPage";
import { Column, Alert } from "@/components/ui";
import { InventoryBatch } from "@/types";
import { formatDate } from "@/lib/utils";
import {
	Upload,
	Download,
	Truck,
	Boxes,
	AlertTriangle,
	Package,
	Calendar,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useApiDetail } from "@/hooks/useApi";
import clsx from "clsx";

export function InventoryList() {
	const lowStock = useApiDetail<InventoryBatch[]>("/inventory/low-stock");

	return (
		<DashboardLayout>
			{/* Hero header */}
			<div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-accent-800 text-white rounded-2xl mb-6 p-5 md:p-6">
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
				<div className="relative flex items-end justify-between gap-4 flex-wrap">
					<div>
						<div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold mb-2">
							<Boxes className="w-3 h-3 text-accent-300" aria-hidden="true" />
							UC05 — Quản lý tồn kho theo lô
						</div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
							Quản lý tồn kho
						</h1>
						<p className="mt-1.5 text-sm text-ink-200 text-pretty">
							Theo dõi tồn kho theo lô —{" "}
							<span className="font-semibold text-accent-300">BR02</span> cảnh
							báo dưới min ·{" "}
							<span className="font-semibold text-accent-300">BR03</span> cảnh
							báo hết hạn.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Link
							href="/inventory/import"
							className="inline-flex items-center gap-2 px-4 h-10 bg-white !text-ink-900 rounded-md text-sm font-semibold hover:!bg-ink-50 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
						>
							<Upload className="w-4 h-4" />
							Nhập kho
						</Link>
						<Link
							href="/inventory/export"
							className="inline-flex items-center gap-2 px-4 h-10 bg-white/10 backdrop-blur border border-white/30 text-white rounded-md text-sm font-semibold hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
						>
							<Download className="w-4 h-4" />
							Xuất kho
						</Link>
						<Link
							href="/inventory/transfer"
							className="inline-flex items-center gap-2 px-4 h-10 bg-white/10 backdrop-blur border border-white/30 text-white rounded-md text-sm font-semibold hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
						>
							<Truck className="w-4 h-4" />
							Chuyển kho
						</Link>
					</div>
				</div>
			</div>

			{/* Low-stock alert */}
			{lowStock.data && lowStock.data.length > 0 && (
				<div className="mb-6 p-4 bg-gradient-to-br from-warning-50 to-warning-100/50 border border-warning-200 rounded-lg">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
							<AlertTriangle
								className="w-5 h-5 text-warning-700"
								aria-hidden="true"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between gap-3 flex-wrap">
								<div>
									<p className="text-sm font-bold text-warning-900">
										{lowStock.data.length} lô dưới mức tối thiểu · BR02
									</p>
									<p className="text-xs text-warning-700 mt-0.5">
										Cần nhập thêm trước khi hết hàng
									</p>
								</div>
								<Link
									href="/inventory/import"
									className="inline-flex items-center gap-1 text-xs font-bold text-warning-800 hover:text-warning-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-500 rounded"
								>
									Tạo phiếu nhập
									<ArrowRight className="w-3 h-3" aria-hidden="true" />
								</Link>
							</div>
							<ul className="text-xs space-y-1 mt-3 text-warning-900">
								{lowStock.data.slice(0, 3).map((b) => (
									<li key={b.id} className="flex items-center gap-2">
										<span
											className="w-1 h-1 rounded-full bg-warning-500"
											aria-hidden="true"
										/>
										<span>
											<strong className="font-mono">Lô {b.batchNo}</strong>: còn{" "}
											<strong>{b.qtyOnHand}</strong> (min: {b.minStockLevel})
										</span>
									</li>
								))}
								{lowStock.data.length > 3 && (
									<li className="italic text-warning-700">
										...và {lowStock.data.length - 3} lô khác
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			)}

			<ListPage<InventoryBatch>
				title=""
				subtitle={`${lowStock.data?.length || 0} lô dưới mức tối thiểu`}
				endpoint="/inventory"
				columns={[
					{
						key: "batchNo",
						header: "Mã lô",
						width: "140px",
						render: (b) => (
							<div className="flex items-center gap-2">
								<div className="w-7 h-7 bg-ink-50 rounded-md flex items-center justify-center">
									<Package
										className="w-3.5 h-3.5 text-ink-500"
										aria-hidden="true"
									/>
								</div>
								<span className="font-mono font-semibold text-ink-900">
									{b.batchNo}
								</span>
							</div>
						),
					},
					{
						key: "medicineId",
						header: "Medicine",
						render: (b) => (
							<span className="text-xs font-mono text-ink-600">
								{b.medicineId?.slice(0, 8)}...
							</span>
						),
					},
					{
						key: "branchId",
						header: "Branch",
						render: (b) => (
							<span className="text-xs font-mono text-ink-600">
								{b.branchId?.slice(0, 8)}...
							</span>
						),
					},
					{
						key: "qtyOnHand",
						header: "SL tồn",
						width: "110px",
						align: "right",
						render: (b) => {
							const isLow = b.qtyOnHand < b.minStockLevel;
							return (
								<span
									className={clsx(
										"inline-flex items-center gap-1.5 px-2 h-6 rounded-md border text-xs font-mono font-bold",
										isLow
											? "bg-danger-50 border-danger-200 text-danger-700"
											: "bg-success-50 border-success-200 text-success-700",
									)}
								>
									{isLow && (
										<AlertTriangle className="w-3 h-3" aria-hidden="true" />
									)}
									{b.qtyOnHand}
								</span>
							);
						},
					},
					{
						key: "minStock",
						header: "Min",
						width: "80px",
						align: "right",
						render: (b) => (
							<span className="text-xs font-mono text-ink-500">
								{b.minStockLevel}
							</span>
						),
					},
					{
						key: "expiryDate",
						header: "Hết hạn",
						width: "130px",
						render: (b) => (
							<span className="inline-flex items-center gap-1.5 text-xs text-ink-700">
								<Calendar className="w-3 h-3 text-ink-400" aria-hidden="true" />
								{formatDate(b.expiryDate)}
							</span>
						),
					},
				]}
				searchPlaceholder="Tìm theo mã lô..."
				canAdd={false}
				emptyMessage="Chưa có lô hàng nào trong kho"
			/>
		</DashboardLayout>
	);
}
