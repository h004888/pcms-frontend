import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, MapPin, RefreshCcw, ChevronDown } from 'lucide-react'
import { apiClient } from '@core/http/apiClient.js'
import { getStores } from '../api/shopApi'
import { StoreCard } from '../components/StoreCard'

export function StoreLocatorPage() {
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [page, setPage] = useState(0)

  const { data: provincesData } = useQuery({
    queryKey: ['store-provinces'],
    queryFn: async () => {
      const { data } = await apiClient.get('/store/provinces')
      return data
    },
    staleTime: 30 * 60 * 1000,
  })
  const provinces = provincesData || []

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['stores', province, district, page],
    queryFn: () => getStores({
      province: province || undefined,
      district: district || undefined,
      page,
      size: 20,
    }),
  })

  const branches = data?.branches || []
  const total = data?.total || 0
  const hasMore = branches.length < total

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[var(--shop-text)] mb-6 flex items-center gap-2">
        <MapPin size={20} className="text-[var(--shop-primary)]" />
        Tìm nhà thuốc
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <label className="flex-1 min-w-[200px]">
          <span className="block text-sm font-medium text-[var(--shop-text-secondary)] mb-1">Tỉnh/Thành</span>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--shop-primary)]"
            value={province}
            onChange={e => { setProvince(e.target.value); setPage(0) }}
          >
            <option value="">Tất cả</option>
            {provinces.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className="flex-1 min-w-[200px]">
          <span className="block text-sm font-medium text-[var(--shop-text-secondary)] mb-1">Quận/Huyện</span>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--shop-primary)]"
            value={district}
            onChange={e => { setDistrict(e.target.value); setPage(0) }}
            placeholder="Nhập quận/huyện..."
          />
        </label>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6 h-[140px]" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12" role="alert">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">Không thể tải danh sách nhà thuốc: {error?.message || 'Lỗi kết nối'}</p>
          <button className="px-6 py-2.5 bg-[var(--shop-primary)] text-white rounded-full font-semibold hover:bg-[var(--shop-primary-hover)] transition-colors" onClick={() => refetch()}>
            <RefreshCcw size={16} className="inline mr-2" />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && branches.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Không tìm thấy nhà thuốc tại khu vực này</p>
        </div>
      )}

      {branches.length > 0 && (
        <>
          <div className="space-y-4">
            {branches.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                className="px-8 py-3 border-2 border-[var(--shop-primary)] text-[var(--shop-primary)] rounded-full font-semibold hover:bg-[var(--shop-primary-light)] transition-colors"
                onClick={() => setPage(p => p + 1)}
              >
                Xem thêm ({total - branches.length} nhà thuốc)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
