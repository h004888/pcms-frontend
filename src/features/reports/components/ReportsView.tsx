// =====================================================
// PCMS - Reports View (UC09)
// =====================================================

'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Select, Input, Alert, StatCard } from '@/components/ui';
import { BarChart3, FileSpreadsheet, FileText, TrendingUp, ShoppingCart } from 'lucide-react';
import { toInputDate, formatVND, formatNumber } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { ReportExportDialog } from './ReportExportDialog';
import type { ReportPayload } from '../utils/exporters';

export function ReportsView() {
  const [reportType, setReportType] = useState<'revenue' | 'inventory'>('revenue');
  const [from, setFrom] = useState(toInputDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(toInputDate(new Date()));
  const [groupBy, setGroupBy] = useState('day');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      if (reportType === 'revenue') {
        const res = await apiClient.get(`/reports/revenue?from=${from}&to=${to}&groupBy=${groupBy}`);
        setData(res.data);
      } else {
        const res = await apiClient.get('/reports/inventory');
        setData(res.data);
      }
    } catch (err) {
      toast.error('Lỗi tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  // Xây payload cho ReportExportDialog
  const exportPayload: ReportPayload | null = useMemo(() => {
    if (!data) return null;

    if (reportType === 'revenue') {
      const rows = data.rows || [];
      const totalGross = rows.reduce((s: number, r: any) => s + (r.gross || 0), 0);
      const totalDiscount = rows.reduce((s: number, r: any) => s + (r.discount || 0), 0);
      const totalNet = rows.reduce((s: number, r: any) => s + (r.net || 0), 0);
      return {
        title: 'Báo cáo doanh thu',
        subtitle: `${from} → ${to} · Nhóm theo ${groupBy === 'day' ? 'ngày' : groupBy === 'week' ? 'tuần' : 'tháng'}`,
        rows,
        columns: [
          { key: 'date', header: 'Thời gian' },
          { key: 'orders', header: 'Số đơn', format: (v) => formatNumber(v as number) },
          { key: 'gross', header: 'Tổng bán', format: (v) => formatVND(v as number) },
          { key: 'discount', header: 'Giảm giá', format: (v) => formatVND(v as number) },
          { key: 'net', header: 'Thực thu', format: (v) => formatVND(v as number) },
        ],
        summary: [
          { label: 'Tổng số đơn', value: formatNumber(data.totalOrders || 0) },
          { label: 'Tổng bán', value: formatVND(totalGross) },
          { label: 'Tổng giảm', value: formatVND(totalDiscount) },
          { label: 'Thực thu', value: formatVND(totalNet) },
        ],
      };
    }

    return {
      title: 'Báo cáo tồn kho',
      subtitle: 'Tổng quan tồn kho toàn hệ thống',
      rows: [
        { metric: 'Tổng số lô', value: data.totalBatches || 0 },
        { metric: 'Lô dưới mức tối thiểu', value: data.lowStockCount || 0 },
      ],
      columns: [
        { key: 'metric', header: 'Chỉ số' },
        { key: 'value', header: 'Giá trị', format: (v) => formatNumber(v as number) },
      ],
    };
  }, [data, reportType, from, to, groupBy]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Báo cáo & Thống kê
        </h1>
        <p className="text-sm text-ink-500 mt-1">UC09 - FR9.1-FR9.5 · Báo cáo doanh thu, tồn kho, xuất Excel/PDF</p>
      </div>

      <Card className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="Loại báo cáo"
            options={[
              { value: 'revenue', label: 'Doanh thu' },
              { value: 'inventory', label: 'Tồn kho' },
            ]}
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
          />
          {reportType === 'revenue' && (
            <>
              <Input label="Từ ngày" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input label="Đến ngày" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              <Select
                label="Nhóm theo"
                options={[
                  { value: 'day', label: 'Ngày' },
                  { value: 'week', label: 'Tuần' },
                  { value: 'month', label: 'Tháng' },
                ]}
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              />
            </>
          )}
          {reportType === 'inventory' && <div className="sm:col-span-3 self-end text-xs text-ink-500">Báo cáo tồn kho tổng quan</div>}
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={generate} loading={loading} leftIcon={<BarChart3 className="w-4 h-4" />}>
            Tạo báo cáo
          </Button>
          {data && (
            <>
              <Button variant="outline" leftIcon={<FileSpreadsheet className="w-4 h-4" />} onClick={() => setExportOpen(true)}>Xuất Excel</Button>
              <Button variant="outline" leftIcon={<FileText className="w-4 h-4" />} onClick={() => setExportOpen(true)}>Xuất PDF</Button>
            </>
          )}
        </div>
      </Card>

      {data && reportType === 'revenue' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <StatCard title="Tổng đơn" value={formatNumber(data.totalOrders || 0)} icon={ShoppingCart} color="primary" />
            <StatCard title="Tổng doanh thu" value={formatVND((data.rows || []).reduce((s: number, r: any) => s + (r.net || 0), 0))} icon={TrendingUp} color="accent" />
            <StatCard title="Tổng giảm giá" value={formatVND((data.rows || []).reduce((s: number, r: any) => s + (r.discount || 0), 0))} icon={TrendingUp} color="warning" />
          </div>
          <Card title={`Chi tiết doanh thu (${(data.rows || []).length} dòng)`}>
            {(!data.rows || data.rows.length === 0) ? <p className="text-center text-ink-500 py-6">Không có dữ liệu trong khoảng thời gian này (MSG25)</p> : (
              <table className="min-w-full text-sm">
                <thead className="border-b border-ink-200">
                  <tr className="text-xs uppercase text-ink-500">
                    <th className="text-left py-2">Thời gian</th>
                    <th className="text-right">Đơn hàng</th>
                    <th className="text-right">Tổng bán</th>
                    <th className="text-right">Giảm</th>
                    <th className="text-right">Thực thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {data.rows.map((r: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium">{r.date}</td>
                      <td className="text-right">{r.orders}</td>
                      <td className="text-right">{formatVND(r.gross)}</td>
                      <td className="text-right text-red-600">-{formatVND(r.discount)}</td>
                      <td className="text-right font-semibold text-accent-700">{formatVND(r.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}

      {data && reportType === 'inventory' && (
        <Card title={`Tồn kho: ${data.totalBatches} lô, ${data.lowStockCount} cảnh báo`}>
          {data.lowStockCount > 0 && (
            <Alert variant="warning" title={`${data.lowStockCount} lô sắp hết hàng`} className="mb-3">
              Cần nhập thêm hàng
            </Alert>
          )}
          <p className="text-sm text-ink-600">Tổng số lô hàng trong hệ thống: <strong>{data.totalBatches}</strong></p>
        </Card>
      )}

      {!data && !loading && (
        <Alert variant="info" title="Hướng dẫn">
          Chọn loại báo cáo và bấm &ldquo;Tạo báo cáo&rdquo; để xem dữ liệu
        </Alert>
      )}

      <ReportExportDialog
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        payload={exportPayload}
      />
    </DashboardLayout>
  );
}
