import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { RefreshCcw } from 'lucide-react'
import { searchProducts } from '../api/shopApi'
import { SearchBar } from '../components/SearchBar'
import { ProductCard } from '../components/ProductCard'
import { FilterBar } from '../components/FilterBar'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['shop-search', query],
    queryFn: () => searchProducts({ q: query, page: 0, size: 20 }),
    enabled: !!query,
  })

  const handleSearch = (newQuery) => {
    if (newQuery) {
      setSearchParams({ q: newQuery })
    }
  }

  const results = data?.data || []

  const [filters, setFilters] = useState({ categoryId: null, prescriptionOnly: false })
  const [sort, setSort] = useState('default')

  let filtered = results
  if (filters.categoryId) {
    filtered = filtered.filter(p => p.categoryId === filters.categoryId)
  }
  if (filters.prescriptionOnly) {
    filtered = filtered.filter(p => p.prescriptionRequired)
  }
  if (sort === 'price_asc') filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
  if (sort === 'name_asc') filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  if (sort === 'name_desc') filtered = [...filtered].sort((a, b) => (b.name || '').localeCompare(a.name || ''))

  return (
    <div>
      <SearchBar initialValue={query} onSearch={handleSearch} />

      {!query && (
        <div className="empty-state">
          <p>Nhập từ khóa để tìm kiếm sản phẩm</p>
        </div>
      )}

      {isLoading && query && (
        <div className="skeleton-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}

      {isError && (
        <div className="error-state" role="alert">
          <p>Không thể tìm kiếm: {error?.message || 'Lỗi kết nối'}</p>
          <button className="btn btn-primary" onClick={() => refetch()} style={{ marginTop: 12 }}>
            <RefreshCcw size={16} aria-hidden="true" />
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && query && results.length > 0 && (
        <>
          <FilterBar onFilter={setFilters} onSort={setSort} totalResults={filtered.length} />

          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="product-card-empty">
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 8 }}>
                Không tìm thấy kết quả cho bộ lọc hiện tại
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-400)' }}>Thử thay đổi từ khóa hoặc bộ lọc</p>
            </div>
          )}
        </>
      )}

      {!isLoading && !isError && query && results.length === 0 && (
        <div className="empty-state">
          <p>Không tìm thấy kết quả cho "{query}"</p>
          <p style={{ marginTop: 8, color: 'var(--ink-400)', fontSize: 13 }}>
            Thử thay đổi từ khóa hoặc kiểm tra chính tả
          </p>
        </div>
      )}
    </div>
  )
}
