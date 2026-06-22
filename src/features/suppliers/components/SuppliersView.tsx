// =====================================================
// PCMS - Suppliers View (P1.9)
// =====================================================

'use client';

import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column } from '@/components/ui';
import { Supplier } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Truck, Mail, Phone } from 'lucide-react';

// Lazy-load form để tránh pull react-hook-form + zod vào bundle của trang list
const SupplierForm = dynamic(
  () => import('./SupplierForm').then((m) => m.SupplierForm),
  { ssr: false }
);

export function SuppliersView() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (s: Supplier) => {
    if (!confirm(`Ngừng hợp tác với nhà cung cấp "${s.name}"?`)) return;
    try {
      await apiClient.delete(`/suppliers/${s.id}`);
      toast.success('Đã ngừng hợp tác nhà cung cấp');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Nhà cung cấp',
      render: (s) => (
        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-ink-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium text-ink-900">{s.name}</div>
            <div className="text-xs text-ink-500 font-mono">
              MST: {s.taxCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      width: '220px',
      render: (s) => (
        <div className="text-sm">
          {s.contactPerson && (
            <div className="text-ink-800">{s.contactPerson}</div>
          )}
          {s.phone && (
            <div className="flex items-center gap-1 text-ink-600 text-xs mt-0.5">
              <Phone className="w-3 h-3" />
              <span className="font-mono">{s.phone}</span>
            </div>
          )}
          {s.email && (
            <div className="flex items-center gap-1 text-ink-600 text-xs mt-0.5">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[180px]" title={s.email}>
                {s.email}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Địa chỉ',
      render: (s) => (
        <span className="text-sm text-ink-600 line-clamp-2 max-w-xs">
          {s.address || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (s) => (
        <span
          className={
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ' +
            (s.status === 'ACTIVE'
              ? 'bg-success-50 text-success-700 border border-success-200'
              : 'bg-ink-100 text-ink-600 border border-ink-200')
          }
        >
          <span
            className={
              'w-1.5 h-1.5 rounded-full ' +
              (s.status === 'ACTIVE' ? 'bg-success-500' : 'bg-ink-400')
            }
          />
          {s.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng HĐ'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      width: '140px',
      render: (s) => (
        <span className="text-xs text-ink-500">{formatDateTime(s.createdAt)}</span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<Supplier>
        key={refreshKey}
        title="Nhà cung cấp"
        subtitle="Quản lý các nhà cung cấp dược phẩm, thông tin liên hệ và MST"
        endpoint="/suppliers"
        columns={columns}
        searchPlaceholder="Tìm theo tên, MST, SĐT, email..."
        addButtonLabel="Thêm nhà cung cấp"
        renderForm={({ open, onClose, item, refetch }) => (
          <SupplierForm
            open={open}
            onClose={onClose}
            item={item}
            onSuccess={refetch}
          />
        )}
        customActions={(s) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(s);
            }}
            className="p-1 text-ink-500 hover:text-red-600 transition-colors"
            title="Ngừng hợp tác"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}

export default SuppliersView;