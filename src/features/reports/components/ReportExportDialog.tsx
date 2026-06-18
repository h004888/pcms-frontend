// =====================================================
// PCMS - Report Export Dialog (SCR-REPORT-EXPORT · UC09)
// Modal chọn định dạng + cột + tên file trước khi tải.
// Hỗ trợ Excel (CSV UTF-8 BOM) + PDF (print template).
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import {
  Download, FileSpreadsheet, FileText,
  Loader2, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Modal, Button, Input, Checkbox } from '@/components/ui';
import { exportToExcel, exportToPDF, type ReportPayload, type ReportColumn } from '../utils/exporters';

interface ReportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payload: ReportPayload | null;
  defaultFileName?: string;
}

type Format = 'xlsx' | 'pdf';

const FORMAT_OPTIONS: { value: Format; label: string; icon: typeof FileSpreadsheet; desc: string }[] = [
  { value: 'xlsx', label: 'Excel (.csv)', icon: FileSpreadsheet, desc: 'Mở trong Excel/LibreOffice/Numbers, hỗ trợ UTF-8 tiếng Việt' },
  { value: 'pdf', label: 'PDF (in)', icon: FileText, desc: 'Mở hộp thoại in → chọn "Lưu thành PDF"' },
];

export function ReportExportDialog({ isOpen, onClose, payload, defaultFileName }: ReportExportDialogProps) {
  const [format, setFormat] = useState<Format>('xlsx');
  const [fileName, setFileName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [includeSummary, setIncludeSummary] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Reset state khi mở
  useEffect(() => {
    if (!isOpen || !payload) return;
    setFormat('xlsx');
    setFileName(defaultFileName || sanitizeFileName(payload.title));
    setSelectedColumns(new Set(payload.columns.map((c) => c.key)));
    setIncludeSummary(Boolean(payload.summary && payload.summary.length > 0));
    setExporting(false);
  }, [isOpen, payload, defaultFileName]);

  if (!payload) return null;

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedColumns.size === 0) {
      toast.error('Chọn ít nhất 1 cột để xuất');
      return;
    }
    setExporting(true);
    try {
      const filteredColumns: ReportColumn[] = payload.columns.filter((c) => selectedColumns.has(c.key));
      const filteredRows = payload.rows.map((row) => {
        const next: Record<string, unknown> = {};
        filteredColumns.forEach((c) => {
          next[c.key] = row[c.key];
        });
        return next;
      });

      const exportPayload: ReportPayload = {
        ...payload,
        columns: filteredColumns,
        rows: filteredRows,
        summary: includeSummary ? payload.summary : undefined,
        title: fileName || payload.title,
      };

      if (format === 'xlsx') {
        exportToExcel(exportPayload);
        toast.success('Đã tải file Excel');
      } else {
        exportToPDF(exportPayload);
        toast.success('Đã mở cửa sổ in PDF');
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi xuất báo cáo';
      toast.error(msg);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xuất báo cáo"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={exporting}>
            Huỷ
          </Button>
          <Button
            onClick={handleExport}
            loading={exporting}
            disabled={selectedColumns.size === 0}
            leftIcon={exporting ? undefined : <Download className="w-4 h-4" />}
          >
            {exporting ? 'Đang xuất...' : 'Xuất'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Định dạng */}
        <section>
          <p className="text-sm font-semibold text-ink-900 mb-2">Định dạng</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FORMAT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = format === opt.value;
              return (
                <label
                  key={opt.value}
                  className={[
                    'flex items-start gap-3 p-3 rounded-md border-2 cursor-pointer transition-colors',
                    active
                      ? 'border-accent-500 bg-accent-50'
                      : 'border-ink-200 hover:border-ink-300',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="format"
                    value={opt.value}
                    checked={active}
                    onChange={() => setFormat(opt.value)}
                    className="sr-only"
                  />
                  <Icon className={active ? 'w-5 h-5 text-accent-700' : 'w-5 h-5 text-ink-500'} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{opt.label}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Tên file */}
        <section>
          <Input
            label="Tên file"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="VD: bao-cao-doanh-thu"
            hint={`File sẽ tải về: ${fileName || 'bao-cao'}.${format === 'xlsx' ? 'csv' : 'pdf'}`}
          />
        </section>

        {/* Cột */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-ink-900">Cột dữ liệu ({selectedColumns.size}/{payload.columns.length})</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectedColumns(new Set(payload.columns.map((c) => c.key)))}
                className="text-xs text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded px-1"
              >
                Chọn tất cả
              </button>
              <span className="text-ink-300">·</span>
              <button
                type="button"
                onClick={() => setSelectedColumns(new Set())}
                className="text-xs text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded px-1"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto rounded-md border border-ink-200 p-2">
            {payload.columns.map((c) => {
              const checked = selectedColumns.has(c.key);
              return (
                <label
                  key={c.key}
                  className={[
                    'flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors',
                    checked ? 'bg-accent-50' : 'hover:bg-ink-50',
                  ].join(' ')}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => toggleColumn(c.key)}
                    aria-label={c.header}
                  />
                  <span className="truncate">{c.header}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Tuỳ chọn */}
        {payload.summary && payload.summary.length > 0 && (
          <section>
            <Checkbox
              label="Bao gồm phần tóm tắt (tổng đơn, tổng doanh thu...)"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
            />
          </section>
        )}

        {/* Preview */}
        <section className="rounded-md bg-ink-50 border border-ink-200 p-3 text-xs text-ink-600">
          <p className="font-semibold text-ink-700 mb-1">Tóm tắt nội dung</p>
          <p>{payload.rows.length} dòng · {selectedColumns.size} cột · {format === 'xlsx' ? 'CSV UTF-8' : 'HTML in PDF'}</p>
        </section>
      </div>
    </Modal>
  );
}

function sanitizeFileName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
