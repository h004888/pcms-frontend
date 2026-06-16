// =====================================================
// PCMS - Orders List View
// =====================================================

'use client';

import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Badge, Button } from '@/components/ui';
import { Order } from '@/types';
import { formatDateTime, formatVND, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils';
import { useState } from 'react';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Trash2, Eye, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrdersList() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCancel = async (order: Order) => {
    if (!confirm(`Hủy đơn hàng ${order.orderNumber}?`)) return;
    try {
      await apiClient.delete(`/orders/${order.id}`);
      toast.success('Đã hủy đơn hàng (BR06: hoàn trả tồn kho)');
      setRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Mã đơn', width: '170px', render: (o) => <span className="font-mono font-semibold text-accent-700">{o.orderNumber}</span> },
    { key: 'createdAt', header: 'Ngày tạo', width: '150px', render: (o) => <span className="text-xs text-ink-500">{formatDateTime(o.createdAt)}</span> },
    { key: 'items', header: 'Số SP', width: '80px', align: 'center', render: (o) => <Badge variant="info">{o.items?.length || 0}</Badge> },
    { key: 'subtotal', header: 'Tạm tính', width: '130px', align: 'right', render: (o) => formatVND(o.subtotal) },
    { key: 'discount', header: 'Giảm', width: '110px', align: 'right', render: (o) => <span className="text-red-600">{o.discount > 0 ? `-${formatVND(o.discount)}` : '—'}</span> },
    { key: 'total', header: 'Tổng', width: '140px', align: 'right', render: (o) => <span className="font-semibold text-accent-700">{formatVND(o.total)}</span> },
    { key: 'status', header: 'Trạng thái', width: '140px', render: (o) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ORDER_STATUS_COLORS[o.status]}`}>
        {ORDER_STATUS_LABELS[o.status] || o.status}
      </span>
    )},
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
          <p className="page-subtitle">UC06 - Quản lý đơn hàng · BR04: 5% discount cho qty ≥ 10</p>
        </div>
      </div>
      <ListPage<Order>
        key={refreshKey}
        title=""
        endpoint="/orders"
        columns={columns}
        searchPlaceholder="Tìm theo mã đơn..."
        canAdd={false}
        emptyMessage="Chưa có đơn hàng nào. Bấm nút bên dưới để tạo đơn mới."
        onRowClick={(o) => router.push(`/orders/${o.id}`)}
        customActions={(o) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/orders/${o.id}`} onClick={(e) => e.stopPropagation()} className="p-1 text-ink-500 hover:text-ink-500" title="Xem chi tiết">
              <Eye className="w-4 h-4" />
            </Link>
            {o.status === 'PENDING_PAYMENT' && (
              <button onClick={(e) => { e.stopPropagation(); handleCancel(o); }} className="p-1 text-ink-500 hover:text-red-600" title="Hủy đơn">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      />
      <div className="mt-4 flex gap-2">
        <Button
          onClick={() => router.push('/orders/new')}
          leftIcon={<ShoppingCart className="w-4 h-4" />}
        >
          Tạo đơn hàng mới
        </Button>
      </div>
    </DashboardLayout>
  );
}
