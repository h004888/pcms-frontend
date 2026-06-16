// =====================================================
// PCMS - Medicines List Page (SCR-MED-LIST) - UC04
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column } from '@/components/ui';
import { Medicine } from '@/types';
import { formatVND, getStatusColor } from '@/lib/utils';
import { MedicineForm } from '@/features/medicines';
import { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Pill } from 'lucide-react';

const UNIT_OPTIONS = [
  { value: 'box', label: 'Hộp' },
  { value: 'bottle', label: 'Chai' },
  { value: 'strip', label: 'Vỉ' },
];

export default function MedicinesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDelete = async (m: Medicine) => {
    if (!confirm(`Vô hiệu hóa thuốc "${m.name}"?`)) return;
    try {
      await apiClient.delete(`/medicines/${m.id}`);
      toast.success('Đã vô hiệu hóa thuốc');
      setRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns: Column<Medicine>[] = [
    { key: 'sku', header: 'SKU', width: '100px', render: (m) => <span className="font-mono text-xs">{m.sku}</span> },
    { key: 'name', header: 'Tên thuốc', render: (m) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-ink-50 rounded"><Pill className="w-4 h-4 text-ink-500" /></div>
        <div>
          <p className="font-medium">{m.name}</p>
          {m.prescriptionRequired && <span className="text-xs text-red-600">⚕️ Kê đơn</span>}
        </div>
      </div>
    )},
    { key: 'price', header: 'Giá', width: '130px', align: 'right', render: (m) => <span className="font-semibold text-accent-700">{formatVND(m.price)}</span> },
    { key: 'unit', header: 'Đơn vị', width: '80px', render: (m) => UNIT_OPTIONS.find((u) => u.value === m.unit)?.label || m.unit },
    { key: 'status', header: 'Trạng thái', width: '100px', render: (m) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(m.status)}`}>{m.status}</span> },
  ];

  return (
    <DashboardLayout>
      <ListPage<Medicine>
        key={refreshKey}
        title="Quản lý thuốc"
        subtitle="UC04 - Danh mục thuốc trong hệ thống"
        endpoint="/medicines"
        columns={columns}
        searchPlaceholder="Tìm theo tên thuốc..."
        renderForm={({ open, onClose, item, refetch }) => (
          <MedicineForm open={open} onClose={onClose} item={item} onSuccess={refetch} />
        )}
        addButtonLabel="Thêm thuốc mới"
        customActions={(m) => (
          <button onClick={(e) => { e.stopPropagation(); handleDelete(m); }} className="p-1 text-ink-500 hover:text-red-600" title="Vô hiệu hóa">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}
