import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import {
  createBranch,
  getBranch,
  updateBranch,
} from '../api/branchApi.js'
import { shortId } from '../services/branchFormatters.js'

const EMPTY_FORM = {
  code: '',
  name: '',
  address: '',
  phone: '',
  status: 'ACTIVE',
}

export function BranchFormPage({ mode }) {
  const isEdit = mode === 'edit'
  const { branchId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const branchQuery = useQuery({
    queryKey: ['branches', branchId],
    queryFn: () => getBranch(branchId),
    enabled: isEdit && Boolean(branchId),
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
    }
  }, [branchQuery.data])

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (isEdit) {
        return updateBranch(branchId, {
          name: payload.name,
          address: payload.address,
          phone: payload.phone,
          status: payload.status,
        })
      }

      const created = await createBranch({
        code: payload.code,
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
      })

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

    if (!isEdit && !form.code.trim()) {
      nextErrors.code = 'Mã chi nhánh là bắt buộc.'
    }

    if (form.code.trim().length > 10) {
      nextErrors.code = 'Mã chi nhánh tối đa 10 ký tự.'
    }

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
            <p className="page-description">
              {isEdit
                ? 'Cập nhật thông tin vận hành và trạng thái chi nhánh.'
                : 'Tạo chi nhánh mới với đầy đủ thông tin vận hành cần thiết.'}
            </p>
          </div>

          <Link className="btn btn-outline" to="/branches">
            <ArrowLeft size={16} aria-hidden="true" />
            Quay lại
          </Link>
        </header>

        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Thông tin chi nhánh</h2>
              <p className="card-subtitle">
                {isEdit
                  ? `ID: ${shortId(branchId)}`
                  : 'Mã chi nhánh phải là duy nhất trong hệ thống.'}
              </p>
            </div>
          </div>

          <div className="card-body form-grid">
            <label className="field">
              <span className="field-label">Mã chi nhánh</span>
              <input
                className="input mono"
                value={form.code}
                maxLength={10}
                disabled={isEdit}
                placeholder="CN001"
                onChange={(event) => setField('code', event.target.value)}
              />
              {errors.code ? (
                <span className="field-error">{errors.code}</span>
              ) : null}
            </label>

            <label className="field">
              <span className="field-label">Trạng thái</span>
              <select
                className="select"
                value={form.status}
                onChange={(event) => setField('status', event.target.value)}
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
              </select>
            </label>

            <label className="field form-grid-full">
              <span className="field-label">Tên chi nhánh</span>
              <input
                className="input"
                value={form.name}
                maxLength={100}
                placeholder="Nhà thuốc PCMS Quận 1"
                onChange={(event) => setField('name', event.target.value)}
              />
              {errors.name ? (
                <span className="field-error">{errors.name}</span>
              ) : null}
            </label>

            <label className="field form-grid-full">
              <span className="field-label">Địa chỉ</span>
              <textarea
                className="textarea"
                value={form.address}
                maxLength={255}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
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
                placeholder="0901234567"
                onChange={(event) => setField('phone', event.target.value)}
              />
              {errors.phone ? (
                <span className="field-error">{errors.phone}</span>
              ) : null}
            </label>

            {isEdit ? (
              <div className="field">
                <span className="field-label">Quản lý hiện tại</span>
                <span className="detail-value">
                  {branchQuery.data?.managerId
                    ? shortId(branchQuery.data.managerId)
                    : 'Chưa gán'}
                </span>
              </div>
            ) : null}
          </div>

          <div className="form-actions">
            <Link className="btn btn-outline" to="/branches">
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
                  : 'Lưu chi nhánh'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
