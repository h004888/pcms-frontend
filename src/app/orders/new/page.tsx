'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/Layout';
import { Card, Input, Select, Button, LoadingSpinner, EmptyState, Alert } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import apiClient, { getErrorMessage } from '@/lib/api';
import { formatVND, formatDate, toInputDate } from '@/lib/utils';
import { Medicine, Customer, Branch, Order } from '@/types';
import { Search, Plus, Trash2, Save, ArrowLeft, Pill, User as UserIcon, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem { medicine: Medicine; quantity: number; }

export default function NewOrderPage() {
  const router = useRouter();
  const { state } = useAuth();
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load customers, branches, medicines
  useEffect(() => {
    const load = async () => {
      try {
        const [c, b, m] = await Promise.all([
          apiClient.get('/customers?size=100'),
          apiClient.get('/branches?size=100'),
          apiClient.get('/medicines?size=100'),
        ]);
        setCustomers(c.data.data);
        setBranches(b.data.data);
        setMedicines(m.data.data);
        // Pre-select customer's branch if Pharmacist
        if (state.user?.branchId) {
          const userBranch = b.data.data.find((br: Branch) => br.id === state.user?.branchId);
          if (userBranch) setSelectedBranch(userBranch);
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    };
    load();
  }, [state.user?.branchId]);

  // Medicine search
  useEffect(() => {
    if (!search.trim()) { setMedicineResults([]); return; }
    const filtered = medicines.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 5);
    setMedicineResults(filtered);
  }, [search, medicines]);

  const addToCart = (m: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === m.id);
      if (existing) {
        return prev.map((c) => c.medicine.id === m.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { medicine: m, quantity: 1 }];
    });
    toast.success(`Đã thêm ${m.name}`);
    setSearch('');
    setMedicineResults([]);
  };

  const updateQty = (medicineId: string, qty: number) => {
    if (qty <= 0) return removeItem(medicineId);
    setCart((prev) => prev.map((c) => c.medicine.id === medicineId ? { ...c, quantity: qty } : c));
  };

  const removeItem = (medicineId: string) => {
    setCart((prev) => prev.filter((c) => c.medicine.id !== medicineId));
  };

  // BR04: 5% discount when qty >= 10
  const calcLineSubtotal = (item: CartItem) => item.medicine.price * item.quantity;
  const calcLineDiscount = (item: CartItem) => item.quantity >= 10 ? calcLineSubtotal(item) * 0.05 : 0;

  const subtotal = cart.reduce((s, c) => s + calcLineSubtotal(c), 0);
  const totalDiscount = cart.reduce((s, c) => s + calcLineDiscount(c), 0);
  const total = subtotal - totalDiscount;

  const submitOrder = async () => {
    if (!selectedCustomer || !selectedBranch || cart.length === 0) {
      toast.error('Vui lòng chọn khách hàng, chi nhánh và thêm sản phẩm');
      return;
    }
    setSubmitting(true);
    try {
      const response = await apiClient.post<Order>('/orders', {
        customerId: selectedCustomer.id,
        branchId: selectedBranch.id,
        staffId: state.user?.id,
        items: cart.map((c) => ({ medicineId: c.medicine.id, quantity: c.quantity })),
      });
      toast.success(`Tạo đơn ${response.data.orderNumber} thành công!`);
      router.push(`/orders/${response.data.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4">
        Quay lại
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo đơn hàng mới</h1>
        <p className="text-sm text-gray-500 mt-1">SCR-ORDER-NEW · BR04: 5% discount tự động cho qty ≥ 10</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Selection + Search */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Customer + Branch */}
          <Card title="1. Chọn khách hàng & chi nhánh">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Khách hàng"
                options={[
                  { value: '', label: '— Chọn khách hàng —' },
                  ...customers.map((c) => ({ value: c.id, label: `${c.code} - ${c.name} (${c.phone})` })),
                ]}
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const c = customers.find((x) => x.id === e.target.value);
                  setSelectedCustomer(c || null);
                }}
                required
              />
              <Select
                label="Chi nhánh"
                options={[
                  { value: '', label: '— Chọn chi nhánh —' },
                  ...branches.map((b) => ({ value: b.id, label: `${b.code} - ${b.name}` })),
                ]}
                value={selectedBranch?.id || ''}
                onChange={(e) => {
                  const b = branches.find((x) => x.id === e.target.value);
                  setSelectedBranch(b || null);
                }}
                required
              />
            </div>
            {selectedCustomer && (
              <Alert variant="success" className="mt-4">
                Đã chọn: <strong>{selectedCustomer.name}</strong> · Điểm hiện tại: {selectedCustomer.points} · SĐT: {selectedCustomer.phone}
              </Alert>
            )}
          </Card>

          {/* Step 2: Add Medicines */}
          <Card title="2. Tìm & thêm thuốc" subtitle="Gõ tên hoặc SKU để tìm">
            <div className="relative">
              <Input
                placeholder="Tìm thuốc (VD: paracetamol, MD001)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
              {medicineResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {medicineResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addToCart(m)}
                      className="w-full px-3 py-2 hover:bg-primary-50 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-gray-500">SKU: {m.sku}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-medical-700">{formatVND(m.price)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Step 3: Cart */}
          <Card title="3. Giỏ hàng" subtitle={`${cart.length} sản phẩm`}>
            {cart.length === 0 ? (
              <EmptyState title="Chưa có sản phẩm" description="Tìm và thêm thuốc vào giỏ ở trên" />
            ) : (
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
                  <tr className="text-xs uppercase text-gray-500">
                    <th className="text-left py-2">Thuốc</th>
                    <th className="text-center w-24">SL</th>
                    <th className="text-right">Đơn giá</th>
                    <th className="text-right">Giảm</th>
                    <th className="text-right">Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => {
                    const lineSub = calcLineSubtotal(item);
                    const lineDisc = calcLineDiscount(item);
                    return (
                      <tr key={item.medicine.id}>
                        <td className="py-2">
                          <p className="font-medium text-sm">{item.medicine.name}</p>
                          <p className="text-xs text-gray-500">{item.medicine.sku}</p>
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQty(item.medicine.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                          />
                          {item.quantity >= 10 && <p className="text-xs text-medical-600 mt-1">-5%</p>}
                        </td>
                        <td className="text-right text-sm">{formatVND(item.medicine.price)}</td>
                        <td className="text-right text-sm text-red-600">{lineDisc > 0 ? `-${formatVND(lineDisc)}` : '—'}</td>
                        <td className="text-right text-sm font-semibold">{formatVND(lineSub - lineDisc)}</td>
                        <td className="text-right">
                          <button onClick={() => removeItem(item.medicine.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* RIGHT: Summary */}
        <div className="space-y-4">
          <Card title="Tổng đơn hàng" className="sticky top-20">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-semibold">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá (BR04):</span>
                <span className="text-red-600">-{formatVND(totalDiscount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg">
                <span className="font-bold">Tổng cộng:</span>
                <span className="font-bold text-medical-700">{formatVND(total)}</span>
              </div>
              {totalDiscount > 0 && (
                <p className="text-xs text-medical-600 text-center">🎉 Đã áp dụng giảm giá bulk purchase</p>
              )}
            </div>
            <Button
              onClick={submitOrder}
              loading={submitting}
              disabled={!selectedCustomer || !selectedBranch || cart.length === 0}
              fullWidth
              className="mt-4"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Tạo đơn hàng
            </Button>
            {(!selectedCustomer || !selectedBranch || cart.length === 0) && (
              <p className="text-xs text-gray-500 text-center mt-2">
                {!selectedCustomer && 'Chọn khách hàng · '}
                {!selectedBranch && 'Chọn chi nhánh · '}
                {cart.length === 0 && 'Thêm sản phẩm'}
              </p>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
