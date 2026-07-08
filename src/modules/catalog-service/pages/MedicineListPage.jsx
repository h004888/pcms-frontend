import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Eye,
  Pencil,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  ToggleRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  deactivateMedicine,
  listCategories,
  listMedicines,
  listSuppliers,
} from '../api/medicineApi.js'
import { MedicineStatusDialog } from '../components/MedicineStatusDialog.jsx'
import {
  formatCurrency,
  getCategoryName,
  getSupplierName,
  normalizeSearch,
  prescriptionLabel,
} from '../services/medicineFormatters.js'

const PAGE_SIZE = 10

export function MedicineListPage() {
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [categoryId, setCategoryId] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ACTIVE')
  const [prescriptionFilter, setPrescriptionFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [statusMedicine, setStatusMedicine] = useState(null)

  const medicinesQuery = useQuery({
    queryKey: ['medicines', appliedSearch, categoryId],
    queryFn: () =>
      listMedicines({
        search: appliedSearch || undefined,
        categoryId: categoryId === 'ALL' ? undefined : categoryId,
        page: 0,
        size: 100,
      }),
  })
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategories({ page: 0, size: 100 }),
  })
  const suppliersQuery = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => listSuppliers({ page: 0, size: 100 }),
  })

  const categories = useMemo(
    () => categoriesQuery.data?.data || [],
    [categoriesQuery.data?.data],
  )
  const suppliers = useMemo(
    () => suppliersQuery.data?.data || [],
    [suppliersQuery.data?.data],
  )
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )
  const suppliersById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier])),
    [suppliers],
  )

  const statusMutation = useMutation({
    mutationFn: ({ medicine }) => deactivateMedicine(medicine.id),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái thuốc.')
      setStatusMedicine(null)
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const medicines = useMemo(
    () => medicinesQuery.data?.data || [],
    [medicinesQuery.data?.data],
  )
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesStatus =
        statusFilter === 'ALL' || medicine.status === statusFilter
      const matchesPrescription =
        prescriptionFilter === 'ALL' ||
        String(Boolean(medicine.prescriptionRequired)) === prescriptionFilter

      return matchesStatus && matchesPrescription
    })
  }, [medicines, prescriptionFilter, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredMedicines.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )
  const normalizedSearch = normalizeSearch(appliedSearch)

  function handleSearch(event) {
    event.preventDefault()
    setAppliedSearch(searchInput.trim())
    setPage(1)
  }

  function handleReset() {
    setSearchInput('')
    setAppliedSearch('')
    setCategoryId('ALL')
    setStatusFilter('ACTIVE')
    setPrescriptionFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý thuốc</h1>
            <p className="page-description">
              Quản lý danh mục thuốc, nhóm danh mục, nhà cung cấp, giá bán và
              trạng thái kinh doanh và thông tin bán hàng tại quầy.
            </p>
          </div>

          <Link className="btn btn-primary" to="/medicines/new">
            <Plus size={16} aria-hidden="true" />
            Thêm thuốc
          </Link>
        </header>

        <section className="card" aria-labelledby="medicine-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="medicine-filter-title">
                Bộ lọc
              </h2>
              <p className="card-subtitle">
                Tìm theo tên thuốc và lọc theo danh mục.
              </p>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>

          <form className="card-body toolbar medicine-toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Tìm thuốc</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="VD: Paracetamol, Vitamin C..."
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Danh mục</span>
              <select
                className="select"
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
                <option value="ALL">Tất cả trong dữ liệu nhận được</option>
              </select>
            </label>

            <label className="field">
              <span className="field-label">Kê đơn</span>
              <select
                className="select"
                value={prescriptionFilter}
                onChange={(event) => {
                  setPrescriptionFilter(event.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả</option>
                <option value="true">Cần đơn thuốc</option>
                <option value="false">Không cần đơn</option>
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm kiếm
            </button>

            <button
              className="btn btn-outline"
              type="button"
              onClick={() => medicinesQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        {statusFilter === 'INACTIVE' ? (
          <div className="error-state" role="note">
            Danh sách ngừng hoạt động chỉ hiển thị khi dữ liệu đã sẵn sàng trong hệ thống.
            Có thể mở trực tiếp chi tiết thuốc nếu đã biết mã thuốc.
          </div>
        ) : null}

        {suppliersQuery.isError ? (
          <div className="error-state" role="alert">
            Không tải được nhà cung cấp. Một số tên nhà cung cấp có thể tạm thời
            chưa hiển thị.
          </div>
        ) : null}

        <section className="card" aria-labelledby="medicine-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="medicine-list-title">
                Danh sách thuốc
              </h2>
              <p className="card-subtitle">
                {filteredMedicines.length} thuốc phù hợp
                {normalizedSearch ? ` với "${appliedSearch}"` : ''}.
              </p>
            </div>
          </div>

          {medicinesQuery.isLoading ? (
            <div className="empty-state">Đang tải danh sách thuốc...</div>
          ) : medicinesQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(medicinesQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy thuốc.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>SKU</th>
                      <th>Tên thuốc</th>
                      <th>Danh mục</th>
                      <th>Nhà cung cấp</th>
                      <th>Đơn vị</th>
                      <th>Giá bán</th>
                      <th>Kê đơn</th>
                      <th>Trạng thái</th>
                      <th>Tồn kho</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((medicine) => (
                      <tr key={medicine.id}>
                        <td>
                          <div className="medicine-thumb">
                            {medicine.imageUrl ? (
                              <img src={medicine.imageUrl} alt="" />
                            ) : (
                              <span>{medicine.name.slice(0, 1)}</span>
                            )}
                          </div>
                        </td>
                        <td className="mono">{medicine.sku}</td>
                        <td>
                          <strong>{medicine.name}</strong>
                          <div className="card-subtitle">
                            {medicine.slug || 'Chưa có slug'}
                          </div>
                        </td>
                        <td>{getCategoryName(medicine, categoriesById)}</td>
                        <td>{getSupplierName(medicine, suppliersById)}</td>
                        <td>{medicine.unit}</td>
                        <td className="mono">{formatCurrency(medicine.price)}</td>
                        <td>{prescriptionLabel(medicine.prescriptionRequired)}</td>
                        <td>
                          <StatusBadge status={medicine.status} />
                        </td>
                        <td>
                          <span className="badge badge-muted">Theo lô</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/medicines/${medicine.id}`}
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết ${medicine.name}`}
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/medicines/${medicine.id}/edit`}
                              title="Chỉnh sửa"
                              aria-label={`Chỉnh sửa ${medicine.name}`}
                            >
                              <Pencil size={16} aria-hidden="true" />
                            </Link>
                            <button
                              className="btn btn-outline btn-icon"
                              type="button"
                              title="Ngưng hoạt động"
                              aria-label={`Ngưng hoạt động ${medicine.name}`}
                              disabled={medicine.status !== 'ACTIVE'}
                              onClick={() => setStatusMedicine(medicine)}
                            >
                              <ToggleRight size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="card-subtitle">
                  Trang {safePage}/{totalPages}
                </span>
                <div className="pagination-actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Trước
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <MedicineStatusDialog
        medicine={statusMedicine}
        isPending={statusMutation.isPending}
        onClose={() => setStatusMedicine(null)}
        onConfirm={(payload) => statusMutation.mutate(payload)}
      />
    </DashboardLayout>
  )
}
