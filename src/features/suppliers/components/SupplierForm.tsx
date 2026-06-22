// =====================================================
// PCMS - SupplierForm component (P1.9)
// Create/Edit form dùng react-hook-form + zod.
// =====================================================

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Input, Textarea, Select, Button } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import type { Supplier } from '../types';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hợp tác' },
];

const schema = z.object({
  name: z
    .string()
    .min(1, 'Tên nhà cung cấp không được trống')
    .max(200, 'Tối đa 200 ký tự'),
  taxCode: z
    .string()
    .min(8, 'Mã số thuế tối thiểu 8 ký tự')
    .max(20, 'Tối đa 20 ký tự')
    .regex(/^[0-9-]+$/, 'Mã số thuế chỉ chứa số và dấu gạch ngang'),
  contactPerson: z
    .string()
    .max(100, 'Tối đa 100 ký tự')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(8, 'Số điện thoại tối thiểu 8 ký tự')
    .max(20, 'Tối đa 20 ký tự')
    .regex(/^[0-9+\-\s]+$/, 'Số điện thoại không hợp lệ'),
  email: z
    .string()
    .email('Email không hợp lệ')
    .max(120, 'Tối đa 120 ký tự')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(300, 'Tối đa 300 ký tự')
    .optional()
    .or(z.literal('')),
  bankName: z
    .string()
    .max(120, 'Tối đa 120 ký tự')
    .optional()
    .or(z.literal('')),
  bankAccount: z
    .string()
    .max(40, 'Tối đa 40 ký tự')
    .optional()
    .or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

type FormData = z.infer<typeof schema>;

export interface SupplierFormProps {
  open: boolean;
  onClose: () => void;
  item?: Supplier | null;
  onSuccess: () => void;
}

export function SupplierForm({
  open,
  onClose,
  item,
  onSuccess,
}: SupplierFormProps) {
  const isEdit = !!item;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      taxCode: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      bankName: '',
      bankAccount: '',
      status: 'ACTIVE',
    },
  });

  // Reset form khi mở/đóng modal hoặc đổi item
  useEffect(() => {
    if (open) {
      reset({
        name: item?.name ?? '',
        taxCode: item?.taxCode ?? '',
        contactPerson: item?.contactPerson ?? '',
        phone: item?.phone ?? '',
        email: item?.email ?? '',
        address: item?.address ?? '',
        bankName: item?.bankName ?? '',
        bankAccount: item?.bankAccount ?? '',
        status: item?.status ?? 'ACTIVE',
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Trim các field optional trống thành undefined
      const payload = {
        ...data,
        contactPerson: data.contactPerson || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
        bankName: data.bankName || undefined,
        bankAccount: data.bankAccount || undefined,
      };
      if (isEdit && item) {
        await apiClient.put(`/suppliers/${item.id}`, payload);
        toast.success('Đã cập nhật nhà cung cấp');
      } else {
        await apiClient.post('/suppliers', payload);
        toast.success('Đã thêm nhà cung cấp mới');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tên nhà cung cấp"
          required
          {...register('name')}
          error={errors.name?.message}
          placeholder="VD: Công ty CP Dược Hậu Giang"
        />
        <Input
          label="Mã số thuế"
          required
          {...register('taxCode')}
          error={errors.taxCode?.message}
          placeholder="VD: 0300512543"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Người liên hệ"
          {...register('contactPerson')}
          error={errors.contactPerson?.message}
          placeholder="VD: Nguyễn Văn A"
        />
        <Input
          label="Số điện thoại"
          required
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="VD: 02923891234"
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="VD: contact@company.com.vn"
      />

      <Textarea
        label="Địa chỉ"
        rows={2}
        {...register('address')}
        error={errors.address?.message}
        placeholder="VD: 288 Bis Nguyễn Văn Cừ, Q. Ninh Kiều, TP. Cần Thơ"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ngân hàng"
          {...register('bankName')}
          error={errors.bankName?.message}
          placeholder="VD: Vietcombank"
        />
        <Input
          label="Số tài khoản"
          {...register('bankAccount')}
          error={errors.bankAccount?.message}
          placeholder="VD: 71110001234567"
        />
      </div>

      <Select
        label="Trạng thái"
        {...register('status')}
        error={errors.status?.message}
        options={STATUS_OPTIONS}
      />

      <div className="flex justify-end gap-2 pt-2 border-t border-ink-200 -mx-5 px-5 -mb-4 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}

export default SupplierForm;