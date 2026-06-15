'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Badge } from '@/components/ui';
import { Customer } from '@/types';
import { formatDateTime, formatVND } from '@/lib/utils';
import { CustomerForm } from './form/CustomerForm';
import { useState } from 'react';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, Star } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const columns: Column<Customer>[] = [
    { key: 'code', header: 'Mã KH', width: '130px', render: (c) => <span className="font-mono font-semibold text-primary-700">{c.code}</span> },
    { key: 'name', header: 'Họ tên', render: (c) => <p className="font-medium">{c.name}</p> },
    { key: 'phone', header: 'SĐT', width: '130px' },
    { key: 'email', header: 'Email', render: (c) => <span className="text-sm text-gray-600">{c.email || '—'}</span> },
    { key: 'points', header: 'Điểm thưởng', width: '120px', render: (c) => (
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold text-medical-700">{c.points}</span>
      </div>
    )},
    { key: 'createdAt', header: 'Ngày tạo', width: '130px', render: (c) => <span className="text-xs text-gray-500">{formatDateTime(c.createdAt)}</span> },
  ];

  return (
    <DashboardLayout>
      <ListPage<Customer>
        key={refreshKey}
        title="Quản lý khách hàng"
        subtitle="UC08 - Khách hàng & chương trình tích điểm (BR07: 1pt/1000 VND)"
        endpoint="/customers"
        columns={columns}
        searchPlaceholder="Tìm theo tên, SĐT, mã KH..."
        renderForm={({ open, onClose, item, refetch }) => (
          <CustomerForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        addButtonLabel="Thêm khách hàng"
        customActions={(c) => (
          <Link
            href={`/customers/${c.id}/history`}
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-gray-500 hover:text-primary-600"
            title="Xem lịch sử mua hàng"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      />
    </DashboardLayout>
  );
}
