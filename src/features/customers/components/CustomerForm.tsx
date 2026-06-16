// =====================================================
// PCMS - Customer Form (Create/Edit)
// =====================================================

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Button } from '@/components/ui';
import type { Customer } from '@/types';
import { apiClient, getErrorMessage } from '@/lib/api';
import { isValidPhone } from '@/lib/utils';
import toast from 'react-hot-toast';

const GENDER_OPTIONS = [
  { value: '', label: '—' },
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

export function CustomerForm({ open, onClose, item, onSuccess }: {
  open: boolean; onClose: () => void; item: Customer | null; onSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { name: '', phone: '', email: '', address: '', gender: '' },
  });

  useEffect(() => {
    if (item) {
      reset({ name: item.name, phone: item.phone, email: item.email || '', address: item.address || '', gender: item.gender || '' });
    } else {
      reset({ name: '', phone: '', email: '', address: '', gender: '' });
    }
  }, [item, reset, open]);

  const onSubmit = async (data: any) => {
    try {
      if (data.gender === '') data.gender = undefined;
      if (item) {
        await apiClient.put(`/customers/${item.id}`, data);
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await apiClient.post('/customers', data);
        toast.success('Tạo khách hàng thành công');
      }
      onSuccess();
      onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Họ tên" required {...register('name', { required: 'Bắt buộc' })} error={errors.name?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Số điện thoại" type="tel" required {...register('phone', { required: 'Bắt buộc', validate: (v) => isValidPhone(v) || 'SĐT không hợp lệ (VD: 0901234567)' })} error={errors.phone?.message} />
        <Input label="Email" type="email" {...register('email', { validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email không hợp lệ' })} error={errors.email?.message} />
      </div>
      <Input label="Địa chỉ" {...register('address')} />
      <Select label="Giới tính" options={GENDER_OPTIONS} {...register('gender')} />
      <div className="flex justify-end gap-2 pt-2 border-t border-ink-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" loading={isSubmitting}>{item ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  );
}
