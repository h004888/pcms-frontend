import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ImagePlus, Save } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  createMedicine,
  getMedicine,
  listCategories,
  listSuppliers,
  updateMedicine,
} from '../api/medicineApi.js'
import { shortId } from '../services/medicineFormatters.js'

const EMPTY_FORM = {
  sku: '',
  name: '',
  categoryId: '',
  supplierId: '',
  price: '',
  unit: '',
  prescriptionRequired: 'false',
  imageUrl: '',
  description: '',
  usage: '',
  ingredients: '',
  status: 'ACTIVE',
  stockQuantity: '',
  expiryDate: '',
}

function optionalText(value) {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function parseMedicinePrice(value) {
  const raw = String(value ?? '')
    .trim()
    .replace(/[^\d.,-]/g, '')

  if (!raw) {
    return null
  }

  if (raw.includes('-')) {
    return Number.NaN
  }

  const hasDot = raw.includes('.')
  const hasComma = raw.includes(',')
  let normalized = raw

  if (hasDot && hasComma) {
    const lastDot = raw.lastIndexOf('.')
    const lastComma = raw.lastIndexOf(',')
    const decimalSeparator = lastDot > lastComma ? '.' : ','
    const thousandSeparator = decimalSeparator === '.' ? ',' : '.'

    normalized = raw
      .replaceAll(thousandSeparator, '')
      .replace(decimalSeparator, '.')
  } else if (hasDot || hasComma) {
    const separator = hasDot ? '.' : ','
    const parts = raw.split(separator)
    const looksLikeThousands =
      parts.length > 1 &&
      parts.slice(1).every((part) => part.length === 3)

    normalized = looksLikeThousands
      ? parts.join('')
      : raw.replace(separator, '.')
  }

  return Number(normalized)
}

function formatPriceInput(value) {
  const price = parseMedicinePrice(value)

  if (!Number.isFinite(price) || price <= 0) {
    return value
  }

  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(price)
}

function buildPayload(form, includeSku = false) {
  const payload = {
    name: form.name.trim(),
    categoryId: form.categoryId,
    supplierId: form.supplierId || undefined,
    price: parseMedicinePrice(form.price),
    unit: form.unit.trim(),
    prescriptionRequired: form.prescriptionRequired === 'true',
    imageUrl: optionalText(form.imageUrl),
    description: optionalText(form.description),
    usage: optionalText(form.usage),
    ingredients: optionalText(form.ingredients),
  }

  if (includeSku && form.sku.trim()) {
    payload.sku = form.sku.trim().toUpperCase()
  }

  return payload
}

export function MedicineFormPage({ mode }) {
  const isEdit = mode === 'edit'
  const { medicineId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const medicineQuery = useQuery({
    queryKey: ['medicines', medicineId],
    queryFn: () => getMedicine(medicineId),
    enabled: isEdit && Boolean(medicineId),
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

  useEffect(() => {
    if (medicineQuery.data) {
      setForm({
        sku: medicineQuery.data.sku || '',
        name: medicineQuery.data.name || '',
        categoryId: medicineQuery.data.categoryId || '',
        supplierId: medicineQuery.data.supplierId || '',
        price: medicineQuery.data.price
          ? formatPriceInput(medicineQuery.data.price)
          : '',
        unit: medicineQuery.data.unit || '',
        prescriptionRequired: String(Boolean(medicineQuery.data.prescriptionRequired)),
        imageUrl: medicineQuery.data.imageUrl || '',
        description: medicineQuery.data.description || '',
        usage: medicineQuery.data.usage || '',
        ingredients: medicineQuery.data.ingredients || '',
        status: medicineQuery.data.status || 'ACTIVE',
        stockQuantity: '',
        expiryDate: '',
      })
    }
  }, [medicineQuery.data])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        return updateMedicine(medicineId, {
          ...buildPayload(form),
          status: form.status,
        })
      }

      const created = await createMedicine(buildPayload(form, true))

      if (form.status === 'INACTIVE') {
        return updateMedicine(created.id, { status: 'INACTIVE' })
      }

      return created
    },
    onSuccess: (medicine) => {
      toast.success(
        isEdit ? 'Đã cập nhật thuốc.' : 'Đã tạo thuốc mới.',
      )
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      navigate(`/medicines/${medicine.id}`)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate() {
    const nextErrors = {}
    const price = parseMedicinePrice(form.price)

    if (form.sku.trim().length > 20) {
      nextErrors.sku = 'SKU tối đa 20 ký tự.'
    }

    if (!form.name.trim()) {
      nextErrors.name = 'Tên thuốc là bắt buộc.'
    }

    if (form.name.trim().length > 200) {
      nextErrors.name = 'Tên thuốc tối đa 200 ký tự.'
    }

    if (!form.categoryId) {
      nextErrors.categoryId = 'Vui lòng chọn danh mục.'
    }

    if (price === null) {
      nextErrors.price = 'Giá bán là bắt buộc.'
    } else if (!Number.isFinite(price) || price < 0.01) {
      nextErrors.price = 'Giá bán phải lớn hơn 0.'
    }

    if (!form.unit.trim()) {
      nextErrors.unit = 'Đơn vị tính là bắt buộc.'
    }

    if (form.unit.trim().length > 20) {
      nextErrors.unit = 'Đơn vị tính tối đa 20 ký tự.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    saveMutation.mutate()
  }

  if (medicineQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin thuốc...</div>
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

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              {isEdit ? 'Chỉnh sửa thuốc' : 'Thêm thuốc'}
            </h1>
            <p className="page-description">
              {isEdit
                ? 'Cập nhật thông tin thuốc. SKU được khóa để giữ ổn định mã định danh.'
                : 'Tạo thuốc mới với thông tin bán hàng, danh mục và nhà cung cấp.'}
            </p>
          </div>

          <Link className="btn btn-outline" to="/medicines">
            <ArrowLeft size={16} aria-hidden="true" />
            Quay lại
          </Link>
        </header>

        {categoriesQuery.isError ? (
          <div className="error-state" role="alert">
            Không tải được danh mục. Vui lòng tải lại trước khi lưu thuốc.
          </div>
        ) : null}

        {suppliersQuery.isError ? (
          <div className="error-state" role="alert">
            Không tải được nhà cung cấp. Có thể tiếp tục lưu thuốc không chọn nhà cung cấp,
            hoặc thử tải lại sau.
          </div>
        ) : null}

        <form className="card medicine-form-card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Thông tin thuốc</h2>
              <p className="card-subtitle">
                {isEdit
                  ? `ID: ${shortId(medicineId)}`
                  : 'Những thông tin bắt buộc cần được nhập đầy đủ.'}
              </p>
            </div>
          </div>

          <div className="card-body form-grid">
            <label className="field medicine-hidden-field">
              <span className="field-label">SKU</span>
              <input
                className="input mono"
                value={form.sku}
                maxLength={20}
                disabled={isEdit}
                placeholder="MED-0001"
                onChange={(event) => setField('sku', event.target.value)}
              />
              <p className="field-hint">
                Bỏ trống khi tạo mới nếu muốn hệ thống tự sinh SKU.
              </p>
              {errors.sku ? <span className="field-error">{errors.sku}</span> : null}
            </label>

            <label className="field medicine-hidden-field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={form.status}
                onChange={(event) => setField('status', event.target.value)}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </label>

            <label className="field form-grid-full">
              <span className="field-label">Tên thuốc *</span>
              <input
                className="input"
                value={form.name}
                maxLength={200}
                placeholder="Paracetamol 500mg"
                onChange={(event) => setField('name', event.target.value)}
              />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </label>

            <label className="field">
              <span className="field-label">Danh mục *</span>
              <select
                className="select"
                value={form.categoryId}
                onChange={(event) => setField('categoryId', event.target.value)}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? (
                <span className="field-error">{errors.categoryId}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Nhà cung cấp</span>
              <select
                className="select"
                value={form.supplierId}
                onChange={(event) => setField('supplierId', event.target.value)}
              >
                <option value="">Chưa chọn</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">Giá (VND) *</span>
              <input
                className="input mono"
                inputMode="decimal"
                value={form.price}
                placeholder="25000"
                onChange={(event) => setField('price', event.target.value)}
                onBlur={() => setField('price', formatPriceInput(form.price))}
              />
              <p className="field-hint">
                Nhập 25000 hoặc 25.000 đều hợp lệ.
              </p>
              {errors.price ? (
                <span className="field-error">{errors.price}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Đơn vị</span>
              <input
                className="input"
                value={form.unit}
                maxLength={20}
                placeholder="viên, hộp, chai"
                onChange={(event) => setField('unit', event.target.value)}
              />
              {errors.unit ? <span className="field-error">{errors.unit}</span> : null}
            </label>

            <label className="field medicine-hidden-field">
              <span className="field-label">Yêu cầu đơn thuốc</span>
              <select
                className="select"
                value={form.prescriptionRequired}
                onChange={(event) =>
                  setField('prescriptionRequired', event.target.value)
                }
              >
                <option value="false">Không cần đơn</option>
                <option value="true">Cần đơn thuốc</option>
              </select>
            </label>

            <label className="field">
              <span className="field-label">Số lượng tồn *</span>
              <input className="input mono" inputMode="numeric" value={form.stockQuantity} placeholder="Nhập số lượng tồn" onChange={(event) => setField('stockQuantity', event.target.value)} />
            </label>

            <label className="field">
              <span className="field-label">Ngày hết hạn</span>
              <input className="input mono" type="date" value={form.expiryDate} onChange={(event) => setField('expiryDate', event.target.value)} />
            </label>

            <label className="field form-grid-full medicine-image-upload">
              <span className="field-label">Ảnh thuốc</span>
              <span className="medicine-upload-box"><ImagePlus size={28} aria-hidden="true" />Nhấn để tải ảnh lên<br />hoặc kéo thả ảnh<input type="file" accept="image/*" aria-label="Tải ảnh thuốc" /></span>
            </label>

            <label className="field form-grid-full medicine-hidden-field">
              <span className="field-label">Mô tả</span>
              <textarea
                className="textarea"
                value={form.description}
                placeholder="Thông tin tổng quan về thuốc"
                onChange={(event) => setField('description', event.target.value)}
              />
            </label>

            <label className="field form-grid-full medicine-hidden-field">
              <span className="field-label">Cách dùng</span>
              <textarea
                className="textarea"
                value={form.usage}
                placeholder="Liều dùng, thời điểm sử dụng, lưu ý khi bán"
                onChange={(event) => setField('usage', event.target.value)}
              />
            </label>

            <label className="field form-grid-full medicine-hidden-field">
              <span className="field-label">Thành phần</span>
              <textarea
                className="textarea"
                value={form.ingredients}
                placeholder="Hoạt chất và tá dược chính"
                onChange={(event) => setField('ingredients', event.target.value)}
              />
            </label>
          </div>

          <div className="medicine-status-radios">
            <span className="field-label">Trạng thái *</span>
            <label><input type="radio" name="medicine-status" value="ACTIVE" checked={form.status === 'ACTIVE'} onChange={(event) => setField('status', event.target.value)} /> Đang hoạt động</label>
            <label><input type="radio" name="medicine-status" value="INACTIVE" checked={form.status === 'INACTIVE'} onChange={(event) => setField('status', event.target.value)} /> Ngừng hoạt động</label>
          </div>

          <div className="form-actions">
            <Link className="btn btn-outline" to="/medicines">
              Hủy
            </Link>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saveMutation.isPending}
            >
              <Save size={16} aria-hidden="true" />
              {saveMutation.isPending
                ? 'Đang lưu...'
                : isEdit
                  ? 'Cập nhật'
                  : 'Lưu thuốc'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
