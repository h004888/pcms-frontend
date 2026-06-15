'use client';

import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Input, Select, Alert } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Medicine, Branch, InventoryBatch } from '@/types';
import apiClient, { getErrorMessage } from '@/lib/api';
import { toInputDate, formatVND, formatDate } from '@/lib/utils';
import { ArrowLeft, Upload, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ImportStockPage() {
  const router = useRouter();
  const { state } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [lowStock, setLowStock] = useState<InventoryBatch[]>([]);
  const [form, setForm] = useState({
    medicineId: '',
    branchId: state.user?.branchId || '',
    batchNo: '',
    qty: 0,
    expiryDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/medicines?size=200'),
      apiClient.get('/branches?size=50'),
      apiClient.get('/inventory/low-stock'),
    ]).then(([m, b, l]) => {
      setMedicines(m.data.data);
      setBranches(b.data.data);
      setLowStock(l.data.data || []);
    }).catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicineId || !form.branchId || !form.batchNo || form.qty <= 0 || !form.expiryDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/inventory/import', { ...form, actorId: state.user?.id });
      toast.success('Nhập kho thành công (MSG14)');
      router.push('/inventory');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />} className="mb-4">Quay lại</Button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nhập kho</h1>
        <p className="text-sm text-gray-500 mt-1">UC05 · Thêm lô hàng mới vào tồn kho (AT4: validate qty, batch, expiry)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Thuốc"
                required
                options={[{ value: '', label: '— Chọn thuốc —' }, ...medicines.map((m) => ({ value: m.id, label: `${m.sku} - ${m.name}` }))]}
                value={form.medicineId}
                onChange={(e) => setForm({ ...form, medicineId: e.target.value })}
              />
              <Select
                label="Chi nhánh"
                required
                options={[{ value: '', label: '— Chọn chi nhánh —' }, ...branches.map((b) => ({ value: b.id, label: `${b.code} - ${b.name}` }))]}
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Mã lô (Batch No)" required value={form.batchNo} onChange={(e) => setForm({ ...form, batchNo: e.target.value })} placeholder="VD: BTH-001" />
                <Input label="Số lượng" type="number" required min={1} value={form.qty || ''} onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 0 })} />
              </div>
              <Input label="Ngày hết hạn" type="date" required value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} hint="Phải là ngày trong tương lai (MSG17)" />
              <Button type="submit" loading={submitting} leftIcon={<Upload className="w-4 h-4" />} fullWidth>
                Nhập kho
              </Button>
            </form>
          </Card>
        </div>

        <div>
          {lowStock.length > 0 && (
            <Alert variant="warning" title={`${lowStock.length} lô sắp hết hàng`}>
              <ul className="text-xs space-y-1 mt-1">
                {lowStock.slice(0, 5).map((b) => (
                  <li key={b.id}>• Lô {b.batchNo}: {b.qtyOnHand} (min: {b.minStockLevel})</li>
                ))}
              </ul>
            </Alert>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
