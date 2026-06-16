// =====================================================
// PCMS - Home/Dashboard feature types
// =====================================================

export interface DashboardSummary {
  users: number;
  branches: number;
  medicines: number;
  customers: number;
  todayOrders: number;
  todayRevenue: number;
  lowStock: number;
  recentOrders: unknown[];
  lowStockItems: unknown[];
  // Optional new metrics — nếu backend chưa trả về, UI fallback về 0
  pendingOrders?: number;
  expiringBatches?: number;
}
