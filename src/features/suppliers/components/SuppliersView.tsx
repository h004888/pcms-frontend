// =====================================================
// PCMS - Suppliers View
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Input, Button, Textarea, Select } from '@/components/ui';
import { Supplier } from '@/types';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Vô hiệu' },
];

function SupplierForm({ open, onClose, item, onSuccess }: { open: boolean; onClose: () => void; item: Supplier | null; onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { name: '', taxCode: '', phone: '', email: '', contactPerson: '', address: '', bankName: '', bankAccount: '', status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name, taxCode: item.taxCode, phone: item.phone, email: item.email || '',
        contactPerson: item.contactPerson || '', address: item.address || '',
        bankName: item.bankName || '', bankAccount: item.bankAccount || '', status: item.status,
      });
    } else {
      reset({ name: '', taxCode: '', phone: '', email: '', contactPerson: '', address: '', bankName: '', bankAccount: '', status: 'ACTIVE' });
    }
  }, [item, reset, open]);

  const onSubmit = async (data: any) => {
    try {
      if (item) {
        await apiClient.put(`/suppliers/${item.id}`, data);
        toast.success('Cập nhật nhà cung cấp');
      } else {
        await apiClient.post('/suppliers', data);
        toast.success('Tạo nhà cung cấp');
      }
      onSuccess(); onClose();
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Tên nhà cung cấp" required {...register('name', { required: 'Bắt buộc' })} error={errors.name?.message} />
        <Input label="Mã số thuế" required {...register('taxCode', { required: 'Bắt buộc' })} error={errors.taxCode?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Số điện thoại" type="tel" required {...register('phone', { required: 'Bắt buộc' })} error={errors.phone?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      </div>
      <Input label="Người liên hệ" {...register('contactPerson')} />
      <Textarea label="Địa chỉ" rows={2} {...register('address')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Tên ngân hàng" {...register('bankName')} />
        <Input label="Số tài khoản" {...register('bankAccount')} />
      </div>
      <Select label="Trạng thái" options={STATUS_OPTIONS} {...register('status')} />
      <div className="flex justify-end gap-2 pt-2 border-t border-ink-200 -mx-5 px-5 -mb-4 pb-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" loading={isSubmitting}>{item ? 'Cập nhật' : 'Tạo mới'}</Button>
      </div>
    </form>
  );
}

export function SuppliersView() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDelete = async (s: Supplier) => {
    if (!confirm(`Vô hiệu hóa nhà cung cấp "${s.name}"?`)) return;
    try {
      await apiClient.delete(`/suppliers/${s.id}`);
      toast.success('Đã vô hiệu hóa');
      setRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns: Column<Supplier>[] = [
    { key: 'name', header: 'Tên NCC', render: (s) => (
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-ink-500" />
        <span className="font-medium">{s.name}</span>
      </div>
    )},
    { key: 'taxCode', header: 'MST', width: '120px', render: (s) => <span className="font-mono text-xs">{s.taxCode}</span> },
    { key: 'phone', header: 'SĐT', width: '130px' },
    { key: 'email', header: 'Email', render: (s) => <span className="text-sm text-ink-600">{s.email || '—'}</span> },
    { key: 'status', header: 'Trạng thái', width: '110px', render: (s) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(s.status)}`}>{s.status}</span> },
  ];

  return (
    <DashboardLayout>
      <ListPage<Supplier>
        key={refreshKey}
        title="Quản lý nhà cung cấp"
        subtitle="UC11 - Danh sách nhà cung cấp thuốc"
        endpoint="/suppliers"
        columns={columns}
        searchPlaceholder="Tìm theo tên hoặc MST..."
        addButtonLabel="Thêm nhà cung cấp"
        renderForm={({ open, onClose, item, refetch }) => (
          <SupplierForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        customActions={(s) => (
          <button onClick={(e) => { e.stopPropagation(); handleDelete(s); }} className="p-1 text-ink-500 hover:text-red-600" title="Vô hiệu hóa">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}
