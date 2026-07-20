import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listInventoryBatches, listMovementReport } from '@modules/inventory-service/api/inventoryApi.js'
import { getMedicine, listCategories, listSuppliers } from '../api/medicineApi.js'
import { formatCurrency, formatDateTime, getCategoryName, getSupplierName, shortId } from '../services/medicineFormatters.js'

function DetailRow({ label, value, mono = false }) {
  return <div className="medicine-detail-row"><span>{label}</span><b>:</b><strong className={mono ? 'mono' : ''}>{value || '—'}</strong></div>
}

export function MedicineDetailPage() {
  const { medicineId } = useParams()
  const medicineQuery = useQuery({ queryKey: ['medicines', medicineId], queryFn: () => getMedicine(medicineId), enabled: Boolean(medicineId) })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => listCategories({ page: 0, size: 100 }) })
  const suppliersQuery = useQuery({ queryKey: ['suppliers'], queryFn: () => listSuppliers({ page: 0, size: 100 }) })
  const batchesQuery = useQuery({ queryKey: ['medicine-batches', medicineId], queryFn: () => listInventoryBatches({ medicineId }), enabled: Boolean(medicineId) })
  const movementsQuery = useQuery({ queryKey: ['medicine-movements', medicineId], queryFn: () => listMovementReport({ medicineId }), enabled: Boolean(medicineId) })

  const categories = useMemo(() => categoriesQuery.data?.data || [], [categoriesQuery.data?.data])
  const suppliers = useMemo(() => suppliersQuery.data?.data || [], [suppliersQuery.data?.data])
  const categoriesById = useMemo(() => new Map(categories.map((item) => [item.id, item])), [categories])
  const suppliersById = useMemo(() => new Map(suppliers.map((item) => [item.id, item])), [suppliers])
  const batches = useMemo(() => {
    const data = batchesQuery.data?.data || batchesQuery.data || []
    return Array.isArray(data) ? data.filter((batch) => batch.medicineId === medicineId) : []
  }, [batchesQuery.data, medicineId])
  const transactions = useMemo(() => {
    const data = movementsQuery.data?.data || movementsQuery.data || []
    return (Array.isArray(data) ? data : []).filter((row) => row.medicineId === medicineId).slice(0, 5)
  }, [medicineId, movementsQuery.data])
  const stockQuantity = batches.reduce((sum, batch) => sum + Number(batch.qtyOnHand ?? batch.quantity ?? 0), 0)
  const nearestExpiry = batches.map((batch) => batch.expiryDate).filter(Boolean).sort()[0]

  if (medicineQuery.isLoading) return <DashboardLayout><div className="empty-state">Đang tải chi tiết thuốc...</div></DashboardLayout>
  if (medicineQuery.isError) return <DashboardLayout><div className="error-state" role="alert">{getApiErrorMessage(medicineQuery.error)}</div></DashboardLayout>

  const medicine = medicineQuery.data
  const categoryName = getCategoryName(medicine, categoriesById)
  const supplierName = getSupplierName(medicine, suppliersById)

  return <DashboardLayout><div className="page-stack medicine-detail-page">
    <header className="page-header medicine-detail-heading"><h1 className="page-title">Chi tiết thuốc</h1><Link className="btn btn-outline" to="/medicines"><ArrowLeft size={16} aria-hidden="true" />Danh sách</Link></header>
    <section className="medicine-detail-frame">
      <div className="medicine-detail-top">
        <div className="medicine-detail-photo">{medicine.imageUrl ? <img src={medicine.imageUrl} alt={medicine.name} /> : <span>Ảnh thuốc</span>}<strong>{medicine.name}</strong></div>
        <div className="medicine-detail-info">
          <DetailRow label="Danh mục" value={categoryName} />
          <DetailRow label="Nhà cung cấp" value={supplierName} />
          <DetailRow label="Giá (VND)" value={formatCurrency(medicine.price)} mono />
          <DetailRow label="Đơn vị" value={medicine.unit} />
          <DetailRow label="Số lượng tồn" value={batchesQuery.isLoading ? 'Đang tải...' : stockQuantity} mono />
          <DetailRow label="Ngày hết hạn" value={nearestExpiry ? new Intl.DateTimeFormat('vi-VN').format(new Date(nearestExpiry)) : '—'} mono />
          <DetailRow label="Trạng thái" value={<StatusBadge status={medicine.status} />} />
          <DetailRow label="Ngày tạo" value={formatDateTime(medicine.createdAt)} />
          <DetailRow label="Cập nhật gần nhất" value={formatDateTime(medicine.updatedAt)} />
        </div>
      </div>
      <div className="medicine-detail-bottom">
        <section className="medicine-stock-history"><h2>Lịch sử tồn kho <small>(5 giao dịch gần nhất)</small></h2><div className="table-wrap"><table className="table"><thead><tr><th>Ngày</th><th>Loại</th><th>Số lượng</th><th>Tham chiếu</th><th>Ghi chú</th></tr></thead><tbody>{transactions.length > 0 ? transactions.map((row) => <tr key={row.transactionId}><td className="mono">{formatDateTime(row.createdAt)}</td><td>{row.type || '—'}</td><td className="mono">{row.qty}</td><td className="mono">{shortId(row.refId)}</td><td>{row.reason || '—'}</td></tr>) : <tr><td colSpan="5" className="medicine-empty-cell">Chưa có giao dịch tồn kho.</td></tr>}</tbody></table></div></section>
        <aside className="medicine-stock-overview"><h2>Tổng quan tồn kho</h2><DetailRow label="Tồn hiện tại" value={stockQuantity} mono /><DetailRow label="Mức tối thiểu" value={batches[0]?.minStockLevel || '—'} mono /><DetailRow label="Mức tối đa" value="—" /><DetailRow label="Giá trị tồn" value={formatCurrency(stockQuantity * Number(medicine.price || 0))} mono /></aside>
      </div>
      <div className="medicine-detail-actions"><Link className="btn btn-outline" to={`/medicines/${medicine.id}/edit`}>Chỉnh sửa</Link><Link className="btn btn-outline" to="/medicines">Đóng</Link></div>
    </section>
  </div></DashboardLayout>
}
