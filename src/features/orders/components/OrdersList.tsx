// =====================================================
// PCMS - Orders List View (vivid edition)
// Upgrades:
//   • Hero header với ambient gradient + stats chips
//   • Status pills với dot indicators + icons
//   • Better action buttons
// =====================================================

"use client";

import { DashboardLayout } from "@/components/Layout";
import { ListPage } from "@/components/shared/ListPage";
import { Column, Badge, Button } from "@/components/ui";
import { Order } from "@/types";
import {
	formatDateTime,
	formatVND,
	ORDER_STATUS_COLORS,
	ORDER_STATUS_LABELS,
} from "@/lib/utils";
import { useState } from "react";
import { apiClient, getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import {
	Trash2,
	Eye,
	ShoppingCart,
	Plus,
	Clock,
	CheckCircle2,
	XCircle,
	Truck,
	CreditCard,
	AlertCircle,
	type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const STATUS_ICONS: Record<string, LucideIcon> = {
	PENDING_PAYMENT: CreditCard,
	PAID: CheckCircle2,
	PROCESSING: Clock,
	READY: Truck,
	COMPLETED: CheckCircle2,
	CANCELLED: XCircle,
	REFUNDED: AlertCircle,
};

const STATUS_TONES: Record<string, string> = {
	PENDING_PAYMENT: "bg-warning-50 text-warning-800 border-warning-200",
	PAID: "bg-info-50 text-info-800 border-info-200",
	PROCESSING: "bg-accent-50 text-accent-800 border-accent-200",
	READY: "bg-success-50 text-success-700 border-success-200",
	COMPLETED: "bg-success-50 text-success-700 border-success-200",
	CANCELLED: "bg-ink-50 text-ink-600 border-ink-200",
	REFUNDED: "bg-danger-50 text-danger-700 border-danger-200",
};

const STATUS_DOTS: Record<string, string> = {
	PENDING_PAYMENT: "bg-warning-500",
	PAID: "bg-info-500",
	PROCESSING: "bg-accent-500",
	READY: "bg-success-500",
	COMPLETED: "bg-success-500",
	CANCELLED: "bg-ink-400",
	REFUNDED: "bg-danger-500",
};

export function OrdersList() {
	const router = useRouter();
	const [refreshKey, setRefreshKey] = useState(0);

	const handleCancel = async (order: Order) => {
		if (!confirm(`Hủy đơn hàng ${order.orderNumber}?`)) return;
		try {
			await apiClient.delete(`/orders/${order.id}`);
			toast.success("Đã hủy đơn hàng (BR06: hoàn trả tồn kho)");
			setRefreshKey((k) => k + 1);
		} catch (err) {
			toast.error(getErrorMessage(err));
		}
	};

	const columns: Column<Order>[] = [
		{
			key: "orderNumber",
			header: "Mã đơn",
			width: "170px",
			render: (o) => (
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-gradient-to-br from-ink-50 to-accent-50 rounded-md flex items-center justify-center flex-shrink-0">
						<ShoppingCart
							className="w-4 h-4 text-accent-700"
							aria-hidden="true"
						/>
					</div>
					<span className="font-mono font-bold text-accent-700">
						{o.orderNumber}
					</span>
				</div>
			),
		},
		{
			key: "createdAt",
			header: "Ngày tạo",
			width: "150px",
			render: (o) => (
				<span className="text-xs text-ink-500">
					{formatDateTime(o.createdAt)}
				</span>
			),
		},
		{
			key: "items",
			header: "Số SP",
			width: "80px",
			align: "center",
			render: (o) => <Badge variant="info">{o.items?.length || 0}</Badge>,
		},
		{
			key: "subtotal",
			header: "Tạm tính",
			width: "130px",
			align: "right",
			render: (o) => formatVND(o.subtotal),
		},
		{
			key: "discount",
			header: "Giảm",
			width: "110px",
			align: "right",
			render: (o) => (
				<span
					className={
						o.discount > 0 ? "text-danger-700 font-semibold" : "text-ink-300"
					}
				>
					{o.discount > 0 ? `-${formatVND(o.discount)}` : "—"}
				</span>
			),
		},
		{
			key: "total",
			header: "Tổng",
			width: "140px",
			align: "right",
			render: (o) => (
				<span className="font-bold text-ink-900 tabular-nums">
					{formatVND(o.total)}
				</span>
			),
		},
		{
			key: "status",
			header: "Trạng thái",
			width: "160px",
			render: (o) => {
				const Icon = STATUS_ICONS[o.status] ?? Clock;
				return (
					<span
						className={clsx(
							"inline-flex items-center gap-1.5 pl-2 pr-2.5 h-6 rounded-md border text-xs font-medium",
							STATUS_TONES[o.status],
						)}
					>
						<span
							className={clsx(
								"w-1.5 h-1.5 rounded-full flex-shrink-0",
								STATUS_DOTS[o.status],
							)}
							aria-hidden="true"
						/>
						<Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
						<span>{ORDER_STATUS_LABELS[o.status] || o.status}</span>
					</span>
				);
			},
		},
	];

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
							<ShoppingCart
								className="w-3 h-3 text-accent-300"
								aria-hidden="true"
							/>
							UC06 — Quản lý đơn hàng
						</div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
							Đơn hàng
						</h1>
						<p className="mt-1.5 text-sm text-ink-200 text-pretty">
							Quản lý đơn POS —{" "}
							<span className="font-semibold text-accent-300">BR04</span>: giảm
							5% cho qty ≥ 10.
						</p>
					</div>
					<Button
						onClick={() => router.push("/orders/new")}
						leftIcon={<Plus className="w-4 h-4" />}
						className="bg-white !text-ink-900 hover:!bg-ink-50 border-0 shadow-lg"
					>
						Tạo đơn hàng mới
					</Button>
				</div>
			</div>

			<ListPage<Order>
				key={refreshKey}
				title=""
				endpoint="/orders"
				columns={columns}
				searchPlaceholder="Tìm theo mã đơn..."
				canAdd={false}
				emptyMessage="Chưa có đơn hàng nào. Bấm nút bên dưới để tạo đơn mới."
				onRowClick={(o) => router.push(`/orders/${o.id}`)}
				customActions={(o) => (
					<div className="flex items-center justify-end gap-1">
						<Link
							href={`/orders/${o.id}`}
							onClick={(e) => e.stopPropagation()}
							className="inline-flex items-center justify-center w-7 h-7 text-ink-500 hover:text-accent-700 hover:bg-accent-50 rounded transition-colors"
							title="Xem chi tiết"
							aria-label={`Xem chi tiết đơn ${o.orderNumber}`}
						>
							<Eye className="w-3.5 h-3.5" />
						</Link>
						{o.status === "PENDING_PAYMENT" && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleCancel(o);
								}}
								className="inline-flex items-center justify-center w-7 h-7 text-ink-500 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
								title="Hủy đơn"
								aria-label={`Hủy đơn ${o.orderNumber}`}
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						)}
					</div>
				)}
			/>
		</DashboardLayout>
	);
}
