import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react'
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
    password: '',
    role: 'PHARMACIST',
    branchId: '',
    status: 'ACTIVE',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

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

    if (mode === 'create') {
      if (!formData.password.trim()) {
        newErrors.password = 'Mật khẩu không được để trống'
      } else if (formData.password.length < 6 || formData.password.length > 100) {
        newErrors.password = 'Mật khẩu phải từ 6 đến 100 ký tự'
      }
    } else {
      if (formData.password && (formData.password.length < 6 || formData.password.length > 100)) {
        newErrors.password = 'Mật khẩu phải từ 6 đến 100 ký tự'
      }
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
      payload.password = formData.password
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
        <form className="card" onSubmit={handleSubmit} noValidate style={{ width: '100%', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--ink-200)', borderRadius: '8px', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid var(--ink-200)', textAlign: 'center', background: 'var(--surface)' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--ink-900)' }}>
              {mode === 'create' ? 'Tạo người dùng' : 'Sửa người dùng'}
            </h2>
          </div>

          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <label className="field-label" style={{ margin: 0 }}>Họ và tên</label>
              <div>
                <input
                  name="fullName"
                  className="input"
                  type="text"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="field-error" style={{ marginTop: '6px' }}>{errors.fullName}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <label className="field-label" style={{ margin: 0 }}>Email</label>
              <div>
                <input
                  name="email"
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  readOnly={mode === 'edit'}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="field-error" style={{ marginTop: '6px' }}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <label className="field-label" style={{ margin: 0 }}>Số điện thoại</label>
              <div>
                <input
                  name="phone"
                  className="input"
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="field-error" style={{ marginTop: '6px' }}>{errors.phone}</p>}
              </div>
            </div>

            {mode === 'create' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
                <label className="field-label" style={{ margin: 0 }}>
                  Mật khẩu <span style={{ color: 'var(--danger-600)' }}>*</span>
                </label>
                <div>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="password"
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ít nhất 6 ký tự"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      style={{ paddingRight: '44px' }}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      style={{ position: 'absolute', right: 0, top: 0, height: '100%', border: 'none', minHeight: 'auto' }}
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && <p className="field-error" style={{ marginTop: '6px' }}>{errors.password}</p>}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
                <label className="field-label" style={{ margin: 0 }}>Mật khẩu</label>
                <input
                  className="input"
                  type="password"
                  value="********"
                  disabled
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <label className="field-label" style={{ margin: 0 }}>Vai trò</label>
              <div>
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
                {errors.role && <p className="field-error" style={{ marginTop: '6px' }}>{errors.role}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
              <label className="field-label" style={{ margin: 0 }}>Chi nhánh</label>
              <div>
                <select
                  name="branchId"
                  className="select"
                  value={formData.branchId || ''}
                  onChange={handleChange}
                >
                  <option value="">-- Toàn hệ thống --</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {mode === 'edit' && (
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: '16px' }}>
                <label className="field-label" style={{ margin: 0 }}>Trạng thái</label>
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
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
              <button className="btn btn-primary" type="submit" disabled={isPending} style={{ width: '140px' }}>
                {isPending ? 'Đang lưu...' : 'Lưu người dùng'}
              </button>
              <Link className="btn btn-outline" to={mode === 'edit' ? `/users/${userId}` : '/users'} style={{ width: '140px' }}>
                Hủy
              </Link>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
