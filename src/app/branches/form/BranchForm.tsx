'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, Button } from '@/components/ui';
import { Branch } from '@/types';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu' },
];

export function BranchForm({ open, onClose, item, onSuccess }: {
  open: boolean;
  onClose: () => void;
  item: Branch | null;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { code: '', name: '', address: '', phone: '', status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' },
  });

  useEffect(() => {
    if (item) {
      reset({ code: item.code, name: item.name, address: item.address, phone: item.phone, status: item.status });
    } else {
      reset({ code: '', name: '', address: '', phone: '', status: 'ACTIVE' });
    }
  }, [item, reset, open]);

  const onSubmit = async (data: any) => {
    try {
      if (item) {
        await apiClient.put(`/branches/${item.id}`, data);
        toast.success('Cập nhật chi nhánh thành công');
      } else {
        await apiClient.post('/branches', data);
        toast.success('Tạo chi nhánh thành công');
      }
      onSuccess();
      onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Mã chi nhánh" required {...register('code', { required: 'Bắt buộc', maxLength: { value: 10, message: 'Tối đa 10 ký tự' } })} error={errors.code?.message} placeholder="VD: HQ, B01, B02" />
        <Input label="Tên chi nhánh" required {...register('name', { required: 'Bắt buộc' })} error={errors.name?.message} />
      </div>
      <Input label="Địa chỉ" required {...register('address', { required: 'Bắt buộc' })} error={errors.address?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Số điện thoại" type="tel" required {...register('phone', { required: 'Bắt buộc' })} error={errors.phone?.message} />
        <Select label="Trạng thái" options={STATUS_OPTIONS} {...register('status')} />
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" loading={isSubmitting}>{item ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  );
}
