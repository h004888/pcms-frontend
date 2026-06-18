// =====================================================
// HomeLowStock — low stock alerts card
// Extracted từ HomeView
// =====================================================

import Link from "next/link";
import { AlertTriangle, Pill, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";

interface LowStockItem {
	id: string;
	batchNo: string;
	medicineId?: string;
	qtyOnHand: number;
	minStockLevel: number;
}

interface HomeLowStockProps {
	loading: boolean;
	items: LowStockItem[];
	onManage: () => void;
}

export function HomeLowStock({ loading, items, onManage }: HomeLowStockProps) {
	const subtitle = loading
		? "Đang tải…"
		: items.length > 0
			? `${items.length} lô dưới mức tối thiểu (BR02)`
			: "Tất cả sản phẩm đều đủ hàng";

	return (
		<Card
			tone="warning"
			title="Cảnh báo tồn kho"
			subtitle={subtitle}
			actions={
				<Link
					href="/inventory"
					onClick={(e) => {
						e.preventDefault();
						onManage();
					}}
					className="text-sm font-medium text-accent-700 hover:text-accent-800 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 rounded"
				>
					Quản lý kho
					<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
				</Link>
			}
		>
			{loading ? (
				<div className="space-y-3 animate-pulse" aria-hidden="true">
					{[0, 1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex-1 space-y-1.5">
								<div className="h-3.5 w-32 bg-warning-100 rounded" />
								<div className="h-2.5 w-20 bg-warning-100 rounded" />
							</div>
							<div className="h-3.5 w-16 bg-warning-100 rounded" />
						</div>
					))}
				</div>
			) : items.length === 0 ? (
				<div className="text-center py-10">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-success-50 rounded-full mb-3">
						<Pill className="w-7 h-7 text-success-600" aria-hidden="true" />
					</div>
					<p className="text-sm font-semibold text-ink-900">
						Tất cả sản phẩm đều đủ hàng.
					</p>
					<p className="mt-1 text-xs text-ink-500">
						Không có lô nào dưới mức tối thiểu.
					</p>
				</div>
			) : (
				<ul className="divide-y divide-warning-100" role="list">
					{items.slice(0, 5).map((item) => (
						<li key={item.id} className="py-2.5 first:pt-0 last:pb-0">
							<Link
								href="/inventory"
								className="flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded hover:bg-warning-50 focus-visible:outline-none focus-visible:bg-warning-50 transition-colors group"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-9 h-9 bg-warning-100 rounded-md flex items-center justify-center flex-shrink-0">
										<AlertTriangle
											className="w-4 h-4 text-warning-700"
											aria-hidden="true"
										/>
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-ink-900 font-mono">
											Lô {item.batchNo}
										</p>
										<p className="text-xs text-ink-500 truncate">
											Medicine: {item.medicineId?.slice(0, 8)}…
										</p>
									</div>
								</div>
								<div className="text-right whitespace-nowrap">
									<p className="text-sm font-bold text-warning-700 font-mono tabular-nums">
										{item.qtyOnHand} sp
									</p>
									<p className="text-xs text-ink-500 font-mono">
										Min: {item.minStockLevel}
									</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
