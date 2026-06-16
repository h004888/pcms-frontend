// =====================================================
// PCMS - Medicine Form (Create/Edit)
// =====================================================

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Checkbox, Button } from '@/components/ui';
import type { Medicine } from '@/types';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu' },
];

const UNIT_OPTIONS = [
  { value: 'box', label: 'Hộp' },
  { value: 'bottle', label: 'Chai' },
  { value: 'strip', label: 'Vỉ' },
];

export function MedicineForm({ open, onClose, item, onSuccess }: {
  open: boolean; onClose: () => void; item: Medicine | null; onSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { sku: '', name: '', categoryId: '', supplierId: '', price: 0, unit: 'box', prescriptionRequired: false, status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' },
  });

  useEffect(() => {
    if (item) {
      reset({
        sku: item.sku, name: item.name, categoryId: item.categoryId, supplierId: item.supplierId || '', price: item.price,
        unit: item.unit, prescriptionRequired: item.prescriptionRequired, status: item.status,
      });
    } else {
      reset({ sku: '', name: '', categoryId: '', supplierId: '', price: 0, unit: 'box', prescriptionRequired: false, status: 'ACTIVE' });
    }
  }, [item, reset, open]);

  const onSubmit = async (data: any) => {
    try {
      data.price = parseFloat(data.price);
      if (item) {
        await apiClient.put(`/medicines/${item.id}`, data);
        toast.success('Cập nhật thuốc thành công');
      } else {
        await apiClient.post('/medicines', data);
        toast.success('Tạo thuốc thành công');
      }
      onSuccess();
      onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="SKU" required {...register('sku', { required: 'Bắt buộc' })} error={errors.sku?.message} placeholder="VD: MD001" />
        <Input label="Tên thuốc" required {...register('name', { required: 'Bắt buộc' })} error={errors.name?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Danh mục (UUID)" required {...register('categoryId', { required: 'Bắt buộc' })} error={errors.categoryId?.message} hint="Lấy từ trang Danh mục" />
        <Input label="Nhà cung cấp (UUID)" {...register('supplierId')} hint="Tùy chọn" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Giá (VND)" type="number" required {...register('price', { required: 'Bắt buộc', min: 0 })} error={errors.price?.message} />
        <Select label="Đơn vị" options={UNIT_OPTIONS} {...register('unit')} />
      </div>
      <div className="flex items-center gap-6">
        <Checkbox label="Thuốc kê đơn" {...register('prescriptionRequired')} />
        <Select label="Trạng thái" options={STATUS_OPTIONS} {...register('status')} className="flex-1" />
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-ink-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" loading={isSubmitting}>{item ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  );
}
