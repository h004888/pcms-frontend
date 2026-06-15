// =====================================================
// PCMS - Table + Pagination components
// =====================================================

'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// === DataTable ===
export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
}

export function DataTable<T>({ columns, data, loading, emptyMessage = 'Không có dữ liệu', onRowClick, rowKey }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={col.width ? { width: col.width } : undefined}
                  className={clsx(
                    'px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    (!col.align || col.align === 'left') && 'text-left'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIdx) => (
              <tr
                key={rowKey ? rowKey(row) : rowIdx}
                onClick={() => onRowClick?.(row)}
                className={clsx(onRowClick && 'hover:bg-gray-50 cursor-pointer')}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={clsx(
                      'px-4 py-3 text-sm text-gray-900',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center'
                    )}
                  >
                    {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key as string] as ReactNode ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === Pagination ===
interface PaginationProps {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
}

export function Pagination({ page, size, total, totalPages, onPageChange, onSizeChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>
          Tổng <strong>{total}</strong> bản ghi
        </span>
        {onSizeChange && (
          <select
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          leftIcon={<ChevronLeft size={16} />}
        >
          Trước
        </Button>
        <span className="px-3 text-sm text-gray-700">
          Trang <strong>{page + 1}</strong> / {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          rightIcon={<ChevronRight size={16} />}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
