// =====================================================
// PCMS - InventoryForm component (P1.10)
// Create/Edit form dùng react-hook-form + zod.
// =====================================================

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Input, Select, Button } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import type { InventoryBatch } from '../types';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'LOW_STOCK', label: 'Sắp hết' },
  { value: 'EXPIRING_SOON', label: 'Sắp hết hạn' },
  { value: 'EXPIRED', label: 'Đã hết hạn' },
];

const schema = z.object({
  medicineId: z.string().min(1, 'Chọn thuốc'),
  branchId: z.string().min(1, 'Chọn chi nhánh'),
  batchNo: z
    .string()
    .min(1, 'Số lô không được trống')
    .max(30, 'Tối đa 30 ký tự'),
  barcode: z.string().max(60).optional().or(z.literal('')),
  qtyOnHand: z.coerce.number().int('Phải là số nguyên').min(0, 'Không âm'),
  expiryDate: z.string().min(1, 'Chọn ngày hết hạn'),
  minStockLevel: z.coerce.number().int().min(0, 'Không âm').default(10),
  status: z
    .enum(['ACTIVE', 'LOW_STOCK', 'EXPIRING_SOON', 'EXPIRED'])
    .default('ACTIVE'),
});

type FormData = z.infer<typeof schema>;

export interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  item?: InventoryBatch | null;
  onSuccess: () => void;
  // Bổ sung: danh sách option cho medicine + branch (load từ page)
  medicineOptions?: Array<{ value: string; label: string }>;
  branchOptions?: Array<{ value: string; label: string }>;
}

export function InventoryForm({
  open,
  onClose,
  item,
  onSuccess,
  medicineOptions = [],
  branchOptions = [],
}: InventoryFormProps) {
  const isEdit = !!item;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      medicineId: '',
      branchId: '',
      batchNo: '',
      barcode: '',
      qtyOnHand: 0,
      expiryDate: '',
      minStockLevel: 10,
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        medicineId: item?.medicineId ?? '',
        branchId: item?.branchId ?? '',
        batchNo: item?.batchNo ?? '',
        barcode: item?.barcode ?? '',
        qtyOnHand: item?.qtyOnHand ?? 0,
        expiryDate: item?.expiryDate ?? '',
        minStockLevel: item?.minStockLevel ?? 10,
        status: item?.status ?? 'ACTIVE',
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        barcode: data.barcode || data.batchNo,
      };
      if (isEdit && item) {
        await apiClient.put(`/inventory/${item.id}`, payload);
        toast.success('Đã cập nhật lô tồn kho');
      } else {
        await apiClient.post('/inventory', payload);
        toast.success('Đã tạo lô tồn kho mới');
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
        <Select
          label="Thuốc"
          required
          {...register('medicineId')}
          error={errors.medicineId?.message}
          options={medicineOptions}
          placeholder="— Chọn thuốc —"
        />
        <Select
          label="Chi nhánh"
          required
          {...register('branchId')}
          error={errors.branchId?.message}
          options={branchOptions}
          placeholder="— Chọn chi nhánh —"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Số lô"
          required
          {...register('batchNo')}
          error={errors.batchNo?.message}
          placeholder="VD: LOT-DHG-2601"
        />
        <Input
          label="Barcode"
          {...register('barcode')}
          error={errors.barcode?.message}
          placeholder="Tự sinh nếu để trống"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Tồn kho"
          type="number"
          required
          {...register('qtyOnHand')}
          error={errors.qtyOnHand?.message}
          placeholder="0"
        />
        <Input
          label="Tồn tối thiểu"
          type="number"
          {...register('minStockLevel')}
          error={errors.minStockLevel?.message}
          placeholder="10"
        />
        <Input
          label="Ngày hết hạn"
          type="date"
          required
          {...register('expiryDate')}
          error={errors.expiryDate?.message}
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

export default InventoryForm;