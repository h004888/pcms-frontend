import { useState } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient.js'
import { createCustomer } from '../api/customerApi.js'

const EMPTY_FORM = { name: '', phone: '', address: '' }

export function CreateCustomerModal({ open, onClose }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const createMutation = useMutation({
    mutationFn: () => createCustomer({ name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() || undefined }),
    onSuccess: () => {
      toast.success('Đã thêm khách hàng mới.')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      handleClose()
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (!open) return null

  function handleClose() {
    setForm(EMPTY_FORM)
    setErrors({})
    onClose()
  }

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Vui lòng nhập họ và tên.'
    if (!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại.'
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    createMutation.mutate()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-customer-title"
      >
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <div>
              <h2 className="modal-title" id="create-customer-title">
                Thêm khách hàng mới
              </h2>
              <p className="card-subtitle">Điền thông tin để tạo hồ sơ khách hàng.</p>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              type="button"
              aria-label="Đóng"
              onClick={handleClose}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="modal-body">
            <label className="field">
              <span className="field-label">Họ và tên <span aria-hidden="true">*</span></span>
              <input
                className="input"
                maxLength={100}
                placeholder="VD: Nguyễn Văn An"
                value={form.name}
                onChange={handleChange('name')}
              />
              {errors.name ? <span className="field-error">{errors.name}</span> : null}
            </label>

            <label className="field">
              <span className="field-label">Số điện thoại <span aria-hidden="true">*</span></span>
              <input
                className="input"
                maxLength={20}
                placeholder="VD: 09xxxxxxxx"
                value={form.phone}
                onChange={handleChange('phone')}
              />
              {errors.phone ? <span className="field-error">{errors.phone}</span> : null}
            </label>

            <label className="field">
              <span className="field-label">Địa chỉ</span>
              <input
                className="input"
                maxLength={255}
                placeholder="Quận, Thành phố..."
                value={form.address}
                onChange={handleChange('address')}
              />
            </label>
          </div>

          <footer className="modal-footer">
            <button className="btn btn-outline" type="button" onClick={handleClose}>
              Hủy
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Đang lưu...' : 'Lưu khách hàng'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}
