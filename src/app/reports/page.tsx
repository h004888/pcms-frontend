'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { Card, Button, Select, Input, Alert, StatCard } from '@/components/ui';
import { BarChart3, FileSpreadsheet, FileText, TrendingUp, Boxes, ShoppingCart } from 'lucide-react';
import { toInputDate, formatVND, formatNumber } from '@/lib/utils';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'revenue' | 'inventory'>('revenue');
  const [from, setFrom] = useState(toInputDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(toInputDate(new Date()));
  const [groupBy, setGroupBy] = useState('day');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Báo cáo & Thống kê
        </h1>
        <p className="text-sm text-gray-500 mt-1">UC09 - FR9.1-FR9.5 · Báo cáo doanh thu, tồn kho, xuất Excel/PDF</p>
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
          {reportType === 'inventory' && <div className="sm:col-span-3 self-end text-xs text-gray-500">Báo cáo tồn kho tổng quan</div>}
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={generate} loading={loading} leftIcon={<BarChart3 className="w-4 h-4" />}>
            Tạo báo cáo
          </Button>
          {data && (
            <>
              <Button variant="outline" leftIcon={<FileSpreadsheet className="w-4 h-4" />} onClick={() => toast.success('Xuất Excel - chưa implement (FR9.3)')}>Xuất Excel</Button>
              <Button variant="outline" leftIcon={<FileText className="w-4 h-4" />} onClick={() => toast.success('Xuất PDF - chưa implement (FR9.4)')}>Xuất PDF</Button>
            </>
          )}
        </div>
      </Card>

      {data && reportType === 'revenue' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <StatCard title="Tổng đơn" value={formatNumber(data.totalOrders || 0)} icon={ShoppingCart} color="primary" />
            <StatCard title="Tổng doanh thu" value={formatVND((data.rows || []).reduce((s: number, r: any) => s + (r.net || 0), 0))} icon={TrendingUp} color="medical" />
            <StatCard title="Tổng giảm giá" value={formatVND((data.rows || []).reduce((s: number, r: any) => s + (r.discount || 0), 0))} icon={TrendingUp} color="warning" />
          </div>
          <Card title={`Chi tiết doanh thu (${(data.rows || []).length} dòng)`}>
            {(!data.rows || data.rows.length === 0) ? <p className="text-center text-gray-500 py-6">Không có dữ liệu trong khoảng thời gian này (MSG25)</p> : (
              <table className="min-w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr className="text-xs uppercase text-gray-500">
                    <th className="text-left py-2">Thời gian</th>
                    <th className="text-right">Đơn hàng</th>
                    <th className="text-right">Tổng bán</th>
                    <th className="text-right">Giảm</th>
                    <th className="text-right">Thực thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.rows.map((r: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium">{r.date}</td>
                      <td className="text-right">{r.orders}</td>
                      <td className="text-right">{formatVND(r.gross)}</td>
                      <td className="text-right text-red-600">-{formatVND(r.discount)}</td>
                      <td className="text-right font-semibold text-medical-700">{formatVND(r.net)}</td>
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
          <p className="text-sm text-gray-600">Tổng số lô hàng trong hệ thống: <strong>{data.totalBatches}</strong></p>
        </Card>
      )}

      {!data && !loading && (
        <Alert variant="info" title="Hướng dẫn">
          Chọn loại báo cáo và bấm "Tạo báo cáo" để xem dữ liệu
        </Alert>
      )}
    </DashboardLayout>
  );
}
