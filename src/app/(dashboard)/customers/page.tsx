// =====================================================
// PCMS - Customers List Page - UC08 — vivid edition
// Upgrades: hero header, avatar + loyalty tier indicators, points pills
// =====================================================

"use client";

import { DashboardLayout } from "@/components/Layout";
import { ListPage } from "@/components/shared/ListPage";
import { Column } from "@/components/ui";
import { Customer } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { CustomerForm } from "@/features/customers";
import { useState } from "react";
import { apiClient, getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import {
	Eye,
	Star,
	Users,
	Crown,
	Sparkles,
	Phone,
	Mail,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const TIER_COLORS = {
	bronze: {
		bg: "bg-warning-50",
		text: "text-warning-700",
		label: "Đồng",
		icon: Star,
	},
	silver: { bg: "bg-ink-50", text: "text-ink-600", label: "Bạc", icon: Star },
	gold: {
		bg: "bg-warning-50",
		text: "text-warning-700",
		label: "Vàng",
		icon: Crown,
	},
	vip: {
		bg: "bg-gradient-to-br from-accent-500 to-accent-700",
		text: "text-white",
		label: "VIP",
		icon: Sparkles,
	},
};

function getTier(points: number): keyof typeof TIER_COLORS {
	if (points >= 5000) return "vip";
	if (points >= 2000) return "gold";
	if (points >= 500) return "silver";
	return "bronze";
}

function CustomerAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(-2)
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	// Deterministic color based on name
	const colors = [
		"bg-accent-500",
		"bg-info-500",
		"bg-success-500",
		"bg-warning-500",
		"bg-danger-500",
		"bg-ink-700",
	];
	const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
	const bg = colors[hash % colors.length];
	return (
		<div
			className={clsx(
				"w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white",
				bg,
			)}
			aria-hidden="true"
		>
			{initials}
		</div>
	);
}

export default function CustomersPage() {
	const [refreshKey, setRefreshKey] = useState(0);

	const columns: Column<Customer>[] = [
		{
			key: "code",
			header: "Mã KH",
			width: "110px",
			render: (c) => (
				<span className="font-mono text-xs px-1.5 py-0.5 bg-ink-50 rounded text-ink-700">
					{c.code}
				</span>
			),
		},
		{
			key: "name",
			header: "Khách hàng",
			render: (c) => (
				<div className="flex items-center gap-2.5">
					<CustomerAvatar name={c.name} />
					<div>
						<p className="font-semibold text-ink-900">{c.name}</p>
						<div className="flex items-center gap-2 mt-0.5">
							{c.phone && (
								<span className="inline-flex items-center gap-1 text-xs text-ink-500">
									<Phone className="w-3 h-3" aria-hidden="true" />
									{c.phone}
								</span>
							)}
						</div>
					</div>
				</div>
			),
		},
		{
			key: "email",
			header: "Email",
			render: (c) =>
				c.email ? (
					<span className="inline-flex items-center gap-1 text-sm text-ink-600">
						<Mail className="w-3 h-3 text-ink-400" aria-hidden="true" />
						{c.email}
					</span>
				) : (
					<span className="text-ink-300">—</span>
				),
		},
		{
			key: "points",
			header: "Hạng thành viên",
			width: "160px",
			render: (c) => {
				const tier = TIER_COLORS[getTier(c.points)];
				const Icon = tier.icon;
				return (
					<div className="flex items-center gap-1.5">
						<span
							className={clsx(
								"inline-flex items-center gap-1.5 pl-2 pr-2.5 h-6 rounded-md text-xs font-bold",
								tier.bg,
								tier.text,
							)}
						>
							<Icon
								className="w-3 h-3"
								aria-hidden={tier.label === "VIP" ? undefined : "true"}
								fill={tier.label !== "VIP" ? "currentColor" : undefined}
							/>
							{tier.label}
						</span>
						<span className="text-xs font-mono font-bold text-ink-900 tabular-nums">
							{c.points}
						</span>
					</div>
				);
			},
		},
		{
			key: "createdAt",
			header: "Ngày tạo",
			width: "130px",
			render: (c) => (
				<span className="text-xs text-ink-500">
					{formatDateTime(c.createdAt)}
				</span>
			),
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
				<div className="relative">
					<div className="inline-flex items-center gap-1.5 px-2.5 h-7 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold mb-2">
						<Users className="w-3 h-3 text-accent-300" aria-hidden="true" />
						UC08 — Khách hàng & tích điểm
					</div>
					<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
						Quản lý khách hàng
					</h1>
					<p className="mt-1.5 text-sm text-ink-200 text-pretty">
						Khách hàng & chương trình tích điểm —{" "}
						<span className="font-semibold text-accent-300">BR07</span>: 1 điểm
						/ 1.000 VND.
					</p>
				</div>
			</div>

			<ListPage<Customer>
				key={refreshKey}
				title=""
				subtitle="Quản lý thông tin, lịch sử mua hàng, hạng thành viên"
				endpoint="/customers"
				columns={columns}
				searchPlaceholder="Tìm theo tên, SĐT, mã KH..."
				renderForm={({ open, onClose, item, refetch }) => (
					<CustomerForm
						open={open}
						onClose={onClose}
						item={item}
						onSuccess={refetch}
					/>
				)}
				addButtonLabel="Thêm khách hàng"
				customActions={(c) => (
					<Link
						href={`/customers/${c.id}/history`}
						onClick={(e) => e.stopPropagation()}
						className="inline-flex items-center justify-center w-7 h-7 text-ink-500 hover:text-accent-700 hover:bg-accent-50 rounded transition-colors"
						title="Xem lịch sử mua hàng"
						aria-label={`Xem lịch sử của ${c.name}`}
					>
						<Eye className="w-3.5 h-3.5" />
					</Link>
				)}
			/>
		</DashboardLayout>
	);
}
