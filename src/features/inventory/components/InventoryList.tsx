// =====================================================
// PCMS - Inventory List View (P1.10)
// UC05 - Quản lý tồn kho theo lô (inventory batches)
// =====================================================

'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/Layout';
import { ListPage } from '@/components/shared/ListPage';
import { Column, Select, StatCard } from '@/components/ui';
import { InventoryBatch, Medicine, Branch } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import { apiClient, getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Trash2,
  Package,
  AlertTriangle,
  TrendingDown,
  CalendarClock,
  Warehouse,
  Pill,
} from 'lucide-react';

// Lazy-load form
const InventoryForm = dynamic(
  () => import('./InventoryForm').then((m) => m.InventoryForm),
  { ssr: false }
);

const STATUS_TONES: Record<
  string,
  { bg: string; text: string; dot: string; icon: typeof Pill; label: string }
> = {
  ACTIVE: {
    bg: 'bg-success-50 border-success-200',
    text: 'text-success-700',
    dot: 'bg-success-500',
    icon: Package,
    label: 'Bình thường',
  },
  LOW_STOCK: {
    bg: 'bg-warning-50 border-warning-200',
    text: 'text-warning-700',
    dot: 'bg-warning-500',
    icon: TrendingDown,
    label: 'Sắp hết',
  },
  EXPIRING_SOON: {
    bg: 'bg-orange-50 border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    icon: CalendarClock,
    label: 'Sắp hết hạn',
  },
  EXPIRED: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    icon: AlertTriangle,
    label: 'Đã hết hạn',
  },
};

export function InventoryList() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringCount, setExpiringCount] = useState(0);

  // Load medicines + branches cho form & filter
  useEffect(() => {
    Promise.all([
      apiClient
        .get<{ data: Medicine[] }>('/medicines?size=200')
        .then((r) => r.data.data || []),
      apiClient
        .get<{ data: Branch[] }>('/branches?size=100')
        .then((r) => r.data.data || []),
    ])
      .then(([meds, brs]) => {
        setMedicines(meds);
        setBranches(brs);
      })
      .catch(() => {
        // ignore
      });
  }, []);

  // Load low-stock count + expiring count (optional)
  useEffect(() => {
    apiClient
      .get<InventoryBatch[]>('/inventory/low-stock')
      .then((r) => setLowStockCount(r.data?.length ?? 0))
      .catch(() => {});
  }, [refreshKey]);

  useEffect(() => {
    // Count expiring by filter on inventory list
    apiClient
      .get<{ data: InventoryBatch[] }>('/inventory?status=EXPIRING_SOON&size=200')
      .then((r) => setExpiringCount(r.data?.data?.length ?? 0))
      .catch(() => {});
  }, [refreshKey]);

  const handleDelete = async (b: InventoryBatch) => {
    if (!confirm(`Xóa lô tồn kho "${b.batchNo}"?`)) return;
    try {
      await apiClient.delete(`/inventory/${b.id}`);
      toast.success('Đã xóa lô tồn kho');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Build medicine/branch lookup
  const medMap = useMemo(
    () => new Map(medicines.map((m) => [m.id, m])),
    [medicines]
  );
  const branchMap = useMemo(
    () => new Map(branches.map((b) => [b.id, b])),
    [branches]
  );

  const medicineOptions = useMemo(
    () =>
      medicines.map((m) => ({
        value: m.id,
        label: `${m.sku} — ${m.name}`,
      })),
    [medicines]
  );

  const branchOptions = useMemo(
    () => branches.map((b) => ({ value: b.id, label: b.name })),
    [branches]
  );

  const columns: Column<InventoryBatch>[] = [
    {
      key: 'batchNo',
      header: 'Số lô',
      width: '180px',
      render: (b) => (
        <div>
          <div className="font-mono font-medium text-ink-900 text-sm">
            {b.batchNo}
          </div>
          {b.barcode && (
            <div className="text-xs text-ink-500 font-mono">{b.barcode}</div>
          )}
        </div>
      ),
    },
    {
      key: 'medicine',
      header: 'Thuốc',
      render: (b) => {
        const med = medMap.get(b.medicineId);
        return (
          <div>
            <div className="font-medium text-ink-900 text-sm">
              {med?.name ?? b.medicineId.slice(0, 8)}
            </div>
            {med && (
              <div className="text-xs text-ink-500 font-mono">{med.sku}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'branch',
      header: 'Chi nhánh',
      width: '180px',
      render: (b) => {
        const br = branchMap.get(b.branchId);
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <Warehouse className="w-3.5 h-3.5 text-ink-500" />
            <span className="text-ink-800">{br?.name ?? b.branchId.slice(0, 8)}</span>
          </div>
        );
      },
    },
    {
      key: 'qty',
      header: 'Tồn kho',
      width: '120px',
      align: 'right',
      render: (b) => (
        <div className="font-mono">
          <div
            className={
              b.qtyOnHand <= b.minStockLevel
                ? 'font-semibold text-red-700'
                : 'text-ink-900'
            }
          >
            {b.qtyOnHand}
          </div>
          <div className="text-xs text-ink-500">
            min: {b.minStockLevel}
          </div>
        </div>
      ),
    },
    {
      key: 'expiry',
      header: 'Hạn dùng',
      width: '120px',
      render: (b) => (
        <span className="text-sm text-ink-700 font-mono">
          {formatDate(b.expiryDate)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '150px',
      render: (b) => {
        const tone = STATUS_TONES[b.status ?? 'ACTIVE'] ?? STATUS_TONES.ACTIVE;
        const Icon = tone.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${tone.bg} ${tone.text}`}
          >
            <Icon className="w-3 h-3" />
            <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
            {tone.label}
          </span>
        );
      },
    },
    {
      key: 'receivedAt',
      header: 'Ngày nhập',
      width: '140px',
      render: (b) => (
        <span className="text-xs text-ink-500">{formatDateTime(b.receivedAt)}</span>
      ),
    },
  ];

  // Endpoint with filters
  const endpoint = (() => {
    const params = new URLSearchParams();
    if (filterBranch) params.set('branchId', filterBranch);
    if (filterStatus) params.set('status', filterStatus);
    const qs = params.toString();
    return qs ? `/inventory?${qs}` : '/inventory';
  })();

  return (
    <DashboardLayout>
      {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <StatCard
                title="Tổng lô tồn kho"
                value={`${lowStockCount + expiringCount}+`}
                icon={Package}
              />
              <StatCard
                title="Sắp hết hàng"
                value={lowStockCount}
                icon={TrendingDown}
                color={lowStockCount > 0 ? 'warning' : 'ink'}
              />
              <StatCard
                title="Sắp hết hạn"
                value={expiringCount}
                icon={CalendarClock}
                color={expiringCount > 0 ? 'warning' : 'ink'}
              />
            </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          options={[
            { value: '', label: '— Tất cả chi nhánh —' },
            ...branchOptions,
          ]}
          value={filterBranch}
          onChange={(e) => {
            setFilterBranch(e.target.value);
            setRefreshKey((k) => k + 1);
          }}
        />
        <Select
          options={[
            { value: '', label: '— Tất cả trạng thái —' },
            ...Object.entries(STATUS_TONES).map(([k, v]) => ({
              value: k,
              label: v.label,
            })),
          ]}
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>

      <ListPage<InventoryBatch>
        key={refreshKey}
        title="Tồn kho (lô thuốc)"
        subtitle="Theo dõi tồn kho theo lô và chi nhánh — cảnh báo sắp hết và sắp hết hạn"
        endpoint={endpoint}
        columns={columns}
        searchPlaceholder="Tìm theo số lô, barcode..."
        addButtonLabel="Thêm lô mới"
        renderForm={({ open, onClose, item, refetch }) => (
          <InventoryForm
            open={open}
            onClose={onClose}
            item={item}
            onSuccess={refetch}
            medicineOptions={medicineOptions}
            branchOptions={branchOptions}
          />
        )}
        customActions={(b) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(b);
            }}
            className="p-1 text-ink-500 hover:text-red-600 transition-colors"
            title="Xóa lô"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />
    </DashboardLayout>
  );
}

export default InventoryList;