// =====================================================
// PCMS - Search View (UC10) - Global + Medicine autocomplete
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Input, Button, Alert, Card, Badge } from '@/components/ui';
import { Search, Pill, User, Receipt, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Medicine, Order, Customer, Prescription } from '@/types';
import { formatVND, formatDateTime } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface GlobalSearchResponse {
  medicines: Medicine[];
  customers: Customer[];
  orders: Order[];
  prescriptions: Prescription[];
  total: number;
}

export function SearchView() {
  const router = useRouter();
  const { state } = useAuth();
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'medicines' | 'customers' | 'orders' | 'prescriptions'>('all');

  useEffect(() => {
    if (!query.trim()) {
      setMedicines([]); setCustomers([]); setOrders([]); setPrescriptions([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      apiClient.get<GlobalSearchResponse>(`/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          setMedicines(res.data.medicines);
          setCustomers(res.data.customers);
          setOrders(res.data.orders);
          setPrescriptions(res.data.prescriptions);
        })
        .catch(() => {
          setMedicines([]); setCustomers([]); setOrders([]); setPrescriptions([]);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const total = medicines.length + customers.length + orders.length + prescriptions.length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Tìm kiếm toàn hệ thống</h1>
        <p className="text-sm text-ink-500 mt-1">UC10 - Tìm thuốc, khách hàng, đơn hàng, đơn thuốc · FR10.1-FR10.4</p>
      </div>

      <div className="mb-6 max-w-2xl">
        <Input
          placeholder="Gõ tên thuốc, SĐT khách, mã đơn, mã đơn thuốc..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        {state.user?.role === 'CUSTOMER' && (
          <Alert variant="info" className="mt-3">
            💡 Khách hàng có thể đặt mua trực tiếp từ kết quả tìm thuốc
          </Alert>
        )}
      </div>

      {loading && <p className="text-sm text-ink-500">Đang tìm...</p>}

      {!loading && query && total === 0 && (
        <Alert variant="warning" title="Không tìm thấy">Không có kết quả cho &ldquo;{query}&rdquo; (MSG27)</Alert>
      )}

      {total > 0 && (
        <div className="border-b border-ink-200 mb-4">
          <div role="tablist" className="flex gap-1 -mb-px overflow-x-auto">
            {[
              { id: 'all', label: `Tất cả (${total})` },
              { id: 'medicines', label: `Thuốc (${medicines.length})` },
              { id: 'customers', label: `Khách hàng (${customers.length})` },
              { id: 'orders', label: `Đơn hàng (${orders.length})` },
              { id: 'prescriptions', label: `Đơn thuốc (${prescriptions.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 h-10 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent-600 text-accent-700'
                    : 'border-transparent text-ink-600 hover:text-ink-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {(activeTab === 'all' || activeTab === 'medicines') && medicines.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" /> Thuốc ({medicines.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicines.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-ink-50 rounded-lg">
                      <Pill className="w-6 h-6 text-ink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-ink-900 truncate">{m.name}</h3>
                      <p className="text-xs text-ink-500 mt-0.5">SKU: {m.sku}</p>
                      {m.prescriptionRequired && <Badge variant="warning" className="mt-1">⚕️ Thuốc kê đơn</Badge>}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-lg font-bold text-accent-700">{formatVND(m.price)}</span>
                        {state.user?.role !== 'CUSTOMER' && (
                          <Button size="sm" onClick={() => router.push(`/orders/new?medicineId=${m.id}`)}>
                            Đặt mua
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'customers') && customers.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Khách hàng ({customers.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <Card key={c.id}>
                  <p className="font-mono text-xs text-ink-500">{c.code}</p>
                  <p className="font-semibold text-ink-900">{c.name}</p>
                  <p className="text-sm text-ink-600">📞 {c.phone}</p>
                  {c.email && <p className="text-xs text-ink-500">✉️ {c.email}</p>}
                  <div className="mt-2 text-xs text-ink-500">
                    Điểm: <span className="font-semibold text-accent-700">{c.points}</span> · Hạng: <span className="font-semibold">{c.tier}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'orders') && orders.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Đơn hàng ({orders.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((o) => (
                <Card key={o.id} className="cursor-pointer hover:shadow-md" onClick={() => router.push(`/orders/${o.id}`)}>
                  <p className="font-mono text-xs text-ink-500">{o.orderNumber}</p>
                  <p className="font-semibold text-ink-900">{o.customerName}</p>
                  <p className="text-sm text-ink-600">{o.branchName}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="info">{o.status}</Badge>
                    <span className="text-lg font-bold text-accent-700">{formatVND(o.total)}</span>
                  </div>
                  <p className="text-xs text-ink-500 mt-1">{formatDateTime(o.createdAt)}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'prescriptions') && prescriptions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-ink-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Đơn thuốc ({prescriptions.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescriptions.map((rx) => (
                <Card key={rx.id}>
                  <p className="font-mono text-xs text-ink-500">{rx.code}</p>
                  <p className="text-sm text-ink-700 mt-1">{rx.diagnosis}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-ink-500">BS: {rx.doctorId.slice(0, 8)}…</span>
                    <Badge variant={rx.status === 'SIGNED' ? 'success' : rx.status === 'CANCELLED' ? 'danger' : 'warning'}>
                      {rx.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
