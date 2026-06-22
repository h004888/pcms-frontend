// =====================================================
// PCMS - Prescriptions List Page - UC12
// =====================================================

'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Badge } from '@/components/ui';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { useApiDetail } from '@/hooks/useApi';
import { Prescription, PrescriptionStatus } from '@/types';
import { Eye, Trash2, FileSignature, X } from 'lucide-react';

const STATUS_LABELS: Record<PrescriptionStatus, string> = {
  DRAFT: 'Bản nháp',
  SIGNED: 'Đã ký số',
  CANCELLED: 'Đã hủy',
};

export default function PrescriptionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSign = async (rx: Prescription) => {
    if (rx.status === 'SIGNED') return;
    if (!confirm(`Ký số đơn thuốc ${rx.code}?`)) return;
    try {
      await apiClient.put(`/prescriptions/${rx.id}/sign`);
      toast.success('Đã ký số đơn thuốc');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCancel = async (rx: Prescription) => {
    if (rx.status === 'CANCELLED') return;
    if (!confirm(`Hủy đơn thuốc ${rx.code}?`)) return;
    try {
      await apiClient.delete(`/prescriptions/${rx.id}`);
      toast.success('Đã hủy đơn thuốc');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const columns: Column<Prescription>[] = [
    {
      key: 'code',
      header: 'Mã đơn',
      width: '160px',
      render: (rx) => <span className="font-mono text-xs text-ink-700">{rx.code}</span>,
    },
    {
      key: 'patientId',
      header: 'Bệnh nhân',
      render: (rx) => <span className="text-sm">{rx.patientId.slice(0, 8)}…</span>,
    },
    {
      key: 'doctorId',
      header: 'Bác sĩ',
      render: (rx) => <span className="text-sm text-ink-600">{rx.doctorId.slice(0, 8)}…</span>,
    },
    {
      key: 'diagnosis',
      header: 'Chẩn đoán',
      render: (rx) => <span className="text-sm">{rx.diagnosis || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '130px',
      render: (rx) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(rx.status)}`}>
          {STATUS_LABELS[rx.status] || rx.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      width: '160px',
      render: (rx) => <span className="text-xs text-ink-500">{formatDateTime(rx.createdAt)}</span>,
    },
  ];

  return (
    <DashboardLayout>
      <ListPage<Prescription>
        key={refreshKey}
        title="Quản lý đơn thuốc"
        subtitle="UC12 - Kê đơn, ký số, quản lý đơn thuốc"
        endpoint="/prescriptions"
        columns={columns}
        searchPlaceholder="Tìm theo mã đơn, bệnh nhân, chẩn đoán..."
        canAdd={false}
        customActions={(rx) => (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleSign(rx); }}
              className="p-1 text-ink-500 hover:text-blue-600"
              title={rx.status === 'SIGNED' ? 'Đã ký' : 'Ký số'}
              disabled={rx.status === 'SIGNED'}
            >
              <FileSignature className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCancel(rx); }}
              className="p-1 text-ink-500 hover:text-red-600"
              title="Hủy"
              disabled={rx.status === 'CANCELLED'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </DashboardLayout>
  );
}
