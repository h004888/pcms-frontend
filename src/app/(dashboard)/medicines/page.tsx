// =====================================================
// PCMS - Medicines List Page (SCR-MED-LIST) - UC04 — vivid edition
// Upgrades: hero header, status pills với icons + dots, prescription badge prominent
// =====================================================

"use client";

import { DashboardLayout } from "@/components/Layout";
import { ListPage } from "@/components/shared/ListPage";
import { Column } from "@/components/ui";
import { Medicine } from "@/types";
import { formatVND, getStatusColor } from "@/lib/utils";
import { MedicineForm } from "@/features/medicines";
import { useState } from "react";
import { apiClient, getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import {
	Trash2,
	Pill,
	Plus,
	AlertCircle,
	Package,
	type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

const UNIT_OPTIONS = [
	{ value: "box", label: "Hộp" },
	{ value: "bottle", label: "Chai" },
	{ value: "strip", label: "Vỉ" },
];

const STATUS_TONES: Record<
	string,
	{ bg: string; text: string; dot: string; icon: LucideIcon; label: string }
> = {
	ACTIVE: {
		bg: "bg-success-50 border-success-200",
		text: "text-success-700",
		dot: "bg-success-500",
		icon: Package,
		label: "Đang bán",
	},
	INACTIVE: {
		bg: "bg-ink-50 border-ink-200",
		text: "text-ink-600",
		dot: "bg-ink-400",
		icon: Package,
		label: "Ngừng bán",
	},
	DISCONTINUED: {
		bg: "bg-danger-50 border-danger-200",
		text: "text-danger-700",
		dot: "bg-danger-500",
		icon: AlertCircle,
		label: "Ngừng SX",
	},
};

export default function MedicinesPage() {
	const [refreshKey, setRefreshKey] = useState(0);

	const handleDelete = async (m: Medicine) => {
		if (!confirm(`Vô hiệu hóa thuốc "${m.name}"?`)) return;
		try {
			await apiClient.delete(`/medicines/${m.id}`);
			toast.success("Đã vô hiệu hóa thuốc");
			setRefreshKey((k) => k + 1);
		} catch (err) {
			toast.error(getErrorMessage(err));
		}
	};

	const columns: Column<Medicine>[] = [
		{
			key: "sku",
			header: "SKU",
			width: "110px",
			render: (m) => (
				<span className="font-mono text-xs px-1.5 py-0.5 bg-ink-50 rounded text-ink-700">
					{m.sku}
				</span>
			),
		},
		{
			key: "name",
			header: "Tên thuốc",
			render: (m) => (
				<div className="flex items-center gap-2.5">
					<div className="w-9 h-9 bg-gradient-to-br from-accent-50 to-info-50 rounded-md flex items-center justify-center flex-shrink-0">
						<Pill className="w-4 h-4 text-accent-700" aria-hidden="true" />
					</div>
					<div>
						<p className="font-semibold text-ink-900">{m.name}</p>
						{m.prescriptionRequired ? (
							<span className="inline-flex items-center gap-1 mt-0.5 text-xs font-medium text-warning-700">
								<AlertCircle className="w-3 h-3" aria-hidden="true" />
								Thuốc kê đơn
							</span>
						) : (
							<span className="text-xs text-ink-500">Không kê đơn · OTC</span>
						)}
					</div>
				</div>
			),
		},
		{
			key: "price",
			header: "Giá",
			width: "130px",
			align: "right",
			render: (m) => (
				<span className="font-bold text-accent-700 tabular-nums">
					{formatVND(m.price)}
				</span>
			),
		},
		{
			key: "unit",
			header: "Đơn vị",
			width: "90px",
			render: (m) => (
				<span className="px-2 h-5 bg-ink-50 rounded text-xs text-ink-700 inline-flex items-center font-medium">
					{UNIT_OPTIONS.find((u) => u.value === m.unit)?.label || m.unit}
				</span>
			),
		},
		{
			key: "status",
			header: "Trạng thái",
			width: "130px",
			render: (m) => {
				const tone = STATUS_TONES[m.status] ?? STATUS_TONES.ACTIVE;
				const Icon = tone.icon;
				return (
					<span
						className={clsx(
							"inline-flex items-center gap-1.5 pl-2 pr-2.5 h-6 rounded-md border text-xs font-medium",
							tone.bg,
							tone.text,
						)}
					>
						<span
							className={clsx(
								"w-1.5 h-1.5 rounded-full flex-shrink-0",
								tone.dot,
							)}
							aria-hidden="true"
						/>
						<Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
						<span>{tone.label}</span>
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
							<Pill className="w-3 h-3 text-accent-300" aria-hidden="true" />
							UC04 — Danh mục thuốc
						</div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
							Quản lý thuốc
						</h1>
						<p className="mt-1.5 text-sm text-ink-200 text-pretty">
							Danh mục thuốc toàn hệ thống — quản lý SKU, giá bán, đơn vị và
							trạng thái.
						</p>
					</div>
				</div>
			</div>

			<ListPage<Medicine>
				key={refreshKey}
				title=""
				endpoint="/medicines"
				columns={columns}
				searchPlaceholder="Tìm theo tên thuốc..."
				renderForm={({ open, onClose, item, refetch }) => (
					<MedicineForm
						open={open}
						onClose={onClose}
						item={item}
						onSuccess={refetch}
					/>
				)}
				addButtonLabel="Thêm thuốc mới"
				customActions={(m) => (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleDelete(m);
						}}
						className="inline-flex items-center justify-center w-7 h-7 text-ink-500 hover:text-danger-700 hover:bg-danger-50 rounded transition-colors"
						title="Vô hiệu hóa"
						aria-label={`Vô hiệu hóa thuốc ${m.name}`}
					>
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				)}
			/>
		</DashboardLayout>
	);
}
