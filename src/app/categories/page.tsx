'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Input, Textarea, Button } from '@/components/ui';
import { Category } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Tag as TagIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

function CategoryForm({ open, onClose, item, onSuccess }: { open: boolean; onClose: () => void; item: Category | null; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (item) reset({ name: item.name, description: item.description || '' });
    else reset({ name: '', description: '' });
  }, [item, reset, open]);

  const onSubmit = async (data: any) => {
    try {
      if (item) {
        await apiClient.put(`/categories/${item.id}`, data);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await apiClient.post('/categories', data);
        toast.success('Tạo danh mục thành công');
      }
      onSuccess(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Tên danh mục" required {...register('name', { required: 'Bắt buộc' })} error={errors.name?.message} />
      <Textarea label="Mô tả" rows={3} {...register('description')} />
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" loading={isSubmitting}>{item ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDelete = async (c: Category) => {
    if (!confirm(`Xóa danh mục "${c.name}"?`)) return;
    try {
      await apiClient.delete(`/categories/${c.id}`);
      toast.success('Đã xóa danh mục');
      setRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Tên danh mục', render: (c) => (
      <div className="flex items-center gap-2">
        <TagIcon className="w-4 h-4 text-primary-600" />
        <span className="font-medium">{c.name}</span>
      </div>
    )},
    { key: 'description', header: 'Mô tả', render: (c) => <span className="text-sm text-gray-600">{c.description || '—'}</span> },
    { key: 'createdAt', header: 'Ngày tạo', width: '150px', render: (c) => <span className="text-xs text-gray-500">{formatDateTime(c.createdAt)}</span> },
  ];

  return (
    <DashboardLayout>
      <ListPage<Category>
        key={refreshKey}
        title="Danh mục thuốc"
        subtitle="Phân loại thuốc theo nhóm (kháng sinh, giảm đau, ...)"
        endpoint="/categories"
        columns={columns}
        searchPlaceholder="Tìm theo tên danh mục..."
        addButtonLabel="Thêm danh mục"
        renderForm={({ open, onClose, item, refetch }) => (
          <CategoryForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        customActions={(c) => (
          <button onClick={(e) => { e.stopPropagation(); handleDelete(c); }} className="p-1 text-gray-500 hover:text-red-600" title="Xóa">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}
