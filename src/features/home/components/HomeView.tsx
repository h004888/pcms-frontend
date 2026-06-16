// =====================================================
// PCMS - Home (Dashboard) View (SCR-HOME)
// Pharmacist's Workbench — bàn làm việc dược sĩ.
// Craft theo critique /home 2026-06-16 + polish token mới.
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Pill, Boxes, ShoppingCart, TrendingUp, AlertTriangle,
  PillBottle, ClipboardList, BarChart3, RefreshCw, ArrowRight, ChevronRight,
} from 'lucide-react';

import { DashboardLayout } from '@/components/Layout';
import { Card, StatCard, LoadingSpinner, Alert } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS, formatVND, formatDateTime } from '@/lib/utils';
import { fetchDashboardSummary } from '../services/dashboardService';

// === Skeleton atoms (thay cho full-page spinner, per product.md register) ===
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-ink-200 p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-3 w-20 bg-ink-100 rounded" />
          <div className="h-7 w-24 bg-ink-100 rounded mt-3" />
        </div>
        <div className="w-12 h-12 bg-ink-100 rounded-lg" />
      </div>
    </div>
  );
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-ink-100 rounded" />
            <div className="h-2.5 w-20 bg-ink-100 rounded" />
          </div>
          <div className="h-3.5 w-16 bg-ink-100 rounded" />
        </div>
      ))}
    </div>
  );
}

// === Quick action model — flat-by-default per DESIGN.md ===
// 1 primary (filled, dominant) + 3 outline (equal weight, không cạnh tranh)
const QUICK_ACTIONS = [
  { label: 'Tạo đơn hàng', icon: ShoppingCart, href: '/orders/new', variant: 'primary' as const },
  { label: 'Nhập kho', icon: Boxes, href: '/inventory/import', variant: 'outline' as const },
  { label: 'Tra thuốc', icon: Pill, href: '/search', variant: 'outline' as const },
  { label: 'Thêm khách', icon: PillBottle, href: '/customers', variant: 'outline' as const },
];

export function HomeView() {
  const { state } = useAuth();
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

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const summary = await fetchDashboardSummary();
      setStats({
        todayRevenue: summary.todayRevenue ?? 0,
        lowStock: summary.lowStock ?? 0,
        pendingOrders: summary.pendingOrders ?? summary.todayOrders ?? 0,
        expiringBatches: summary.expiringBatches ?? 0,
      });
      setRecentOrders(summary.recentOrders ?? []);
      setLowStockItems(summary.lowStockItems ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không tải được dữ liệu dashboard';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Time-of-day greeting — pharmacist bắt đầu ca thì cần insight, không cần emoji
  const hour = new Date().getHours();
  const shift =
    hour < 11 ? 'Ca sáng' :
    hour < 17 ? 'Ca chiều' :
    'Ca tối';
  const lastName = state.user?.fullName?.split(' ').slice(-1)[0] || 'bạn';
  const todayLabel = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <DashboardLayout>
      {/* === Header (greeting + role + date) === */}
      <header className="mb-6">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-700">
          {shift} · {todayLabel}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold text-ink-900 tracking-tight">
          {state.user ? `${lastName}, sẵn sàng cho ca làm việc.` : 'Sẵn sàng cho ca làm việc.'}
        </h1>
        {state.user && (
          <p className="mt-1 text-sm text-ink-500">
            {ROLE_LABELS[state.user.role]}
          </p>
        )}
      </header>

      {/* === Error banner (P0 fix từ critique) === */}
      {error && !loading && (
        <Alert
          variant="danger"
          title="Không tải được dữ liệu dashboard"
          className="mb-6"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{error}</span>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              Thử lại
            </button>
          </div>
        </Alert>
      )}

      {/* === Hero metrics — 4 cho pharmacist, có thể role-conditional sau === */}
      <section
        aria-label="Số liệu ca làm việc"
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Doanh thu hôm nay"
              value={formatVND(stats.todayRevenue)}
              icon={TrendingUp}
              color="accent"
            />
            <StatCard
              title="Tồn kho thấp"
              value={stats.lowStock}
              icon={AlertTriangle}
              color="warning"
            />
            <StatCard
              title="Đơn chờ thanh toán"
              value={stats.pendingOrders}
              icon={ShoppingCart}
              color="primary"
            />
            <StatCard
              title="Lô sắp hết hạn"
              value={stats.expiringBatches}
              icon={PillBottle}
              color="danger"
            />
          </>
        )}
      </section>

      {/* === Two-column main: recent orders + low stock === */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Đơn hàng gần đây"
          subtitle={
            loading
              ? 'Đang tải…'
              : recentOrders.length > 0
                ? `${recentOrders.length} đơn mới nhất`
                : 'Chưa có đơn hàng nào trong ca'
          }
          actions={
            <Link
              href="/orders"
              className="text-sm font-medium text-accent-700 hover:text-accent-800 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 rounded"
            >
              Xem tất cả
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {loading ? (
            <ListSkeleton rows={3} />
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-10 h-10 text-ink-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-ink-500">Chưa có đơn hàng nào trong ca này.</p>
              <Link
                href="/orders/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
              >
                Tạo đơn đầu tiên
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink-200" role="list">
              {recentOrders.slice(0, 5).map((o: any) => (
                <li key={o.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/orders/${o.id}`}
                    className="flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 font-mono">{o.orderNumber}</p>
                      <p className="text-xs text-ink-500">{formatDateTime(o.createdAt)}</p>
                    </div>
                    <p className="text-sm font-semibold text-accent-800 font-mono whitespace-nowrap">
                      {formatVND(o.total)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Cảnh báo tồn kho"
          subtitle={
            loading
              ? 'Đang tải…'
              : lowStockItems.length > 0
                ? `${lowStockItems.length} lô dưới mức tối thiểu (BR02)`
                : 'Tất cả sản phẩm đều đủ hàng'
          }
          actions={
            <Link
              href="/inventory"
              className="text-sm font-medium text-accent-700 hover:text-accent-800 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 rounded"
            >
              Quản lý kho
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {loading ? (
            <ListSkeleton rows={3} />
          ) : lowStockItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-50 mb-2">
                <Pill className="w-5 h-5 text-accent-700" aria-hidden="true" />
              </div>
              <p className="text-sm text-ink-700 font-medium">Tất cả sản phẩm đều đủ hàng.</p>
              <p className="mt-1 text-xs text-ink-500">Không có lô nào dưới mức tối thiểu.</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-200" role="list">
              {lowStockItems.slice(0, 5).map((item: any) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/inventory`}
                    className="flex items-center justify-between gap-3 -mx-2 px-2 py-1.5 rounded hover:bg-ink-50 focus-visible:outline-none focus-visible:bg-ink-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 font-mono">
                        Lô {item.batchNo}
                      </p>
                      <p className="text-xs text-ink-500 truncate">
                        Medicine: {item.medicineId?.slice(0, 8)}…
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-sm font-semibold text-yellow-700 font-mono">
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
      </section>

      {/* === Quick actions — flat-by-default, 1 primary dominant === */}
      <section className="mt-8" aria-label="Truy cập nhanh">
        <h2 className="sr-only">Truy cập nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const isPrimary = action.variant === 'primary';
            return (
              <Link
                key={action.href}
                href={action.href}
                className={
                  isPrimary
                    ? 'flex flex-col items-center justify-center gap-2.5 p-5 rounded-lg bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 transition-colors'
                    : 'flex flex-col items-center justify-center gap-2.5 p-5 rounded-lg bg-white border border-ink-200 text-ink-700 hover:bg-ink-50 hover:border-ink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 transition-colors'
                }
              >
                <action.icon
                  className={isPrimary ? 'w-6 h-6 text-accent-400' : 'w-6 h-6 text-ink-500'}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}

// Loading fallback exported (used by Next.js loading.tsx convention if needed)
export function HomeViewSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-ink-100 rounded animate-pulse" />
          <div className="h-7 w-64 bg-ink-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-ink-200 p-5 h-48 animate-pulse" />
          <div className="bg-white rounded-lg border border-ink-200 p-5 h-48 animate-pulse" />
        </div>
      </div>
    </DashboardLayout>
  );
}
