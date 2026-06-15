'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Alert, Button } from '@/components/ui';
import { InventoryBatch } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';
import { AlertTriangle, Boxes, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import { useApiDetail } from '@/hooks/useApi';
import { useState } from 'react';

export default function InventoryPage() {
  const [lowStockEndpoint] = useState('/inventory/low-stock');
  const lowStock = useApiDetail<InventoryBatch[]>(lowStockEndpoint);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý tồn kho</h1>
          <p className="page-subtitle">UC05 - Theo dõi tồn kho theo lô · BR02: cảnh báo dưới min · BR03: cảnh báo hết hạn</p>
        </div>
        <Link
          href="/inventory/import"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
        >
          <Upload className="w-4 h-4" />
          Nhập kho
        </Link>
      </div>

      {lowStock.data && lowStock.data.length > 0 && (
        <Alert variant="warning" className="mb-4" title={`${lowStock.data.length} lô dưới mức tối thiểu (BR02)`}>
          <ul className="text-xs space-y-1 mt-1">
            {lowStock.data.slice(0, 5).map((b) => (
              <li key={b.id}>• <strong>Lô {b.batchNo}</strong>: còn {b.qtyOnHand} (min: {b.minStockLevel})</li>
            ))}
            {lowStock.data.length > 5 && <li className="italic">...và {lowStock.data.length - 5} lô khác</li>}
          </ul>
        </Alert>
      )}

      <ListPage<InventoryBatch>
        title="Tồn kho hiện tại"
        subtitle={`${lowStock.data?.length || 0} lô dưới mức tối thiểu`}
        endpoint="/inventory"
        columns={[
          { key: 'batchNo', header: 'Mã lô', width: '130px', render: (b) => <span className="font-mono font-semibold">{b.batchNo}</span> },
          { key: 'medicineId', header: 'Medicine ID', render: (b) => <span className="text-xs font-mono text-gray-600">{b.medicineId?.slice(0, 8)}...</span> },
          { key: 'branchId', header: 'Branch ID', render: (b) => <span className="text-xs font-mono text-gray-600">{b.branchId?.slice(0, 8)}...</span> },
          { key: 'qtyOnHand', header: 'SL', width: '80px', align: 'right', render: (b) => (
            <span className={b.qtyOnHand < b.minStockLevel ? 'text-red-600 font-semibold' : 'font-semibold'}>
              {b.qtyOnHand}
            </span>
          )},
          { key: 'expiryDate', header: 'Hết hạn', width: '130px', render: (b) => <span className="text-sm">{formatDate(b.expiryDate)}</span> },
        ]}
        searchPlaceholder="Tìm theo mã lô..."
        canAdd={false}
        emptyMessage="Chưa có lô hàng nào trong kho"
      />
    </DashboardLayout>
  );
}
