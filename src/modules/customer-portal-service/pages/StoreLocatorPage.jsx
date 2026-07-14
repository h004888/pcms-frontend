import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCcw, MapPin } from 'lucide-react'
import { getStores } from '../api/shopApi'
import { StoreCard } from '../components/StoreCard'

const PROVINCE_LIST = ['', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'An Giang', 'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng']

export function StoreLocatorPage() {
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['stores', province, district],
    queryFn: () => getStores({ province: province || undefined, district: district || undefined }),
  })

  const branches = data?.branches || []

  return (
    <div className="store-page">
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-800)', marginBottom: 20 }}>
        <MapPin size={20} style={{ display: 'inline', marginRight: 8 }} />
        Tìm nhà thuốc
      </h1>

      <div className="store-filters">
        <label className="field">
          <span className="field-label">Tỉnh/Thành</span>
          <select className="select" value={province} onChange={e => setProvince(e.target.value)}>
            <option value="">Tất cả</option>
            {PROVINCE_LIST.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Quận/Huyện</span>
          <input
            className="input"
            value={district}
            onChange={e => setDistrict(e.target.value)}
            placeholder="Nhập quận/huyện..."
          />
        </label>
      </div>

      {isLoading && (
        <div>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, marginBottom: 12 }} />)}
        </div>
      )}

      {isError && (
        <div className="error-state" role="alert">
          <p>Không thể tải danh sách nhà thuốc: {error?.message || 'Lỗi kết nối'}</p>
          <button className="btn btn-primary" onClick={() => refetch()} style={{ marginTop: 12 }}>
            <RefreshCcw size={16} aria-hidden="true" />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && branches.length === 0 && (
        <div className="empty-state">
          <MapPin size={32} style={{ color: 'var(--ink-300)', marginBottom: 12 }} />
          <p>Không tìm thấy nhà thuốc tại khu vực này</p>
        </div>
      )}

      {branches.length > 0 && (
        <div>
          {branches.map(store => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  )
}
