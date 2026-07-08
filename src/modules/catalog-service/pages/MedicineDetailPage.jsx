import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarClock,
  Edit,
  PackageSearch,
  Pill,
  ReceiptText,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { StatusBadge } from '@shared/ui/StatusBadge.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  deactivateMedicine,
  getMedicine,
  listCategories,
  listSuppliers,
  updateMedicine,
} from '../api/medicineApi.js'
import { MedicineStatusDialog } from '../components/MedicineStatusDialog.jsx'
import {
  formatCurrency,
  formatDateTime,
  getCategoryName,
  getSupplierName,
  prescriptionLabel,
  shortId,
} from '../services/medicineFormatters.js'

function DetailText({ label, value, mono = false }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className={mono ? 'detail-value mono' : 'detail-value'}>
        {value || '--'}
      </span>
    </div>
  )
}

export function MedicineDetailPage() {
  const { medicineId } = useParams()
  const queryClient = useQueryClient()
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const medicineQuery = useQuery({
    queryKey: ['medicines', medicineId],
    queryFn: () => getMedicine(medicineId),
    enabled: Boolean(medicineId),
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
    mutationFn: ({ medicine }) =>
      medicine.status === 'ACTIVE'
        ? deactivateMedicine(medicine.id)
        : updateMedicine(medicine.id, { status: 'ACTIVE' }),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái thuốc.')
      setStatusDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['medicines', medicineId] })
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (medicineQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải chi tiết thuốc...</div>
      </DashboardLayout>
    )
  }

  if (medicineQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(medicineQuery.error)}
        </div>
      </DashboardLayout>
    )
  }

  const medicine = medicineQuery.data
  const categoryName = getCategoryName(medicine, categoriesById)
  const supplierName = getSupplierName(medicine, suppliersById)

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">{medicine.name}</h1>
            <p className="page-description">
              <span className="mono">{medicine.sku}</span>
              {medicine.slug ? ` · ${medicine.slug}` : ''} · {categoryName}
            </p>
          </div>

          <div className="table-actions">
            <Link className="btn btn-outline" to="/medicines">
              <ArrowLeft size={16} aria-hidden="true" />
              Danh sách
            </Link>
            <Link className="btn btn-primary" to={`/medicines/${medicine.id}/edit`}>
              <Edit size={16} aria-hidden="true" />
              Chỉnh sửa
            </Link>
          </div>
        </header>

        {suppliersQuery.isError ? (
          <div className="error-state" role="alert">
            Không tải được nhà cung cấp. Chi tiết thuốc vẫn có thể xem theo dữ liệu hiện có.
          </div>
        ) : null}

        <div className="detail-grid">
          <section className="card" aria-labelledby="medicine-detail-title">
            <div className="card-header">
              <div>
                <h2 className="card-title" id="medicine-detail-title">
                  Thông tin thuốc
                </h2>
                <p className="card-subtitle">
                  Thông tin định danh, giá bán và nội dung sử dụng thuốc.
                </p>
              </div>
              <StatusBadge status={medicine.status} />
            </div>

            <div className="card-body medicine-detail-body">
              <div className="medicine-photo" aria-label="Ảnh thuốc">
                {medicine.imageUrl ? (
                  <img src={medicine.imageUrl} alt={medicine.name} />
                ) : (
                  <Pill size={44} aria-hidden="true" />
                )}
              </div>

              <div className="detail-list">
                <DetailText label="SKU" value={medicine.sku} mono />
                <DetailText label="ID thuốc" value={shortId(medicine.id)} mono />
                <DetailText label="Danh mục" value={categoryName} />
                <DetailText label="Nhà cung cấp" value={supplierName} />
                <DetailText label="Đơn vị tính" value={medicine.unit} />
                <DetailText
                  label="Giá bán"
                  value={formatCurrency(medicine.price)}
                  mono
                />
                <DetailText
                  label="Yêu cầu đơn thuốc"
                  value={prescriptionLabel(medicine.prescriptionRequired)}
                />
                <DetailText label="Slug" value={medicine.slug} mono />
                <DetailText
                  label="Ngày tạo"
                  value={formatDateTime(medicine.createdAt)}
                />
                <DetailText
                  label="Cập nhật gần nhất"
                  value={formatDateTime(medicine.updatedAt)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                className={
                  medicine.status === 'ACTIVE'
                    ? 'btn btn-danger'
                    : 'btn btn-primary'
                }
                type="button"
                onClick={() => setStatusDialogOpen(true)}
              >
                {medicine.status === 'ACTIVE' ? (
                  <ToggleRight size={16} aria-hidden="true" />
                ) : (
                  <ToggleLeft size={16} aria-hidden="true" />
                )}
                {medicine.status === 'ACTIVE' ? 'Ngừng hoạt động' : 'Kích hoạt'}
              </button>
            </div>
          </section>

          <aside className="stat-grid" aria-label="Tổng quan thuốc">
            <div className="stat-card">
              <div>
                <p className="stat-title">Giá bán</p>
                <p className="stat-value mono">{formatCurrency(medicine.price)}</p>
              </div>
              <ReceiptText color="var(--accent-700)" size={22} aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Kê đơn</p>
                <p className="stat-value" style={{ fontSize: 18 }}>
                  {medicine.prescriptionRequired ? 'Cần đơn' : 'Không cần đơn'}
                </p>
              </div>
              <Pill color="var(--ink-500)" size={22} aria-hidden="true" />
            </div>
            <div className="stat-card">
              <div>
                <p className="stat-title">Ngày tạo</p>
                <p className="stat-value" style={{ fontSize: 18 }}>
                  {formatDateTime(medicine.createdAt).split(' ')[0]}
                </p>
              </div>
              <CalendarClock
                color="var(--ink-500)"
                size={22}
                aria-hidden="true"
              />
            </div>
          </aside>
        </div>

        <section className="card" aria-labelledby="medicine-content-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="medicine-content-title">
                Nội dung bán thuốc
              </h2>
              <p className="card-subtitle">
                Mô tả, cách dùng và thành phần dùng cho tra cứu tại quầy.
              </p>
            </div>
          </div>

          <div className="card-body detail-list">
            <DetailText label="Mô tả" value={medicine.description} />
            <DetailText label="Cách dùng" value={medicine.usage} />
            <DetailText label="Thành phần" value={medicine.ingredients} />
          </div>
        </section>

        <section className="card" aria-labelledby="medicine-inventory-title">
          <div className="card-header">
            <div>
              <h2 className="card-title" id="medicine-inventory-title">
                Tồn kho
              </h2>
              <p className="card-subtitle">
                Theo dõi tồn kho theo chi nhánh, số lô và hạn dùng.
              </p>
            </div>
            <span className="badge badge-muted">Theo lô</span>
          </div>

          <div className="empty-state">
            <PackageSearch size={28} aria-hidden="true" />
            <span>Thông tin tồn kho sẽ hiển thị khi có dữ liệu lô thuốc.</span>
          </div>
        </section>
      </div>

      <MedicineStatusDialog
        medicine={statusDialogOpen ? medicine : null}
        isPending={statusMutation.isPending}
        onClose={() => setStatusDialogOpen(false)}
        onConfirm={(payload) => statusMutation.mutate(payload)}
      />
    </DashboardLayout>
  )
}
