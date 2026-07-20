import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, MoreVertical, Pencil, Plus, RotateCcw, Search, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { deactivateMedicine, listCategories, listMedicines, listSuppliers } from '../api/medicineApi.js'
import { MedicineStatusDialog } from '../components/MedicineStatusDialog.jsx'
import { formatCurrency, getCategoryName, getSupplierName, normalizeSearch } from '../services/medicineFormatters.js'

const PAGE_SIZE = 10

export function MedicineListPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({ search: '', categoryId: 'ALL', status: 'ALL' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [page, setPage] = useState(1)
  const [statusMedicine, setStatusMedicine] = useState(null)

  const medicinesQuery = useQuery({
    queryKey: ['medicines', appliedFilters.search, appliedFilters.categoryId],
    queryFn: () => listMedicines({
      search: appliedFilters.search || undefined,
      categoryId: appliedFilters.categoryId === 'ALL' ? undefined : appliedFilters.categoryId,
      page: 0,
      size: 100,
    }),
  })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => listCategories({ page: 0, size: 100 }) })
  const suppliersQuery = useQuery({ queryKey: ['suppliers'], queryFn: () => listSuppliers({ page: 0, size: 100 }) })
  const categories = useMemo(() => categoriesQuery.data?.data || [], [categoriesQuery.data?.data])
  const suppliers = useMemo(() => suppliersQuery.data?.data || [], [suppliersQuery.data?.data])
  const categoriesById = useMemo(() => new Map(categories.map((item) => [item.id, item])), [categories])
  const suppliersById = useMemo(() => new Map(suppliers.map((item) => [item.id, item])), [suppliers])
  const medicines = useMemo(() => medicinesQuery.data?.data || [], [medicinesQuery.data?.data])
  const filteredMedicines = useMemo(() => medicines.filter((medicine) => (
    appliedFilters.status === 'ALL' || medicine.status === appliedFilters.status
  )), [appliedFilters.status, medicines])
  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredMedicines.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const statusMutation = useMutation({
    mutationFn: (medicine) => deactivateMedicine(medicine.id),
    onSuccess: () => {
      toast.success('Đã ngừng hoạt động thuốc.')
      setStatusMedicine(null)
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSearch(event) {
    event.preventDefault()
    setAppliedFilters({ ...filters, search: filters.search.trim() })
    setPage(1)
  }

  function handleReset() {
    const next = { search: '', categoryId: 'ALL', status: 'ALL' }
    setFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack medicine-list-page">
        <header className="page-header medicine-list-heading">
          <div>
            <h1 className="page-title">Danh sách thuốc</h1>
            <p className="page-description">Xem và quản lý tất cả thuốc trong hệ thống.</p>
          </div>
          <div className="table-actions">
            <button className="btn btn-outline" type="button" title="Chức năng nhập dữ liệu cần tệp mẫu.">
              <Upload size={16} aria-hidden="true" />Nhập
            </button>
            <Link className="btn btn-primary" to="/medicines/new"><Plus size={16} aria-hidden="true" />Thêm thuốc</Link>
          </div>
        </header>

        <section className="medicine-filter-card" aria-label="Bộ lọc thuốc">
          <form className="medicine-list-filter" onSubmit={handleSearch}>
            <label className="field medicine-search-field"><span className="field-label">Tìm thuốc</span><input className="input" value={filters.search} placeholder="Tìm theo tên, mã hoặc mã vạch..." onChange={(event) => setFilter('search', event.target.value)} /></label>
            <label className="field"><span className="field-label">Danh mục</span><select className="select" value={filters.categoryId} onChange={(event) => setFilter('categoryId', event.target.value)}><option value="ALL">Tất cả danh mục</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label className="field"><span className="field-label">Trạng thái</span><select className="select" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang hoạt động</option><option value="INACTIVE">Ngừng hoạt động</option></select></label>
            <button className="btn btn-outline" type="submit"><Search size={16} aria-hidden="true" />Lọc</button>
            <button className="btn btn-outline" type="button" onClick={handleReset}><RotateCcw size={16} aria-hidden="true" />Đặt lại</button>
          </form>
        </section>

        <section className="medicine-table-card" aria-label="Bảng danh sách thuốc">
          {medicinesQuery.isLoading ? <div className="empty-state">Đang tải danh sách thuốc...</div> : null}
          {medicinesQuery.isError ? <div className="error-state" role="alert">{getApiErrorMessage(medicinesQuery.error)}</div> : null}
          {!medicinesQuery.isLoading && !medicinesQuery.isError && pageRows.length === 0 ? <div className="empty-state">Không tìm thấy thuốc.</div> : null}
          {!medicinesQuery.isLoading && !medicinesQuery.isError && pageRows.length > 0 ? <>
            <div className="table-wrap"><table className="table medicine-list-table"><thead><tr><th>#</th><th>Thuốc</th><th>Mã</th><th>Danh mục</th><th>Nhà cung cấp</th><th>Giá (VND)</th><th>Tồn kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{pageRows.map((medicine, index) => <tr key={medicine.id}>
              <td className="mono">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
              <td><div className="medicine-list-name"><div className="medicine-thumb">{medicine.imageUrl ? <img src={medicine.imageUrl} alt="" /> : <span>{medicine.name?.slice(0, 1)}</span>}</div><strong>{medicine.name}</strong></div></td>
              <td className="mono">{medicine.sku || '—'}</td>
              <td>{getCategoryName(medicine, categoriesById)}</td>
              <td>{getSupplierName(medicine, suppliersById)}</td>
              <td className="mono">{formatCurrency(medicine.price)}</td>
              <td><span className="badge badge-muted">Theo lô</span></td>
              <td><StatusBadge status={medicine.status} /></td>
              <td><div className="table-actions medicine-row-actions"><Link className="btn btn-outline btn-icon" to={`/medicines/${medicine.id}`} title="Xem chi tiết"><Eye size={16} aria-hidden="true" /></Link><Link className="btn btn-outline btn-icon" to={`/medicines/${medicine.id}/edit`} title="Chỉnh sửa"><Pencil size={16} aria-hidden="true" /></Link><button className="btn btn-outline btn-icon" type="button" title="Ngừng hoạt động" disabled={medicine.status !== 'ACTIVE'} onClick={() => setStatusMedicine(medicine)}><MoreVertical size={16} aria-hidden="true" /></button></div></td>
            </tr>)}</tbody></table></div>
            <div className="medicine-list-pagination"><span>Hiển thị {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredMedicines.length)} trên {filteredMedicines.length} kết quả</span><div className="pagination-actions"><button className="btn btn-outline btn-compact" type="button" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Trước</button><span className="page-current mono">{safePage}</span><button className="btn btn-outline btn-compact" type="button" disabled={safePage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Sau</button></div></div>
          </> : null}
        </section>
      </div>
      <MedicineStatusDialog medicine={statusMedicine} isPending={statusMutation.isPending} onClose={() => setStatusMedicine(null)} onConfirm={({ medicine }) => statusMutation.mutate(medicine)} />
    </DashboardLayout>
  )
}
