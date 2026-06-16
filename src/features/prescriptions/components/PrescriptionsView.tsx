// =====================================================
// PCMS - Prescriptions View (UC12)
// =====================================================

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, Input, Textarea, Select, Button, Alert, EmptyState } from '@/components/ui';
import { Customer } from '@/types';
import { FileText, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { apiClient, getErrorMessage } from '@/lib/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'SIGNED', label: 'Đã ký' },
];

export function PrescriptionsView() {
  const { state } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { patientId: '', diagnosis: '', notes: '', licenseNo: '', status: 'SIGNED' as 'DRAFT' | 'SIGNED' },
  });

  useEffect(() => {
    apiClient.get('/customers?size=100').then((r) => setCustomers(r.data.data)).catch(() => {});
    apiClient.get('/prescriptions?size=10').then((r) => setRecent(r.data.data || [])).catch(() => {});
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, doctorId: state.user?.id };
      await apiClient.post('/prescriptions', payload);
      toast.success('Tạo đơn thuốc thành công (FR12.1)');
      reset();
      const r = await apiClient.get('/prescriptions?size=10');
      setRecent(r.data.data || []);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Đơn thuốc (Prescription)</h1>
        <p className="text-sm text-ink-500 mt-1">UC12 - Dược sĩ kê đơn · FR12.1-FR12.4</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Tạo đơn thuốc mới" subtitle="Điền thông tin bệnh nhân và chẩn đoán">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select
              label="Bệnh nhân"
              required
              options={[{ value: '', label: '— Chọn bệnh nhân —' }, ...customers.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))]}
              {...register('patientId', { required: 'Bắt buộc' })}
              error={errors.patientId?.message}
            />
            <Textarea
              label="Chẩn đoán"
              required
              rows={3}
              {...register('diagnosis', { required: 'Bắt buộc', minLength: { value: 5, message: 'Tối thiểu 5 ký tự' } })}
              error={errors.diagnosis?.message}
              placeholder="VD: Viêm họng cấp, sốt nhẹ..."
            />
            <Textarea
              label="Ghi chú / Hướng dẫn"
              rows={2}
              {...register('notes')}
              placeholder="VD: Uống sau ăn, nghỉ ngơi 3 ngày..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Số giấy phép hành nghề"
                placeholder="VD: PH-LIC-001"
                {...register('licenseNo')}
              />
              <Select label="Trạng thái" options={STATUS_OPTIONS} {...register('status')} />
            </div>
            <Button type="submit" loading={isSubmitting} leftIcon={<Save className="w-4 h-4" />} fullWidth>
              Lưu đơn thuốc
            </Button>
            <Alert variant="info">
              💡 Đơn thuốc sẽ tự động có mã RX-yyyy#### và chữ ký số (FR12.2, FR12.4)
            </Alert>
          </form>
        </Card>

        <Card title="Đơn thuốc gần đây">
          {recent.length === 0 ? <EmptyState title="Chưa có đơn thuốc" /> : (
            <ul className="space-y-2">
              {recent.map((p) => (
                <li key={p.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-ink-50">
                  <FileText className="w-5 h-5 text-ink-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{p.code}</p>
                    <p className="text-xs text-ink-500 line-clamp-1">{p.diagnosis}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-accent-100 text-accent-800 rounded">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
