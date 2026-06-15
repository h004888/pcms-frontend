// =====================================================
// PCMS - Dashboard Home (SCR-HOME) - Role-based widgets
// =====================================================

'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, StatCard, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import apiClient from '@/lib/api';
import { ROLE_LABELS, formatVND, formatDateTime } from '@/lib/utils';
import {
  Users, Building2, Pill, Boxes, ShoppingCart, UserCircle2,
  TrendingUp, AlertTriangle, Clock, FileText, CreditCard
} from 'lucide-react';

export default function HomePage() {
  const { state } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    branches: 0,
    medicines: 0,
    customers: 0,
    todayOrders: 0,
    todayRevenue: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch summary data in parallel
        const [users, branches, medicines, customers, orders, lowStock] = await Promise.allSettled([
          apiClient.get('/users?size=1'),
          apiClient.get('/branches?size=1'),
          apiClient.get('/medicines?size=1'),
          apiClient.get('/customers?size=1'),
          apiClient.get('/orders?size=5&status=PAID'),
          apiClient.get('/inventory/low-stock'),
        ]);

        setStats({
          users: users.status === 'fulfilled' ? (users.value.data.total || 0) : 0,
          branches: branches.status === 'fulfilled' ? (branches.value.data.total || 0) : 0,
          medicines: medicines.status === 'fulfilled' ? (medicines.value.data.total || 0) : 0,
          customers: customers.status === 'fulfilled' ? (customers.value.data.total || 0) : 0,
          todayOrders: orders.status === 'fulfilled' ? (orders.value.data.data?.length || 0) : 0,
          todayRevenue: orders.status === 'fulfilled'
            ? orders.value.data.data?.reduce((s: number, o: any) => s + (o.total || 0), 0) || 0
            : 0,
          lowStock: lowStock.status === 'fulfilled' ? (lowStock.value.data?.length || 0) : 0,
        });

        if (orders.status === 'fulfilled') setRecentOrders(orders.value.data.data || []);
        if (lowStock.status === 'fulfilled') setLowStockItems(lowStock.value.data || []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {state.user?.fullName?.split(' ').pop() || 'bạn'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {state.user && ROLE_LABELS[state.user.role]} · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Người dùng" value={stats.users} icon={Users} color="primary" />
            <StatCard title="Chi nhánh" value={stats.branches} icon={Building2} color="primary" />
            <StatCard title="Thuốc trong kho" value={stats.medicines} icon={Pill} color="medical" />
            <StatCard title="Khách hàng" value={stats.customers} icon={UserCircle2} color="primary" />
            <StatCard title="Đơn hàng hôm nay" value={stats.todayOrders} icon={ShoppingCart} color="medical" />
            <StatCard title="Doanh thu hôm nay" value={formatVND(stats.todayRevenue)} icon={TrendingUp} color="medical" />
            <StatCard title="Cảnh báo tồn kho" value={stats.lowStock} icon={AlertTriangle} color="warning" />
            <StatCard title="Tổng đơn" value={stats.todayOrders} icon={FileText} color="primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card title="Đơn hàng gần đây" subtitle="5 đơn hàng mới nhất đã thanh toán">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Chưa có đơn hàng nào</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentOrders.map((o: any) => (
                    <li key={o.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{o.orderNumber}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(o.createdAt)}</p>
                      </div>
                      <p className="text-sm font-semibold text-medical-700">{formatVND(o.total)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Low Stock Alerts */}
            <Card title="Cảnh báo tồn kho" subtitle="Sản phẩm dưới mức tối thiểu (BR02)">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">Tất cả sản phẩm đều đủ hàng ✅</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {lowStockItems.slice(0, 5).map((item: any) => (
                    <li key={item.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lô {item.batchNo}</p>
                        <p className="text-xs text-gray-500">Medicine: {item.medicineId?.slice(0, 8)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-yellow-700">{item.qtyOnHand} sp</p>
                        <p className="text-xs text-gray-500">Min: {item.minStockLevel}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Quick Actions */}
            <Card title="Truy cập nhanh" className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Tạo đơn hàng', icon: ShoppingCart, href: '/orders/new', color: 'bg-medical-50 text-medical-700' },
                  { label: 'Nhập kho', icon: Boxes, href: '/inventory/import', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Thêm thuốc', icon: Pill, href: '/medicines', color: 'bg-primary-50 text-primary-700' },
                  { label: 'Thêm KH', icon: UserCircle2, href: '/customers', color: 'bg-yellow-50 text-yellow-700' },
                ].map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow transition-all ${action.color}`}
                  >
                    <action.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
