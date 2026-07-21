import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  createBranch,
  getBranch,
  getBranchImageUrl,
  getUser,
  updateBranch,
} from '../api/branchApi.js'

const EMPTY_FORM = {
  code: '',
  name: '',
  address: '',
  phone: '',
  status: 'ACTIVE',
}

function createBranchCode() {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, '0')

  return `BR${suffix}`
}

export function BranchFormPage({ mode }) {
  const isEdit = mode === 'edit'
  const { branchId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    code: isEdit ? '' : createBranchCode(),
  }))
  const [errors, setErrors] = useState({})
  const [selectedImageName, setSelectedImageName] = useState('')
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const branchQuery = useQuery({
    queryKey: ['branches', branchId],
    queryFn: () => getBranch(branchId),
    enabled: isEdit && Boolean(branchId),
  })
  const managerQuery = useQuery({
    queryKey: ['users', branchQuery.data?.managerId],
    queryFn: () => getUser(branchQuery.data.managerId),
    enabled: isEdit && Boolean(branchQuery.data?.managerId),
  })

  useEffect(() => {
    if (branchQuery.data) {
      setForm({
        code: branchQuery.data.code || '',
        name: branchQuery.data.name || '',
        address: branchQuery.data.address || '',
        phone: branchQuery.data.phone || '',
        status: branchQuery.data.status || 'ACTIVE',
      })
      setImagePreviewUrl(getBranchImageUrl(branchQuery.data))
      setSelectedImageFile(null)
      setSelectedImageName('')
    }
  }, [branchQuery.data])

  useEffect(() => () => {
    if (imagePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl)
  }, [imagePreviewUrl])

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        return updateBranch(branchId, {
          name: payload.name,
          address: payload.address,
          phone: payload.phone,
          status: payload.status,
        }, selectedImageFile)
      }

      const created = await createBranch({
        code: payload.code,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
      }, selectedImageFile)

      if (payload.status === 'INACTIVE') {
        return updateBranch(created.id, { status: 'INACTIVE' })
      }

      return created
    },
    onSuccess: (branch) => {
      toast.success(
        isEdit ? 'Đã cập nhật chi nhánh.' : 'Đã tạo chi nhánh mới.',
      )
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      navigate(`/branches/${branch.id}`)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate() {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Tên chi nhánh là bắt buộc.'
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Địa chỉ là bắt buộc.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Số điện thoại là bắt buộc.'
    }

    if (form.phone.trim() && !/^[0-9+()\-\s.]{8,20}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Số điện thoại không đúng định dạng.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    saveMutation.mutate({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      status: form.status,
    })
  }

  function handleImageSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Vui lòng chọn một tệp ảnh hợp lệ.' }))
      return
    }
    setSelectedImageFile(file)
    setSelectedImageName(file.name)
    setImagePreviewUrl(URL.createObjectURL(file))
    setErrors((current) => ({ ...current, image: undefined }))
  }

  if (branchQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin chi nhánh...</div>
      </DashboardLayout>
    )
  }

  if (branchQuery.isError) {
    return (
      <DashboardLayout>
        <div className="error-state" role="alert">
          {getApiErrorMessage(branchQuery.error)}
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
              {isEdit ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh'}
            </h1>
          </div>

          <Link className="btn btn-outline" to="/branches">
            <ArrowLeft size={16} aria-hidden="true" />
            Quay lại
          </Link>
        </header>

        <form className="card" onSubmit={handleSubmit}>
          <div className="card-body form-grid">
            <label className="field form-grid-full">
              <span className="field-label">Tên chi nhánh *</span>
              <input
                className="input"
                value={form.name}
                maxLength={100}
                placeholder="Nhập tên chi nhánh"
                onChange={(event) => setField('name', event.target.value)}
              />
              {errors.name ? (
                <span className="field-error">{errors.name}</span>
              ) : null}
            </label>

            <label className="field form-grid-full">
              <span className="field-label">Địa chỉ *</span>
              <textarea
                className="textarea"
                value={form.address}
                maxLength={255}
                placeholder="Nhập địa chỉ chi nhánh"
                onChange={(event) => setField('address', event.target.value)}
              />
              {errors.address ? (
                <span className="field-error">{errors.address}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Số điện thoại</span>
              <input
                className="input mono"
                value={form.phone}
                maxLength={20}
                placeholder="Nhập số điện thoại"
                onChange={(event) => setField('phone', event.target.value)}
              />
              {errors.phone ? (
                <span className="field-error">{errors.phone}</span>
              ) : null}
            </label>

            {isEdit ? (
              <div className="field">
                <span className="field-label">Quản lý hiện tại</span>
                <input
                  className="input"
                  value={
                    managerQuery.data?.fullName ||
                    branchQuery.data?.managerName ||
                    branchQuery.data?.manager?.fullName ||
                    'Chưa gán'
                  }
                  disabled
                />
              </div>
            ) : null}

            <div className="field">
              <span className="field-label">Hình ảnh chi nhánh</span>
              <label className="branch-image-picker" htmlFor="branch-image">
                <input
                  id="branch-image"
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                <span className="btn btn-outline branch-image-button">
                  {isEdit ? 'Thay đổi ảnh' : 'Chọn tệp'}
                </span>
                {imagePreviewUrl ? <img src={imagePreviewUrl} alt="Xem trước ảnh chi nhánh" className="branch-image-preview" /> : null}
                {(!isEdit || selectedImageName) ? (
                  <span className="branch-image-file-name">
                    {selectedImageName || 'Chưa chọn tệp'}
                  </span>
                ) : null}
              </label>
              {errors.image ? <span className="field-error">{errors.image}</span> : null}
            </div>

            <fieldset className="field form-grid-full branch-status-field">
              <legend className="field-label">Trạng thái</legend>
              <label className="branch-status-option">
                <input
                  type="radio"
                  name="branch-status"
                  value="ACTIVE"
                  checked={form.status === 'ACTIVE'}
                  onChange={(event) => setField('status', event.target.value)}
                />
                <span>Đang hoạt động</span>
              </label>
              <label className="branch-status-option">
                <input
                  type="radio"
                  name="branch-status"
                  value="INACTIVE"
                  checked={form.status === 'INACTIVE'}
                  onChange={(event) => setField('status', event.target.value)}
                />
                <span>Ngưng hoạt động</span>
              </label>
            </fieldset>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-outline"
              type="submit"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? 'Đang lưu...'
                : isEdit
                  ? 'Cập nhật'
                  : 'Lưu'}
            </button>
            <Link className="btn btn-outline" to="/branches">
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
