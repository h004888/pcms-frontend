// =====================================================
// PCMS - Branches List Page (SCR-BRANCH-LIST) - UC03
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column } from '@/components/ui';
import { Branch } from '@/types';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { BranchForm } from '@/features/branches';
import { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function BranchesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Vô hiệu hóa chi nhánh "${branch.name}"?`)) return;
    try {
      await apiClient.delete(`/branches/${branch.id}`);
      toast.success('Đã vô hiệu hóa chi nhánh');
      setRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns: Column<Branch>[] = [
    { key: 'code', header: 'Mã', width: '90px', render: (b) => <span className="font-mono font-semibold">{b.code}</span> },
    { key: 'name', header: 'Tên chi nhánh', render: (b) => <p className="font-medium">{b.name}</p> },
    { key: 'address', header: 'Địa chỉ', render: (b) => <span className="text-sm text-ink-600">{b.address}</span> },
    { key: 'phone', header: 'SĐT', width: '130px' },
    { key: 'status', header: 'Trạng thái', width: '110px', render: (b) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(b.status)}`}>{b.status}</span> },
    { key: 'updatedAt', header: 'Cập nhật', width: '150px', render: (b) => <span className="text-xs text-ink-500">{formatDateTime(b.updatedAt)}</span> },
  ];

  return (
    <DashboardLayout>
      <ListPage<Branch>
        key={refreshKey}
        title="Quản lý chi nhánh"
        subtitle="UC03 - Quản lý các chi nhánh trong chuỗi nhà thuốc"
        endpoint="/branches"
        columns={columns}
        searchPlaceholder="Tìm theo tên hoặc mã chi nhánh..."
        renderForm={({ open, onClose, item, refetch }) => (
          <BranchForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        customActions={(b) => (
          <button onClick={(e) => { e.stopPropagation(); handleDelete(b); }} className="p-1 text-ink-500 hover:text-red-600" title="Vô hiệu hóa">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}
