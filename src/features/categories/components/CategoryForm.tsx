'use client';

// =====================================================
// PCMS - CategoryForm component (P1.7)
// Create/Edit form dùng react-hook-form + zod.
// =====================================================

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Input, Textarea, Button } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import type { Category } from '../types';

const schema = z.object({
  code: z.string().max(50).optional(),
  name: z
    .string()
    .min(1, 'Tên danh mục không được trống')
    .max(100, 'Tối đa 100 ký tự'),
  description: z.string().max(500, 'Tối đa 500 ký tự').optional(),
});

type FormData = z.infer<typeof schema>;

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  item?: Category | null;
  onSuccess: () => void;
}

export function CategoryForm({
  open,
  onClose,
  item,
  onSuccess,
}: CategoryFormProps) {
  const isEdit = !!item;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
    },
  });

  // Reset form khi mở/đóng modal hoặc đổi item
  useEffect(() => {
    if (open) {
      reset({
        code: item?.code ?? '',
        name: item?.name ?? '',
        description: item?.description ?? '',
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        code: data.code || (item?.code ?? undefined),
      };
      if (isEdit && item) {
        await apiClient.put(`/categories/${item.id}`, payload);
        toast.success('Đã cập nhật danh mục');
      } else {
        await apiClient.post('/categories', payload);
        toast.success('Đã tạo danh mục mới');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Mã danh mục"
        placeholder="VD: CAT-ANTIBIOTIC"
        disabled={isEdit}
        {...register('code')}
        hint="Tùy chọn — để trống sẽ tự sinh"
      />
      <Input
        label="Tên danh mục"
        required
        {...register('name')}
        error={errors.name?.message}
        placeholder="VD: Thuốc kháng sinh"
      />
      <Textarea
        label="Mô tả"
        rows={3}
        {...register('description')}
        error={errors.description?.message}
        placeholder="Mô tả ngắn về nhóm thuốc..."
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

export default CategoryForm;
