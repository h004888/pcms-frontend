// =====================================================
// PCMS - Export Stock Form (SCR-INV-EXPORT · UC05)
// BR05: xuất kho phải có lý do (SALE / DAMAGED / EXPIRED /
// INTERNAL_USE / RETURN). FIFO: backend tự consume lô hết
// hạn sớm nhất — UI chỉ chọn thuốc + số lượng.
// =====================================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, PackageMinus } from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Select, Input, Textarea, Alert, Badge } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate, formatVND } from '@/lib/utils';
import { EXPORT_REASONS } from '@/types/inventory';
import type { Medicine, Branch, InventoryBatch } from '@/types';

type FormState = {
  medicineId: string;
  branchId: string;
  qty: number;
  reason: string;
  notes: string;
};

const INITIAL: FormState = {
  medicineId: '',
  branchId: '',
  qty: 0,
  reason: '',
  notes: '',
};

export function ExportStockForm() {
  const router = useRouter();
  const { state } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [form, setForm] = useState<FormState>({ ...INITIAL, branchId: state.user?.branchId || '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiClient.get('/medicines?size=200'),
      apiClient.get('/branches?size=50'),
    ])
      .then(([m, b]) => {
        setMedicines(m.data.data || []);
        setBranches(b.data.data || []);
      })
      .catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  // Khi chọn thuốc + chi nhánh, load danh sách lô khả dụng (còn hàng, chưa hết hạn)
  useEffect(() => {
    if (!form.medicineId || !form.branchId) {
      setBatches([]);
      return;
    }
    apiClient
      .get<InventoryBatch[]>(`/inventory/batches?medicineId=${form.medicineId}&branchId=${form.branchId}&size=50`)
      .then((res) => setBatches(res.data || []))
      .catch(() => setBatches([]));
  }, [form.medicineId, form.branchId]);

  const totalAvailable = useMemo(
    () => batches.reduce((sum, b) => sum + (b.qtyOnHand || 0), 0),
    [batches]
  );

  const selectedMedicine = useMemo(
    () => medicines.find((m) => m.id === form.medicineId),
    [medicines, form.medicineId]
  );

  const qtyExceedsStock = form.qty > totalAvailable;
  const reasonRequiresNote = form.reason === 'DAMAGED' || form.reason === 'EXPIRED';

  const isFormValid =
    form.medicineId &&
    form.branchId &&
    form.qty > 0 &&
    form.reason &&
    !qtyExceedsStock &&
    totalAvailable > 0 &&
    (!reasonRequiresNote || form.notes.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Vui lòng kiểm tra lại thông tin xuất kho');
      return;
    }
    if (!confirm(`Xuất ${form.qty} ${selectedMedicine?.unit || ''} ${selectedMedicine?.name || ''} khỏi kho?`)) {
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/inventory/export', {
        medicineId: form.medicineId,
        branchId: form.branchId,
        qty: form.qty,
        reason: form.reason,
        notes: form.notes || undefined,
        actorId: state.user?.id,
      });
      toast.success('Xuất kho thành công');
      router.push('/inventory');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Button
        variant="outline"
        onClick={() => router.back()}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="mb-4"
      >
        Quay lại
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <PackageMinus className="w-6 h-6 text-ink-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-ink-900">Xuất kho</h1>
        </div>
        <p className="text-sm text-ink-500 mt-1">
          UC05 · Xuất lô hàng khỏi tồn kho (BR05: bắt buộc có lý do, FIFO theo hạn dùng)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Thông tin xuất kho">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Chi nhánh xuất"
                required
                options={[
                  { value: '', label: '— Chọn chi nhánh —' },
                  ...branches.map((b) => ({ value: b.id, label: `${b.code} — ${b.name}` })),
                ]}
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value, medicineId: '' })}
              />
              <Select
                label="Thuốc cần xuất"
                required
                placeholder={form.branchId ? '— Chọn thuốc —' : 'Chọn chi nhánh trước'}
                disabled={!form.branchId}
                options={[
                  { value: '', label: '— Chọn thuốc —' },
                  ...medicines.map((m) => ({ value: m.id, label: `${m.sku} — ${m.name}` })),
                ]}
                value={form.medicineId}
                onChange={(e) => setForm({ ...form, medicineId: e.target.value, qty: 0 })}
              />

              {form.medicineId && form.branchId && (
                <div className="rounded-md border border-ink-200 bg-ink-50 px-4 py-3 text-sm">
                  <p className="text-ink-600">
                    Tổng tồn khả dụng:{' '}
                    <strong className="font-mono text-ink-900">{formatNumber(totalAvailable)}</strong>{' '}
                    {selectedMedicine?.unit ? <span className="text-ink-500">({selectedMedicine.unit})</span> : null}
                    {' · '}
                    <span className="text-ink-500">{batches.length} lô</span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Số lượng xuất"
                  type="number"
                  required
                  min={1}
                  max={totalAvailable || undefined}
                  value={form.qty || ''}
                  onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 0 })}
                  hint={qtyExceedsStock ? `Vượt tồn kho (còn ${totalAvailable})` : undefined}
                  error={qtyExceedsStock ? `Không thể xuất quá ${totalAvailable}` : undefined}
                />
                <Select
                  label="Lý do xuất (BR05)"
                  required
                  options={[
                    { value: '', label: '— Chọn lý do —' },
                    ...EXPORT_REASONS.map((r) => ({ value: r.value, label: r.label })),
                  ]}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <Textarea
                label={reasonRequiresNote ? 'Ghi chú chi tiết *' : 'Ghi chú (tuỳ chọn)'}
                required={reasonRequiresNote}
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={
                  reasonRequiresNote
                    ? 'Bắt buộc với Hư hỏng / Hết hạn — mô tả số lượng, lô, điều kiện...'
                    : 'VD: xuất cho quầy, số chứng từ kèm theo...'
                }
                hint={reasonRequiresNote ? 'Bắt buộc cho lý do Hư hỏng / Hết hạn' : undefined}
              />

              {qtyExceedsStock && (
                <Alert variant="danger" title="Vượt tồn kho">
                  Số lượng xuất ({form.qty}) vượt quá tổng tồn khả dụng ({totalAvailable}). Vui lòng giảm số lượng.
                </Alert>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!isFormValid}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Xuất kho
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/inventory')}
                >
                  Huỷ
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Các lô khả dụng (FIFO)">
            {batches.length === 0 ? (
              <p className="text-sm text-ink-500">
                {form.medicineId && form.branchId
                  ? 'Không có lô nào đang còn hàng.'
                  : 'Chọn thuốc và chi nhánh để xem lô.'}
              </p>
            ) : (
              <ul className="space-y-2">
                {batches
                  .slice()
                  .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                  .slice(0, 6)
                  .map((b) => {
                    const isExpiringSoon =
                      new Date(b.expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
                    return (
                      <li
                        key={b.id}
                        className="flex items-center justify-between text-sm py-1.5 border-b border-ink-100 last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="font-mono font-semibold text-ink-900">{b.batchNo}</p>
                          <p className="text-xs text-ink-500">HSD: {formatDate(b.expiryDate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-ink-900 font-mono">{b.qtyOnHand}</p>
                          {isExpiringSoon && (
                            <Badge variant="warning">Sắp HSD</Badge>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </Card>

          <Alert variant="info" title="FIFO tự động">
            Hệ thống sẽ tự động trừ lô có hạn dùng sớm nhất trước (NSF-05). Bạn không cần chọn lô thủ công.
          </Alert>

          {(form.reason === 'EXPIRED' || form.reason === 'DAMAGED') && (
            <Alert variant="warning" title="Lý do đặc biệt">
              Xuất <strong>{form.reason === 'EXPIRED' ? 'hết hạn' : 'hư hỏng'}</strong> sẽ KHÔNG ghi nhận doanh thu
              và không cộng điểm loyalty.
            </Alert>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Tiny local helper — tránh circular import từ @/lib/utils nếu sau này refactor
function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

// Re-export formatVND usage để tránh TS unused warning
void formatVND;
