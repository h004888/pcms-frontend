// =====================================================
// PCMS - Reusable ListPage component
// Combines: DataTable + Pagination + Action Bar + Modal
// Used by all CRUD pages (users, branches, medicines, etc.)
// =====================================================

'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useApiList } from '@/hooks/useApi';
import { Button, Input, DataTable, Pagination, Modal, Column, EmptyState, LoadingSpinner } from '@/components/ui';

export interface ListPageProps<T> {
  title: string;
  subtitle?: string;
  endpoint: string;
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchParam?: string;        // query param name for search, e.g. 'search'
  filterParams?: Record<string, unknown>;  // additional static filters
  renderForm?: (props: { open: boolean; onClose: () => void; item: T | null; refetch: () => void }) => ReactNode;
  addButtonLabel?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  customActions?: (item: T) => ReactNode;
  rowKey?: (row: T) => string;
  canAdd?: boolean;
}

export function ListPage<T>({
  title,
  subtitle,
  endpoint,
  columns,
  searchPlaceholder = 'Tìm kiếm...',
  searchParam = 'search',
  filterParams = {},
  renderForm,
  addButtonLabel = 'Thêm mới',
  emptyMessage = 'Chưa có dữ liệu. Bấm "Thêm mới" để tạo.',
  onRowClick,
  customActions,
  rowKey,
  canAdd = true,
}: ListPageProps<T>) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);

  // Debounce search input (300ms per SRS §3.2.10)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const params: Record<string, unknown> = { ...filterParams };
  if (debouncedSearch) params[searchParam] = debouncedSearch;

  const { data, loading, error, total, totalPages, refetch, setPage, setSize } = useApiList<T>(
    endpoint,
    page,
    size,
    params
  );

  // Inject action column (Edit/Delete) if renderForm is provided OR customActions
  const allColumns: Column<T>[] = [...columns];
  if (customActions) {
    allColumns.push({
      key: '__actions',
      header: 'Thao tác',
      align: 'right',
      width: '160px',
      render: (row) => customActions(row),
    });
  }

  const handleAdd = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Làm mới
          </Button>
          {canAdd && renderForm && (
            <Button onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchPlaceholder && (
        <div className="mb-4 max-w-md">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : data.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <EmptyState title={emptyMessage} />
        </div>
      ) : (
        <>
          <DataTable
            columns={allColumns}
            data={data}
            onRowClick={onRowClick || (renderForm ? handleEdit : undefined)}
            rowKey={rowKey}
            emptyMessage={emptyMessage}
          />
          <Pagination
            page={page}
            size={size}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onSizeChange={setSize}
          />
        </>
      )}

      {/* Form modal */}
      {renderForm && (
        <Modal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          title={editItem ? `Chỉnh sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()} mới`}
          size="lg"
        >
          {renderForm({ open: formOpen, onClose: () => setFormOpen(false), item: editItem, refetch })}
        </Modal>
      )}
    </div>
  );
}
