import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DashboardLayout } from '@shared/layouts/DashboardLayout.jsx'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { listBranches } from '../../branch-service/api/branchApi.js'
import { createUser, getUser, updateUser } from '../api/userApi.js'
import { ROLE_OPTIONS, STATUS_OPTIONS } from '../services/userFormatters.js'

export function UserFormPage({ mode = 'create' }) {
  const { userId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    role: 'PHARMACIST',
    branchId: '',
    status: 'ACTIVE',
  })
  const [errors, setErrors] = useState({})

  // Queries
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: () => listBranches({ page: 0, size: 500 }),
  })
  const branches = useMemo(() => branchesQuery.data?.data || [], [branchesQuery.data?.data])

  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: mode === 'edit' && !!userId,
  })

  useEffect(() => {
    if (mode === 'edit' && userQuery.data) {
      const u = userQuery.data
      setFormData({
        email: u.email || '',
        fullName: u.fullName || '',
        phone: u.phone || '',
        role: u.role || 'PHARMACIST',
        branchId: u.branchId || '',
        status: u.status || 'ACTIVE',
      })
    }
  }, [mode, userQuery.data])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: (data) => {
      toast.success('Thêm người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate(`/users/${data.id}`)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      navigate(`/users/${userId}`)
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  function validate() {
    const newErrors = {}

    if (mode === 'create') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email không được để trống'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ'
      }
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Họ tên không được vượt quá 100 ký tự'
    }

    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = 'Số điện thoại không được vượt quá 20 ký tự'
    }

    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin.')
      return
    }

    const payload = {
      fullName: formData.fullName,
      phone: formData.phone || null,
      role: formData.role,
      branchId: formData.branchId || null,
    }

    if (mode === 'create') {
      payload.email = formData.email
      createMutation.mutate(payload)
    } else {
      payload.status = formData.status
      updateMutation.mutate(payload)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (mode === 'edit' && userQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="empty-state">Đang tải thông tin người dùng...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-stack">
        <header className="page-header">
          <div>
            <p className="page-kicker">
              <Link to="/users" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Danh sách người dùng
              </Link>
            </p>
            <h1 className="page-title">
              {mode === 'create' ? 'Thêm người dùng mới' : 'Chỉnh sửa thông tin'}
            </h1>
          </div>
        </header>

        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="card-header">
            <h2 className="card-title">Thông tin cơ bản</h2>
          </div>

          <div className="card-body form-grid">
            {mode === 'create' && (
              <label className="field form-grid-full">
                <span className="field-label">Email đăng nhập <span style={{ color: 'var(--danger-700)' }}>*</span></span>
                <input
                  name="email"
                  className="input"
                  type="email"
                  placeholder="user@pcms.vn"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                />
                <p className="field-hint">Email sẽ được dùng để đăng nhập. Hệ thống sẽ tự động tạo một mật khẩu tạm thời cho người dùng mới.</p>
                {errors.email && <p className="field-error">{errors.email}</p>}
              </label>
            )}

            {mode === 'edit' && (
              <label className="field form-grid-full">
                <span className="field-label">Email đăng nhập</span>
                <input
                  className="input"
                  type="email"
                  value={formData.email}
                  disabled
                  readOnly
                />
                <p className="field-hint">Không thể thay đổi email sau khi tạo.</p>
              </label>
            )}

            <label className="field">
              <span className="field-label">Họ và tên <span style={{ color: 'var(--danger-700)' }}>*</span></span>
              <input
                name="fullName"
                className="input"
                type="text"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="field-error">{errors.fullName}</p>}
            </label>

            <label className="field">
              <span className="field-label">Số điện thoại</span>
              <input
                name="phone"
                className="input"
                type="tel"
                placeholder="0912345678"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </label>
            
            <label className="field">
              <span className="field-label">Vai trò <span style={{ color: 'var(--danger-700)' }}>*</span></span>
              <select
                name="role"
                className="select"
                value={formData.role}
                onChange={handleChange}
              >
                {ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.role && <p className="field-error">{errors.role}</p>}
            </label>

            <label className="field">
              <span className="field-label">Gắn chi nhánh</span>
              <select
                name="branchId"
                className="select"
                value={formData.branchId}
                onChange={handleChange}
              >
                <option value="">-- Toàn hệ thống (Admin/CEO) --</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
                  </option>
                ))}
              </select>
              <p className="field-hint">Bắt buộc cho Dược sĩ và Quản lý chi nhánh.</p>
            </label>

            {mode === 'edit' && (
              <label className="field form-grid-full">
                <span className="field-label">Trạng thái hoạt động <span style={{ color: 'var(--danger-700)' }}>*</span></span>
                <select
                  name="status"
                  className="select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="form-actions">
            <Link className="btn btn-outline" to={mode === 'edit' ? `/users/${userId}` : '/users'}>
              Hủy
            </Link>
            <button className="btn btn-primary" type="submit" disabled={isPending}>
              <Save size={16} aria-hidden="true" />
              {isPending ? 'Đang lưu...' : (mode === 'create' ? 'Tạo người dùng' : 'Lưu thay đổi')}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
