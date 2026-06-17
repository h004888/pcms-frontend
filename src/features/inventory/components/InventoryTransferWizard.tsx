// =====================================================
// PCMS - Inventory Transfer Wizard (SCR-INV-TRANSFER · UC05)
// 3 bước: 1) Chọn chi nhánh nguồn  2) Chọn lô + số lượng
//         3) Chọn chi nhánh đích    4) Xác nhận
// FIFO theo batch (giữ nguyên batch khi chuyển).
// =====================================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, ChevronRight,
  Truck, PackageCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Select, Input, Textarea, Alert, Badge } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import type { Branch, InventoryBatch, Medicine } from '@/types';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { num: 1, label: 'Chi nhánh nguồn' },
  { num: 2, label: 'Chọn lô' },
  { num: 3, label: 'Chi nhánh đích' },
  { num: 4, label: 'Xác nhận' },
] as const;

export function InventoryTransferWizard() {
  const router = useRouter();
  const { state } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fromBranchId: state.user?.branchId || '',
    medicineId: '',
    batchId: '',
    qty: 0,
    toBranchId: '',
    reason: '',
  });

  useEffect(() => {
    Promise.all([
      apiClient.get('/branches?size=50'),
      apiClient.get('/medicines?size=200'),
    ])
      .then(([b, m]) => {
        setBranches(b.data.data || []);
        setMedicines(m.data.data || []);
      })
      .catch((e) => toast.error(getErrorMessage(e)));
  }, []);

  // Khi đã có fromBranch + medicine → load các lô khả dụng ở nguồn
  useEffect(() => {
    if (!form.fromBranchId || !form.medicineId) {
      setBatches([]);
      return;
    }
    apiClient
      .get<InventoryBatch[]>(`/inventory/batches?medicineId=${form.medicineId}&branchId=${form.fromBranchId}&size=50`)
      .then((res) => setBatches(res.data || []))
      .catch(() => setBatches([]));
  }, [form.fromBranchId, form.medicineId]);

  const fromBranch = useMemo(() => branches.find((b) => b.id === form.fromBranchId), [branches, form.fromBranchId]);
  const toBranch = useMemo(() => branches.find((b) => b.id === form.toBranchId), [branches, form.toBranchId]);
  const selectedBatch = useMemo(() => batches.find((b) => b.id === form.batchId), [batches, form.batchId]);
  const selectedMedicine = useMemo(
    () => medicines.find((m) => m.id === form.medicineId),
    [medicines, form.medicineId]
  );

  const canGoNext = (() => {
    if (step === 1) return form.fromBranchId !== '';
    if (step === 2) return form.batchId !== '' && form.qty > 0 && form.qty <= (selectedBatch?.qtyOnHand || 0);
    if (step === 3) return form.toBranchId !== '' && form.toBranchId !== form.fromBranchId;
    return true;
  })();

  const handleNext = () => {
    if (!canGoNext) return;
    setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/inventory');
      return;
    }
    setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!form.batchId) {
      toast.error('Thiếu lô hàng');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post('/inventory/transfer', {
        batchId: form.batchId,
        qty: form.qty,
        fromBranchId: form.fromBranchId,
        toBranchId: form.toBranchId,
        reason: form.reason || undefined,
        actorId: state.user?.id,
      });
      toast.success(`Đã chuyển ${form.qty} sang ${toBranch?.name || 'chi nhánh đích'}`);
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
        onClick={handleBack}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        className="mb-4"
      >
        {step === 1 ? 'Huỷ' : 'Quay lại'}
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-ink-700" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-ink-900">Chuyển kho</h1>
        </div>
        <p className="text-sm text-ink-500 mt-1">
          UC05 · Chuyển lô hàng giữa hai chi nhánh. Lô giữ nguyên mã + hạn dùng.
        </p>
      </div>

      {/* === Stepper === */}
      <nav aria-label="Tiến trình" className="mb-6">
        <ol className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((s, idx) => {
            const isDone = step > s.num;
            const isActive = step === s.num;
            return (
              <li key={s.num} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={[
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium',
                    isActive && 'bg-ink-900 text-white',
                    isDone && 'bg-accent-50 text-accent-800',
                    !isActive && !isDone && 'bg-ink-50 text-ink-500',
                  ].filter(Boolean).join(' ')}
                >
                  <span
                    className={[
                      'flex h-5 w-5 items-center justify-center rounded-full text-xs',
                      isActive && 'bg-white text-ink-900',
                      isDone && 'bg-accent-600 text-white',
                      !isActive && !isDone && 'bg-ink-200 text-ink-600',
                    ].filter(Boolean).join(' ')}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-ink-300" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* === Step content === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-ink-900">Bước 1 — Chọn chi nhánh nguồn</h2>
                  <p className="text-sm text-ink-500 mt-0.5">Chi nhánh hiện đang giữ hàng cần chuyển.</p>
                </div>
                <Select
                  label="Chi nhánh nguồn"
                  required
                  options={[
                    { value: '', label: '— Chọn chi nhánh —' },
                    ...branches.map((b) => ({ value: b.id, label: `${b.code} — ${b.name}` })),
                  ]}
                  value={form.fromBranchId}
                  onChange={(e) => setForm({ ...form, fromBranchId: e.target.value, medicineId: '', batchId: '' })}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-ink-900">Bước 2 — Chọn thuốc, lô, số lượng</h2>
                  <p className="text-sm text-ink-500 mt-0.5">
                    Kho <strong>{fromBranch?.name}</strong> đang có các lô sau:
                  </p>
                </div>

                <Select
                  label="Thuốc"
                  required
                  options={[
                    { value: '', label: '— Chọn thuốc —' },
                    ...medicines.map((m) => ({ value: m.id, label: `${m.sku} — ${m.name}` })),
                  ]}
                  value={form.medicineId}
                  onChange={(e) => setForm({ ...form, medicineId: e.target.value, batchId: '' })}
                />

                {form.medicineId && batches.length === 0 && (
                  <Alert variant="warning">Chi nhánh nguồn không có lô nào đang còn hàng cho thuốc này.</Alert>
                )}

                {batches.length > 0 && (
                  <Select
                    label="Lô hàng (FIFO: hết hạn sớm ở trên)"
                    required
                    options={[
                      { value: '', label: '— Chọn lô —' },
                      ...batches
                        .slice()
                        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                        .map((b) => ({
                          value: b.id,
                          label: `${b.batchNo} · HSD ${formatDate(b.expiryDate)} · còn ${b.qtyOnHand}`,
                        })),
                    ]}
                    value={form.batchId}
                    onChange={(e) => setForm({ ...form, batchId: e.target.value, qty: 0 })}
                  />
                )}

                {selectedBatch && (
                  <Input
                    label={`Số lượng chuyển (tối đa ${selectedBatch.qtyOnHand})`}
                    type="number"
                    required
                    min={1}
                    max={selectedBatch.qtyOnHand}
                    value={form.qty || ''}
                    onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 0 })}
                    hint={`Lô ${selectedBatch.batchNo} · HSD ${formatDate(selectedBatch.expiryDate)}`}
                    error={
                      form.qty > selectedBatch.qtyOnHand
                        ? `Không vượt quá ${selectedBatch.qtyOnHand}`
                        : undefined
                    }
                  />
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-ink-900">Bước 3 — Chọn chi nhánh đích</h2>
                  <p className="text-sm text-ink-500 mt-0.5">Nơi nhận lô hàng chuyển đến.</p>
                </div>

                <Select
                  label="Chi nhánh đích"
                  required
                  options={[
                    { value: '', label: '— Chọn chi nhánh —' },
                    ...branches
                      .filter((b) => b.id !== form.fromBranchId)
                      .map((b) => ({ value: b.id, label: `${b.code} — ${b.name}` })),
                  ]}
                  value={form.toBranchId}
                  onChange={(e) => setForm({ ...form, toBranchId: e.target.value })}
                />

                {form.toBranchId === form.fromBranchId && (
                  <Alert variant="danger" title="Không hợp lệ">
                    Chi nhánh đích phải khác chi nhánh nguồn.
                  </Alert>
                )}

                <Textarea
                  label="Lý do chuyển (tuỳ chọn)"
                  rows={2}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="VD: Cân bằng tồn kho, đáp ứng nhu cầu chi nhánh đích, kho nguồn sắp hết hạn..."
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-ink-900">Bước 4 — Xác nhận</h2>
                  <p className="text-sm text-ink-500 mt-0.5">Kiểm tra thông tin trước khi thực hiện chuyển kho.</p>
                </div>

                <div className="rounded-md border border-ink-200 divide-y divide-ink-200">
                  <SummaryRow label="Chi nhánh nguồn" value={fromBranch ? `${fromBranch.code} — ${fromBranch.name}` : '—'} />
                  <SummaryRow label="Chi nhánh đích" value={toBranch ? `${toBranch.code} — ${toBranch.name}` : '—'} />
                  <SummaryRow
                    label="Thuốc"
                    value={selectedMedicine ? `${selectedMedicine.sku} — ${selectedMedicine.name}` : '—'}
                  />
                  <SummaryRow
                    label="Lô"
                    value={selectedBatch ? `${selectedBatch.batchNo} · HSD ${formatDate(selectedBatch.expiryDate)}` : '—'}
                  />
                  <SummaryRow
                    label="Số lượng"
                    value={
                      <span className="font-mono font-semibold text-ink-900">
                        {form.qty} {selectedMedicine?.unit || ''}
                      </span>
                    }
                  />
                  {form.reason && <SummaryRow label="Lý do" value={form.reason} />}
                </div>

                <Alert variant="warning" title="Hành động không thể hoàn tác">
                  Sau khi xác nhận, tồn kho chi nhánh nguồn sẽ giảm và chi nhánh đích sẽ tăng tương ứng theo đúng lô.
                </Alert>
              </div>
            )}

            <div className="flex justify-between gap-2 pt-4 mt-4 border-t border-ink-200">
              <Button variant="outline" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                {step === 1 ? 'Huỷ' : 'Quay lại'}
              </Button>
              {step < 4 ? (
                <Button onClick={handleNext} disabled={!canGoNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  leftIcon={<PackageCheck className="w-4 h-4" />}
                >
                  Xác nhận chuyển kho
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Tóm tắt">
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-ink-500">Nguồn:</dt>
                <dd className="font-medium text-right">{fromBranch?.name || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Đích:</dt>
                <dd className="font-medium text-right">{toBranch?.name || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Lô:</dt>
                <dd className="font-mono text-xs">{selectedBatch?.batchNo || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Số lượng:</dt>
                <dd className="font-mono font-semibold">{form.qty || '—'}</dd>
              </div>
            </dl>
          </Card>

          {form.qty > 0 && selectedBatch && form.qty > selectedBatch.qtyOnHand && (
            <Alert variant="danger">Số lượng vượt tồn lô ({selectedBatch.qtyOnHand}).</Alert>
          )}

          <Alert variant="info" title="Tự động 2 bút toán">
            Mỗi lần chuyển tạo 2 giao dịch: trừ tồn nguồn + cộng tồn đích, cùng tham chiếu lô.
          </Alert>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm text-ink-900">{value}</span>
    </div>
  );
}

// silence unused
void Badge;
