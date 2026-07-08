import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  Bell,
  Eye,
  History,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import {
  listCategories,
  listMedicines,
} from '@modules/catalog-service/api/medicineApi.js'
import { formatCurrency } from '@modules/catalog-service/services/medicineFormatters.js'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StockStatusBadge } from '../components/StockStatusBadge.jsx'
import {
  listInventoryBatches,
  listStockLevelReport,
} from '../api/inventoryApi.js'
import {
  getBatchQuantity,
  getMinimumStock,
  getStockStatus,
  normalizeSearch,
  shortId,
  STOCK_STATUS,
  unwrapList,
  formatDate,
} from '../services/inventoryFormatters.js'

const PAGE_SIZE = 10

function getBatchId(row) {
  return row.batchId || row.id
}

function getMedicineName(row, medicinesById) {
  return row.medicineName || medicinesById.get(row.medicineId)?.name || shortId(row.medicineId)
}

function getBranchName(row, branchesById) {
  return row.branchName || branchesById.get(row.branchId)?.name || shortId(row.branchId)
}

export function InventoryListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [branchId, setBranchId] = useState('ALL')
  const [categoryId, setCategoryId] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)

  const inventoryQuery = useQuery({
    queryKey: ['inventory-stock-level', branchId],
    queryFn: async () => {
      const params = branchId === 'ALL' ? {} : { branchId }

      try {
        return await listStockLevelReport(params)
      } catch {
        return listInventoryBatches(params)
      }
    },
  })
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 100 }),
  })
  const medicinesQuery = useQuery({
    queryKey: ['medicines'],
    queryFn: () => listMedicines({ page: 0, size: 100 }),
  })
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategories({ page: 0, size: 100 }),
  })

  const branches = useMemo(
    () => unwrapList(branchesQuery.data),
    [branchesQuery.data],
  )
  const medicines = useMemo(
    () => unwrapList(medicinesQuery.data),
    [medicinesQuery.data],
  )
  const categories = useMemo(
    () => unwrapList(categoriesQuery.data),
    [categoriesQuery.data],
  )
  const branchesById = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch])),
    [branches],
  )
  const medicinesById = useMemo(
    () => new Map(medicines.map((medicine) => [medicine.id, medicine])),
    [medicines],
  )
  const rows = useMemo(
    () => unwrapList(inventoryQuery.data),
    [inventoryQuery.data],
  )
  const filteredRows = useMemo(() => {
    const keyword = normalizeSearch(appliedSearch)

    return rows.filter((row) => {
      const medicine = medicinesById.get(row.medicineId)
      const matchesSearch =
        !keyword ||
        [
          row.batchNo,
          row.barcode,
          getBatchId(row),
          row.medicineId,
          row.branchId,
          getMedicineName(row, medicinesById),
          getBranchName(row, branchesById),
        ]
          .filter(Boolean)
          .some((value) => normalizeSearch(value).includes(keyword))
      const matchesCategory =
        categoryId === 'ALL' || medicine?.categoryId === categoryId
      const status = getStockStatus(row)
      const matchesStatus =
        statusFilter === 'ALL' ||
        status === statusFilter ||
        (statusFilter === STOCK_STATUS.LOW && row.status === 'LOW')

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [appliedSearch, branchesById, categoryId, medicinesById, rows, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )
  const stats = useMemo(() => {
    const totalQuantity = rows.reduce((sum, row) => sum + getBatchQuantity(row), 0)
    const estimatedValue = rows.reduce((sum, row) => {
      const price = Number(medicinesById.get(row.medicineId)?.price || 0)

      return sum + getBatchQuantity(row) * price
    }, 0)

    return {
      totalBatches: rows.length,
      totalQuantity,
      estimatedValue,
      lowOrOut: rows.filter((row) =>
        [STOCK_STATUS.LOW, STOCK_STATUS.OUT].includes(getStockStatus(row)),
      ).length,
      expiring: rows.filter((row) =>
        [STOCK_STATUS.EXPIRING, STOCK_STATUS.EXPIRED].includes(getStockStatus(row)),
      ).length,
    }
  }, [medicinesById, rows])

  function handleSearch(event) {
    event.preventDefault()
    setAppliedSearch(searchInput.trim())
    setPage(1)
  }

  function handleReset() {
    setSearchInput('')
    setAppliedSearch('')
    setBranchId('ALL')
    setCategoryId('ALL')
    setStatusFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">Quản lý tồn kho</h1>
            <p className="page-description">
              Theo dõi tồn theo lô, chi nhánh, hạn dùng và mức tồn tối thiểu.
              Các thao tác xuất và chuyển kho được xử lý theo nguyên tắc FIFO.
            </p>
          </div>

          <div className="table-actions">
            <Link className="btn btn-outline" to="/inventory/history">
              <History size={16} aria-hidden="true" />
              Lịch sử
            </Link>
            <Link className="btn btn-primary" to="/inventory/import">
              <ArrowDownToLine size={16} aria-hidden="true" />
              Nhập kho
            </Link>
          </div>
        </header>

        <section className="inventory-stat-grid" aria-label="Tổng quan tồn kho">
          <div className="stat-card">
            <div>
              <p className="stat-title">Lô đang theo dõi</p>
              <p className="stat-value mono">{stats.totalBatches}</p>
            </div>
            <PackageCheck color="var(--accent-700)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Tổng số lượng</p>
              <p className="stat-value mono">{stats.totalQuantity}</p>
            </div>
            <PackageCheck color="var(--ink-500)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Tồn dưới ngưỡng</p>
              <p className="stat-value mono">{stats.lowOrOut}</p>
            </div>
            <Bell color="var(--warning-700)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Giá trị ước tính</p>
              <p className="stat-value mono">{formatCurrency(stats.estimatedValue)}</p>
            </div>
            <PackageCheck color="var(--accent-700)" size={22} aria-hidden="true" />
          </div>
        </section>

        <section className="card" aria-labelledby="inventory-action-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="inventory-action-title">
                Thao tác nhanh
              </h2>
              <p className="card-subtitle">
                Truy cập nhanh các thao tác kho thường dùng.
              </p>
            </div>
          </div>
          <div className="card-body inventory-action-grid">
            <Link className="quick-action quick-action-primary" to="/inventory/import">
              <ArrowDownToLine size={22} aria-hidden="true" />
              <span>Nhập kho</span>
            </Link>
            <Link className="quick-action" to="/inventory/export">
              <ArrowUpFromLine size={22} aria-hidden="true" />
              <span>Xuất kho</span>
            </Link>
            <Link className="quick-action" to="/inventory/transfer">
              <ArrowRightLeft size={22} aria-hidden="true" />
              <span>Chuyển kho</span>
            </Link>
            <Link className="quick-action" to="/inventory/alerts">
              <Bell size={22} aria-hidden="true" />
              <span>Cảnh báo</span>
            </Link>
          </div>
        </section>

        <section className="card" aria-labelledby="inventory-filter-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="inventory-filter-title">
                Bộ lọc
              </h2>
              <p className="card-subtitle">
                Tìm theo thuốc, số lô, mã vạch, chi nhánh hoặc ID.
              </p>
            </div>
            <button className="btn btn-outline" type="button" onClick={handleReset}>
              <RotateCcw size={16} aria-hidden="true" />
              Đặt lại
            </button>
          </div>

          <form className="card-body toolbar inventory-toolbar" onSubmit={handleSearch}>
            <label className="field">
              <span className="field-label">Tìm tồn kho</span>
              <input
                className="input"
                maxLength={100}
                value={searchInput}
                placeholder="VD: Paracetamol, LOT-001, mã vạch..."
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Chi nhánh</span>
              <select
                className="select"
                value={branchId}
                onChange={(event) => {
                  setBranchId(event.target.value)
                  setPage(1)
                }}
              >
                <option value="ALL">Tất cả</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.code ? `${branch.code} - ${branch.name}` : branch.name}
                  </option>
                ))}
              </select>
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
                <option value="ALL">Tất cả</option>
                <option value={STOCK_STATUS.OK}>Ổn định</option>
                <option value={STOCK_STATUS.LOW}>Sắp hết</option>
                <option value={STOCK_STATUS.OUT}>Hết hàng</option>
                <option value={STOCK_STATUS.EXPIRING}>Sắp hết hạn</option>
                <option value={STOCK_STATUS.EXPIRED}>Quá hạn</option>
              </select>
            </label>

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => inventoryQuery.refetch()}
            >
              <RefreshCcw size={16} aria-hidden="true" />
              Tải lại
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="inventory-list-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="inventory-list-title">
                Danh sách lô tồn kho
              </h2>
              <p className="card-subtitle">
                {filteredRows.length} lô phù hợp, {stats.expiring} lô cần chú ý hạn dùng.
              </p>
            </div>
          </div>

          {inventoryQuery.isLoading ? (
            <div className="empty-state">Đang tải tồn kho...</div>
          ) : inventoryQuery.isError ? (
            <div className="card-body">
              <div className="error-state" role="alert">
                {getApiErrorMessage(inventoryQuery.error)}
              </div>
            </div>
          ) : pageRows.length === 0 ? (
            <div className="empty-state">Không tìm thấy lô tồn kho.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table inventory-table">
                  <thead>
                    <tr>
                      <th>Thuốc</th>
                      <th>Chi nhánh</th>
                      <th>Số lô</th>
                      <th>Mã vạch</th>
                      <th>Tồn</th>
                      <th>Tối thiểu</th>
                      <th>Hạn dùng</th>
                      <th>Trạng thái</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={getBatchId(row)}>
                        <td>
                          <strong>{getMedicineName(row, medicinesById)}</strong>
                          <div className="card-subtitle mono">{shortId(row.medicineId)}</div>
                        </td>
                        <td>{getBranchName(row, branchesById)}</td>
                        <td className="mono">{row.batchNo}</td>
                        <td className="mono">{row.barcode || '--'}</td>
                        <td className="mono">{getBatchQuantity(row)}</td>
                        <td className="mono">{getMinimumStock(row)}</td>
                        <td className="mono">{formatDate(row.expiryDate)}</td>
                        <td>
                          <StockStatusBadge row={row} />
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link
                              className="btn btn-outline btn-icon"
                              to={`/inventory/batches/${getBatchId(row)}`}
                              title="Xem chi tiết"
                              aria-label={`Xem chi tiết lô ${row.batchNo}`}
                            >
                              <Eye size={16} aria-hidden="true" />
                            </Link>
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
    </DashboardLayout>
  )
}
