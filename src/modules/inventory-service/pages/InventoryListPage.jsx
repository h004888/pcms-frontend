import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  Bell,
  Eye,
  History,
  PackageCheck,
  Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '@modules/branch-service/api/branchApi.js'
import {
  getMedicine,
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

export function InventoryListPage({ variant = 'dashboard' }) {
  const isStockList = variant === 'stock-list'
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [branchId, setBranchId] = useState('ALL')
  const [categoryId, setCategoryId] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [expiryFilter, setExpiryFilter] = useState('ALL')
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
  const missingMedicineIds = useMemo(() => [...new Set(
    rows
      .filter((row) => !row.medicineName && row.medicineId && !medicinesById.has(row.medicineId))
      .map((row) => row.medicineId),
  )], [medicinesById, rows])
  const missingMedicinesQuery = useQuery({
    queryKey: ['inventory-medicine-names', missingMedicineIds],
    queryFn: async () => {
      const results = await Promise.all(
        missingMedicineIds.map((medicineId) => getMedicine(medicineId).catch(() => null)),
      )
      return results.filter(Boolean)
    },
    enabled: missingMedicineIds.length > 0,
  })
  const allMedicinesById = useMemo(() => new Map([
    ...medicinesById,
    ...unwrapList(missingMedicinesQuery.data).map((medicine) => [medicine.id, medicine]),
  ]), [medicinesById, missingMedicinesQuery.data])
  const filteredRows = useMemo(() => {
    const keyword = normalizeSearch(appliedSearch)

    return rows.filter((row) => {
      const medicine = allMedicinesById.get(row.medicineId)
      const matchesSearch =
        !keyword ||
        [
          row.batchNo,
          row.barcode,
          getBatchId(row),
          row.medicineId,
          row.branchId,
          getMedicineName(row, allMedicinesById),
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
      const matchesExpiry =
        expiryFilter === 'ALL' ||
        (expiryFilter === 'EXPIRING' && status === STOCK_STATUS.EXPIRING) ||
        (expiryFilter === 'EXPIRED' && status === STOCK_STATUS.EXPIRED)

      return matchesSearch && matchesCategory && matchesStatus && matchesExpiry
    })
  }, [allMedicinesById, appliedSearch, branchesById, categoryId, expiryFilter, rows, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )
  const stats = useMemo(() => {
    const totalQuantity = rows.reduce((sum, row) => sum + getBatchQuantity(row), 0)
    const estimatedValue = rows.reduce((sum, row) => {
      const price = Number(allMedicinesById.get(row.medicineId)?.price || 0)

      return sum + getBatchQuantity(row) * price
    }, 0)

    return {
      totalBatches: rows.length,
      totalQuantity,
      estimatedValue,
      lowOrOut: rows.filter((row) =>
        [STOCK_STATUS.LOW, STOCK_STATUS.OUT].includes(getStockStatus(row)),
      ).length,
      outOfStock: rows.filter((row) => getStockStatus(row) === STOCK_STATUS.OUT).length,
      expiring: rows.filter((row) =>
        [STOCK_STATUS.EXPIRING, STOCK_STATUS.EXPIRED].includes(getStockStatus(row)),
      ).length,
    }
  }, [allMedicinesById, rows])

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
    setExpiryFilter('ALL')
    setPage(1)
  }

  return (
    <DashboardLayout>
      <div className="page-stack inventory-dashboard-page">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              {isStockList ? 'Danh sách tồn kho' : 'Tổng quan tồn kho'}
            </h1>
          </div>
        </header>

        {!isStockList ? <>
        <section className="inventory-stat-grid" aria-label="Tổng quan tồn kho">
          <div className="stat-card">
            <div>
              <p className="stat-title">Tồn thấp</p>
              <p className="stat-value mono">{Math.max(0, stats.lowOrOut - stats.outOfStock)}</p>
            </div>
            <PackageCheck color="var(--accent-700)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Sắp hết hạn</p>
              <p className="stat-value mono">{stats.expiring}</p>
            </div>
            <PackageCheck color="var(--ink-500)" size={22} aria-hidden="true" />
          </div>
          <div className="stat-card">
            <div>
              <p className="stat-title">Hết hàng</p>
              <p className="stat-value mono">{stats.outOfStock}</p>
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

        </> : null}

        <section className="card inventory-filter-card" aria-label="Bộ lọc tồn kho">
          <form
            className={`card-body toolbar inventory-toolbar${isStockList ? ' inventory-toolbar-stock-list' : ''}`}
            onSubmit={handleSearch}
          >
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

            {isStockList ? <label className="field">
              <span className="field-label">Hạn dùng</span>
              <select className="select" value={expiryFilter} onChange={(event) => { setExpiryFilter(event.target.value); setPage(1) }}>
                <option value="ALL">Tất cả</option>
                <option value="EXPIRING">Sắp hết hạn</option>
                <option value="EXPIRED">Quá hạn</option>
              </select>
            </label> : null}

            <button className="btn btn-primary" type="submit">
              <Search size={16} aria-hidden="true" />
              Tìm
            </button>
          </form>
        </section>

        <section className="card" aria-labelledby="inventory-list-title">
          <div className="inventory-table-toolbar">
            <span className="inventory-result-count" id="inventory-list-title">
              Hiển thị {pageRows.length} trên {filteredRows.length} kết quả
            </span>
            {!isStockList ? <div className="table-actions">
              <Link className="btn btn-outline btn-compact" to="/inventory/history">
                <History size={15} aria-hidden="true" />
                Lịch sử giao dịch
              </Link>
              <Link className="btn btn-outline btn-compact" to="/inventory/alerts">
                <Bell size={15} aria-hidden="true" />
                Cảnh báo
              </Link>
              <Link className="btn btn-primary btn-compact" to="/inventory/import">
                <ArrowDownToLine size={15} aria-hidden="true" />
                Nhập kho
              </Link>
            </div> : null}
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
                      <th>Tổng tồn</th>
                      <th>Khả dụng</th>
                      {isStockList ? <th>Đã giữ</th> : null}
                      <th>Tối thiểu</th>
                      <th>Hạn gần nhất</th>
                      <th>Trạng thái</th>
                      <th aria-label="Thao tác" />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={getBatchId(row)}>
                        <td>
                          <strong>{getMedicineName(row, allMedicinesById)}</strong>
                          <div className="card-subtitle mono">{row.batchNo || shortId(row.medicineId)}</div>
                        </td>
                        <td>{getBranchName(row, branchesById)}</td>
                        <td className="mono">{getBatchQuantity(row)}</td>
                        <td className="mono">{getBatchQuantity(row)}</td>
                        {isStockList ? <td className="mono">0</td> : null}
                        <td className="mono">{getMinimumStock(row)}</td>
                        <td className="mono">{formatDate(row.expiryDate)}</td>
                        <td>
                          <StockStatusBadge row={row} />
                        </td>
                        <td>
                          <div className="table-actions inventory-row-actions">
                            <Link
                              className="btn btn-outline btn-compact"
                              to={`/inventory/batches/${getBatchId(row)}`}
                              title="Xem chi tiết tồn kho"
                            >
                              <Eye size={16} aria-hidden="true" />
                              Xem
                            </Link>
                            <Link
                              className="btn btn-outline btn-compact"
                              to={`/inventory/history?batchId=${getBatchId(row)}`}
                              title="Xem lịch sử giao dịch của lô"
                            >
                              <History size={16} aria-hidden="true" />
                              Lịch sử
                            </Link>
                            {!isStockList ? <Link className="btn btn-outline btn-compact" to="/inventory/import">Nhập</Link> : null}
                            <Link className="btn btn-outline btn-compact" to="/inventory/export">Xuất</Link>
                            <Link className="btn btn-outline btn-compact" to="/inventory/transfer">Chuyển</Link>
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
