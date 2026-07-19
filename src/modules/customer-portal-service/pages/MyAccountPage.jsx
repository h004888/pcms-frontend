import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@core/http/apiClient'
import { useAuth } from '../hooks/useAuth'
import {
  createAddress,
  deleteAddress,
  getCustomerProfile,
  listAddresses,
  setDefaultAddress,
  updateAddress,
  updateCustomerProfile,
} from '../api/shopApi'
import { LoyaltyCard } from '../components/LoyaltyCard.jsx'
import { FamilyMemberSection } from '../components/FamilyMemberSection.jsx'
import { NotificationSettingsSection } from '../components/NotificationSettingsSection.jsx'

const phonePattern = /^(0|\+84)[0-9]{9,10}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emptyAddressForm = {
  label: 'HOME',
  receiverName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  street: '',
  isDefault: false,
}
const addressLabels = { HOME: 'Nhà riêng', OFFICE: 'Văn phòng', OTHER: 'Khác' }

export function MyAccountPage() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '', dob: '', gender: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [editingAddress, setEditingAddress] = useState(null)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)
  const [addressErrors, setAddressErrors] = useState({})

  const profileQuery = useQuery({
    queryKey: ['customer-profile'],
    queryFn: getCustomerProfile,
    enabled: isAuthenticated,
  })
  const addressesQuery = useQuery({
    queryKey: ['customer-addresses'],
    queryFn: listAddresses,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    const profile = profileQuery.data
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dob: profile.dob || '',
        gender: profile.gender || '',
      })
    }
  }, [profileQuery.data])

  const profileMutation = useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['customer-profile'], updatedProfile)
      toast.success('Đã cập nhật thông tin tài khoản')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
  const saveAddressMutation = useMutation({
    mutationFn: ({ id, payload }) => (id ? updateAddress(id, payload) : createAddress(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses'] })
      setEditingAddress(null)
      setIsAddressFormOpen(false)
      setAddressForm(emptyAddressForm)
      toast.success('Đã lưu địa chỉ giao hàng')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
  const defaultAddressMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success('Đã đặt địa chỉ mặc định')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success('Đã xóa địa chỉ giao hàng')
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  })

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-[40vh]"><p className="text-[var(--shop-text-secondary)]">Vui lòng đăng nhập để xem thông tin tài khoản.</p></div>
  }

  const validateProfile = () => {
    const errors = {}
    if (!profileForm.name.trim()) errors.name = 'Họ tên không được để trống.'
    else if (profileForm.name.trim().length > 100) errors.name = 'Họ tên tối đa 100 ký tự.'
    if (!phonePattern.test(profileForm.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ.'
    if (profileForm.address.trim().length > 255) errors.address = 'Địa chỉ tối đa 255 ký tự.'
    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submitProfile = (event) => {
    event.preventDefault()
    if (!validateProfile()) return
    profileMutation.mutate({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim() || null,
      dob: profileForm.dob || null,
      gender: profileForm.gender || null,
    })
  }

  const validateAddress = () => {
    const errors = {}
    ;['receiverName', 'province', 'district', 'ward', 'street'].forEach((field) => {
      if (!addressForm[field].trim()) errors[field] = 'Trường này không được để trống.'
    })
    ;['receiverName', 'province', 'district', 'ward'].forEach((field) => {
      if (addressForm[field].trim().length > 100) errors[field] = 'Tối đa 100 ký tự.'
    })
    if (addressForm.street.trim().length > 255) errors.street = 'Tối đa 255 ký tự.'
    if (!phonePattern.test(addressForm.phone.trim())) errors.phone = 'Số điện thoại không hợp lệ.'
    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  const submitAddress = (event) => {
    event.preventDefault()
    if (!validateAddress()) return
    saveAddressMutation.mutate({
      id: editingAddress?.id,
      payload: {
        ...addressForm,
        receiverName: addressForm.receiverName.trim(),
        phone: addressForm.phone.trim(),
        province: addressForm.province.trim(),
        district: addressForm.district.trim(),
        ward: addressForm.ward.trim(),
        street: addressForm.street.trim(),
      },
    })
  }

  const openCreateAddress = () => {
    setEditingAddress(null)
    setIsAddressFormOpen(true)
    setAddressForm(emptyAddressForm)
    setAddressErrors({})
  }
  const openEditAddress = (address) => {
    setEditingAddress(address)
    setIsAddressFormOpen(true)
    setAddressForm({
      label: address.label || 'HOME',
      receiverName: address.receiverName || '',
      phone: address.phone || '',
      province: address.province || '',
      district: address.district || '',
      ward: address.ward || '',
      street: address.street || '',
      isDefault: address.isDefault === true,
    })
    setAddressErrors({})
  }
  const closeAddressForm = () => {
    setEditingAddress(null)
    setIsAddressFormOpen(false)
    setAddressForm(emptyAddressForm)
    setAddressErrors({})
  }

  const renderInput = (label, field, options = {}) => (
    <label className="block">
      <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">{label}</span>
      <input
        {...options}
        value={options.form === 'address' ? addressForm[field] : profileForm[field]}
        onChange={(event) => {
          const value = event.target.value
          if (options.form === 'address') setAddressForm((current) => ({ ...current, [field]: value }))
          else setProfileForm((current) => ({ ...current, [field]: value }))
        }}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--shop-primary)] focus:outline-none"
      />
      {(options.form === 'address' ? addressErrors[field] : profileErrors[field]) && <span className="mt-1 block text-xs text-red-600">{options.form === 'address' ? addressErrors[field] : profileErrors[field]}</span>}
    </label>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-[var(--shop-text)] mb-6">Thông tin tài khoản</h1>
        {profileQuery.data && (
          <LoyaltyCard
            code={profileQuery.data.code}
            points={profileQuery.data.points}
            tier={profileQuery.data.tier}
          />
        )}
        {profileQuery.isLoading && !profileQuery.data ? <p className="text-[var(--shop-text-secondary)]">Đang tải thông tin tài khoản...</p> : null}
        {profileQuery.isError && !profileQuery.data ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{getApiErrorMessage(profileQuery.error)}</p> : null}
        <form onSubmit={submitProfile} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {renderInput('Họ tên', 'name')}
            {renderInput('Số điện thoại', 'phone', { type: 'tel' })}
            <div>
              <label className="block">
                <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">Email</span>
                <input
                  type="email"
                  value={profileQuery.data?.email || ''}
                  readOnly
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--shop-text-secondary)] cursor-not-allowed"
                  title="Email không thể thay đổi vì liên kết với tài khoản đăng nhập"
                />
              </label>
              <p className="mt-1 text-xs text-[var(--shop-text-muted)]">Email liên kết với tài khoản đăng nhập, không thể thay đổi</p>
            </div>
            {renderInput('Địa chỉ', 'address')}
            {renderInput('Ngày sinh', 'dob', { type: 'date' })}
            <label className="block">
              <span className="block text-sm font-medium text-[var(--shop-text)] mb-1">Giới tính</span>
              <select value={profileForm.gender} onChange={(event) => setProfileForm((current) => ({ ...current, gender: event.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--shop-primary)] focus:outline-none">
                <option value="">Chọn giới tính</option><option value="MALE">Nam</option><option value="FEMALE">Nữ</option><option value="OTHER">Khác</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={profileMutation.isPending || !profileQuery.data} style={{ backgroundColor: '#2563EB' }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{profileMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}</button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-4"><h2 className="text-xl font-bold text-[var(--shop-text)]">Địa chỉ giao hàng</h2><button type="button" onClick={openCreateAddress} className="rounded-lg border border-[var(--shop-primary)] px-4 py-2 text-sm font-semibold text-[var(--shop-primary)]">Thêm địa chỉ</button></div>
        {addressesQuery.isLoading ? <p className="text-[var(--shop-text-secondary)]">Đang tải địa chỉ giao hàng...</p> : null}
        {addressesQuery.isError ? <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{getApiErrorMessage(addressesQuery.error)}</p> : null}
        {addressesQuery.data && addressesQuery.data.length === 0 ? <p className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-[var(--shop-text-secondary)]">Chưa có địa chỉ giao hàng.</p> : null}
        <div className="space-y-3">
          {addressesQuery.data?.map((address) => (
            <article key={address.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2"><strong className="text-[var(--shop-text)]">{address.receiverName}</strong><span className="text-sm text-[var(--shop-text-secondary)]">{address.phone}</span><span className="rounded-full bg-[var(--shop-primary-light)] px-2 py-0.5 text-xs text-[var(--shop-primary)]">{addressLabels[address.label] || address.label}</span>{address.isDefault === true ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Mặc định</span> : null}</div>
              <p className="mt-2 text-sm text-[var(--shop-text-secondary)]">{[address.street, address.ward, address.district, address.province].filter(Boolean).join(', ')}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium"><button type="button" onClick={() => openEditAddress(address)} className="text-[var(--shop-primary)]">Sửa</button>{address.isDefault !== true ? <button type="button" disabled={defaultAddressMutation.isPending} onClick={() => defaultAddressMutation.mutate(address.id)} className="text-[var(--shop-primary)] disabled:opacity-60">Đặt làm mặc định</button> : null}<button type="button" disabled={deleteAddressMutation.isPending} onClick={() => { if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) deleteAddressMutation.mutate(address.id) }} className="text-red-600 disabled:opacity-60">Xóa</button></div>
            </article>
          ))}
        </div>
        {isAddressFormOpen ? (
          <form onSubmit={submitAddress} className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[var(--shop-text)]">{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="block text-sm font-medium text-[var(--shop-text)] mb-1">Nhãn</span><select value={addressForm.label} onChange={(event) => setAddressForm((current) => ({ ...current, label: event.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"><option value="HOME">Nhà riêng</option><option value="OFFICE">Văn phòng</option><option value="OTHER">Khác</option></select></label>
              {renderInput('Người nhận', 'receiverName', { form: 'address' })}
              {renderInput('Số điện thoại', 'phone', { form: 'address', type: 'tel' })}
              {renderInput('Tỉnh/Thành phố', 'province', { form: 'address' })}
              {renderInput('Quận/Huyện', 'district', { form: 'address' })}
              {renderInput('Phường/Xã', 'ward', { form: 'address' })}
              {renderInput('Địa chỉ chi tiết', 'street', { form: 'address' })}
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--shop-text)]"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm((current) => ({ ...current, isDefault: event.target.checked }))} />Đặt làm địa chỉ mặc định</label>
            <div className="flex gap-3"><button type="submit" disabled={saveAddressMutation.isPending} style={{ backgroundColor: '#2563EB' }} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saveAddressMutation.isPending ? 'Đang lưu...' : 'Lưu địa chỉ'}</button><button type="button" onClick={closeAddressForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[var(--shop-text)]">Hủy</button></div>
          </form>
        ) : null}
      </section>

      <FamilyMemberSection />
      <NotificationSettingsSection />
    </div>
  )
}
