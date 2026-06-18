// =====================================================
// HomeOrdersList — recent orders card
// Extracted từ HomeView
// =====================================================

import Link from "next/link";
import {
	ShoppingCart,
	ChevronRight,
	ClipboardList,
	Sparkles,
	ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui";

interface OrderItem {
	id: string;
	orderNumber: string;
	createdAt: string;
	total: number;
}

interface HomeOrdersListProps {
	loading: boolean;
	orders: OrderItem[];
	formatDateTime: (d: string) => string;
	formatVND: (v: number) => string;
	onViewAll: () => void;
}

export function HomeOrdersList({
	loading,
	orders,
	formatDateTime,
	formatVND,
	onViewAll,
}: HomeOrdersListProps) {
	const subtitle = loading
		? "Đang tải…"
		: orders.length > 0
			? `${orders.length} đơn mới nhất`
			: "Chưa có đơn hàng nào trong ca";

	return (
		<Card
			title="Đơn hàng gần đây"
			subtitle={subtitle}
			actions={
				<Link
					href="/orders"
					onClick={(e) => {
						e.preventDefault();
						onViewAll();
					}}
					className="text-sm font-medium text-accent-700 hover:text-accent-800 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 rounded"
				>
					Xem tất cả
					<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
				</Link>
			}
		>
			{loading ? (
				<div className="space-y-3 animate-pulse" aria-hidden="true">
					{[0, 1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex-1 space-y-1.5">
								<div className="h-3.5 w-32 bg-ink-100 rounded" />
								<div className="h-2.5 w-20 bg-ink-100 rounded" />
							</div>
							<div className="h-3.5 w-16 bg-ink-100 rounded" />
						</div>
					))}
				</div>
			) : orders.length === 0 ? (
				<div className="text-center py-10">
					<div className="inline-flex items-center justify-center w-14 h-14 bg-ink-50 rounded-full mb-3">
						<ClipboardList
							className="w-7 h-7 text-ink-400"
							aria-hidden="true"
						/>
					</div>
					<p className="text-sm font-medium text-ink-700">
						Chưa có đơn hàng nào trong ca này.
					</p>
					<p className="mt-1 text-xs text-ink-500">
						Bắt đầu ca làm việc bằng cách tạo đơn đầu tiên.
					</p>
					<Link
						href="/orders/new"
						className="mt-4 inline-flex items-center gap-1.5 px-4 h-9 bg-ink-900 text-white text-sm font-semibold rounded-md hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
					>
						<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
						Tạo đơn đầu tiên
						<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
					</Link>
				</div>
			) : (
				<ul className="divide-y divide-ink-100" role="list">
					{orders.slice(0, 5).map((o) => (
						<li key={o.id} className="py-2.5 first:pt-0 last:pb-0">
							<Link
								href={`/orders/${o.id}`}
								className="flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50 transition-colors group"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-9 h-9 bg-gradient-to-br from-ink-50 to-accent-50 rounded-md flex items-center justify-center flex-shrink-0 group-hover:from-accent-100 group-hover:to-accent-50 transition-colors">
										<ShoppingCart
											className="w-4 h-4 text-accent-700"
											aria-hidden="true"
										/>
									</div>
									<div className="min-w-0">
										<p className="text-sm font-semibold text-ink-900 font-mono">
											{o.orderNumber}
										</p>
										<p className="text-xs text-ink-500">
											{formatDateTime(o.createdAt)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 flex-shrink-0">
									<p className="text-sm font-bold text-accent-700 font-mono tabular-nums">
										{formatVND(o.total)}
									</p>
									<ChevronRight
										className="w-3.5 h-3.5 text-ink-300 group-hover:text-accent-600 transition-colors"
										aria-hidden="true"
									/>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
