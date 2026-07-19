import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  RefreshCcw, Search, Grid3X3, List, SlidersHorizontal,
  ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  SearchX, X
} from 'lucide-react'
import { searchProducts, getCategories } from '../api/shopApi'
import { ProductCard } from '../components/ProductCard'
import { FilterSidebar } from '../components/FilterSidebar'
import { ActiveFilterChips } from '../components/ActiveFilterChips'

const SORT_OPTIONS = [
  { value: 'default', label: 'Mac dinh' },
  { value: 'price_asc', label: 'Gia thap -> cao' },
  { value: 'price_desc', label: 'Gia cao -> thap' },
  { value: 'name_asc', label: 'Ten A -> Z' },
  { value: 'name_desc', label: 'Ten Z -> A' },
]

const PAGE_SIZE_OPTIONS = [
  { value: 12, label: '12 / trang' },
  { value: 20, label: '20 / trang' },
  { value: 50, label: '50 / trang' },
]

const POPULAR_SUGGESTIONS = [
  'Paracetamol', 'Vitamin C', 'Amoxicillin', 'Panadol', 'Omega-3'
]

/* ── Custom dropdown ──────────────────────────────────────────── */
function SortDropdown({ value, options, onChange, ariaLabel }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const current = options.find(o => o.value === value) || options[0]

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <div ref={wrapRef} className={`sd-wrap ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="sd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
      >
        <span>{current.label}</span>
        <ChevronDown size={14} className="sd-trigger-icon" aria-hidden="true" />
      </button>
      <div className="sd-menu" role="listbox">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={opt.value === value}
            className={`sd-option ${opt.value === value ? 'is-active' : ''}`}
            onClick={() => { onChange(opt.value); setOpen(false) }}
          >
            <span>{opt.label}</span>
            <ChevronDown size={14} className="sd-check" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Search page ──────────────────────────────────────────────── */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('category') || ''
  const rxOnly = searchParams.get('rx') === '1'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const [sort, setSort] = useState('default')
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState('grid')
  const [pageSize, setPageSize] = useState(20)
  const [categories, setCategories] = useState([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    getCategories()
      .then(d => setCategories(d?.data || d || []))
      .catch(() => setCategories([]))
  }, [])

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['shop-search', query, categoryFilter, sort, page, pageSize],
    queryFn: () => searchProducts({ q: query || undefined, category: categoryFilter || undefined, page, size: pageSize, sort: sort !== 'default' ? sort : undefined }),
    placeholderData: (previousData) => previousData,
  })

  const apiResults = data?.data || []
  const serverTotal = data?.total || 0

  const filteredResults = useMemo(() => {
    let r = apiResults
    if (rxOnly) {
      r = r.filter(m => m.prescriptionRequired === true || m.prescriptionRequired === 'true' || m.prescriptionRequired === 1)
    }
    if (minPrice) {
      const min = Number(minPrice)
      if (!isNaN(min)) r = r.filter(m => Number(m.price || 0) >= min)
    }
    if (maxPrice) {
      const max = Number(maxPrice)
      if (!isNaN(max)) r = r.filter(m => Number(m.price || 0) <= max)
    }
    return r
  }, [apiResults, rxOnly, minPrice, maxPrice])

  const hasClientFilters = !!(rxOnly || minPrice || maxPrice)
  const totalResults = hasClientFilters ? filteredResults.length : serverTotal
  const totalPages = hasClientFilters ? Math.max(1, Math.ceil(totalResults / pageSize)) : (data?.totalPages || 1)

  const isActive = !isLoading && !isError
  const selectedCategoryName = categories.find(c => c.id === categoryFilter)?.name || null

  // Range display: "1-20 trong 97"
  const rangeStart = totalResults === 0 ? 0 : page * pageSize + 1
  const rangeEnd = Math.min(totalResults, (page + 1) * pageSize)

  const updateParams = (updates) => {
    setPage(0)
    const params = {}
    const current = Object.fromEntries(searchParams.entries())
    const merged = { ...current, ...updates }
    for (const [k, v] of Object.entries(merged)) {
      if (v) params[k] = v
    }
    setSearchParams(params)
  }

  const handleSearch = (q) => {
    if (!q.trim()) return
    setPage(0)
    setSort('default')
    setSearchParams({ q: q.trim() })
  }

  const handleHeroSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.target).get('q')?.toString().trim()
    if (q) handleSearch(q)
  }

  const handleCategoryChange = (catId) => {
    setPage(0)
    const params = {}
    if (query) params.q = query
    if (catId) params.category = catId
    if (rxOnly) params.rx = '1'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    setSearchParams(params)
    setMobileFilterOpen(false)
  }

  const handleRemoveQuery = () => {
    setPage(0)
    const params = {}
    if (categoryFilter) params.category = categoryFilter
    if (rxOnly) params.rx = '1'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    setSearchParams(params)
  }

  const handleRemoveCategory = () => {
    setPage(0)
    const params = {}
    if (query) params.q = query
    if (rxOnly) params.rx = '1'
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    setSearchParams(params)
  }

  const handleRemoveRx = () => {
    setPage(0)
    const params = {}
    if (query) params.q = query
    if (categoryFilter) params.category = categoryFilter
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    setSearchParams(params)
  }

  const handleRemovePrice = () => {
    setPage(0)
    const params = {}
    if (query) params.q = query
    if (categoryFilter) params.category = categoryFilter
    if (rxOnly) params.rx = '1'
    setSearchParams(params)
  }

  const handleClearAll = useCallback(() => {
    setPage(0)
    setSort('default')
    setSearchParams({})
  }, [setSearchParams])

  // Pagination window: show up to 5 page numbers centered on current
  const paginationItems = useMemo(() => {
    const items = []
    const maxVisible = 5
    let startPage = Math.max(0, page - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible)
    if (endPage - startPage < maxVisible) startPage = Math.max(0, endPage - maxVisible)
    for (let i = startPage; i < endPage; i++) items.push(i)
    return { items, showLeftEllipsis: startPage > 0, showRightEllipsis: endPage < totalPages }
  }, [page, totalPages])

  return (
    <div>
      {/* ═══ HERO SEARCH ═══ */}
      <div className="search-hero">
        <p className="search-hero-label">Tim kiem thuoc, thuc pham chuc nang, dung cu y te</p>
        <form onSubmit={handleHeroSearch} className="search-hero-form">
          <input name="q" type="text" placeholder="Nhap ten thuoc, benh ly, hoat chat..." defaultValue={query} autoComplete="off" />
          <button type="submit" className="search-hero-btn"><Search size={18} aria-hidden="true" /> Tim kiem</button>
        </form>
        {!query && !categoryFilter && !rxOnly && !minPrice && !maxPrice && (
          <div className="search-hero-suggestions">
            <span className="search-hero-label" style={{ margin: 0 }}>Pho bien:</span>
            {POPULAR_SUGGESTIONS.map(s => (
              <button key={s} type="button" className="search-hero-suggestion" onClick={() => handleSearch(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ LOADING SKELETON ═══ */}
      {isLoading && (
        <>
          <div className="search-layout">
            <aside className="search-layout-sidebar">
              <div className="skeleton skeleton-sidebar is-shimmer" />
            </aside>
            <div className="search-layout-main">
              <div className="skeleton skeleton-toolbar is-shimmer" />
              <div className="product-grid">
                {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-card is-shimmer" />)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══ ERROR ═══ */}
      {isError && (
        <div className="error-state" role="alert">
          <p>Khong the tim kiem: {error?.message || 'Loi ket noi'}</p>
          <button className="btn btn-primary" onClick={() => refetch()} style={{ marginTop: 12 }}>
            <RefreshCcw size={16} aria-hidden="true" /> Thu lai
          </button>
        </div>
      )}

      {/* ═══ RESULTS ═══ */}
      {isActive && (
        <div className="search-layout">
          <aside className={`search-layout-sidebar ${mobileFilterOpen ? 'open' : ''}`}>
            <FilterSidebar
              categories={categories}
              selectedCategory={categoryFilter || null}
              onCategoryChange={handleCategoryChange}
              rxOnly={rxOnly}
              onRxChange={(rx) => updateParams({ rx: rx ? '1' : '' })}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => updateParams({ minPrice: min || '', maxPrice: max || '' })}
              onClear={handleClearAll}
            />
          </aside>
          <div className={`search-layout-sidebar-backdrop ${mobileFilterOpen ? 'open' : ''}`}
            onClick={() => setMobileFilterOpen(false)} />

          <div className="search-layout-main">
            <ActiveFilterChips
              query={query || null}
              categoryName={selectedCategoryName}
              rxOnly={rxOnly}
              priceLabel={(minPrice || maxPrice) ? `${minPrice || '0'}d - ${maxPrice || '...'}d` : null}
              onRemoveQuery={handleRemoveQuery}
              onRemoveCategory={handleRemoveCategory}
              onRemoveRx={handleRemoveRx}
              onRemovePrice={handleRemovePrice}
            />

            <div className="search-toolbar is-sticky">
              <span className="search-toolbar-count" aria-live="polite">
                {isFetching && !isLoading ? (
                  'Dang cap nhat...'
                ) : (
                  <span className="search-toolbar-range">
                    <strong>{rangeStart}-{rangeEnd}</strong>
                    <span>trong</span>
                    <strong>{totalResults}</strong>
                    <span>ket qua</span>
                  </span>
                )}
              </span>
              <div className="search-toolbar-right">
                <SortDropdown
                  value={sort}
                  options={SORT_OPTIONS}
                  onChange={(v) => { setSort(v); setPage(0) }}
                  ariaLabel="Sap xep theo"
                />
                <SortDropdown
                  value={pageSize}
                  options={PAGE_SIZE_OPTIONS}
                  onChange={(v) => { setPageSize(v); setPage(0) }}
                  ariaLabel="So luong moi trang"
                />
                <div className="view-toggle" role="group" aria-label="Che do hien thi">
                  <button
                    type="button"
                    className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-pressed={viewMode === 'grid'}
                    aria-label="Xem dang luoi"
                    title="Luoi"
                  >
                    <Grid3X3 size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-pressed={viewMode === 'list'}
                    aria-label="Xem dang danh sach"
                    title="Danh sach"
                  >
                    <List size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {filteredResults.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
                  {filteredResults.map(product => (
                    <ProductCard key={product.id} product={product} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="search-pagination" aria-label="Phan trang">
                    <button
                      type="button"
                      className="search-pagination-btn"
                      disabled={page === 0}
                      onClick={() => setPage(0)}
                      aria-label="Trang dau"
                    >
                      <ChevronsLeft size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="search-pagination-btn"
                      disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}
                      aria-label="Trang truoc"
                    >
                      <ChevronLeft size={14} aria-hidden="true" />
                    </button>
                    {paginationItems.showLeftEllipsis && <span className="search-pagination-info">...</span>}
                    {paginationItems.items.map(i => (
                      <button
                        key={i}
                        type="button"
                        className={`search-pagination-btn ${i === page ? 'active' : ''}`}
                        onClick={() => setPage(i)}
                        aria-current={i === page ? 'page' : undefined}
                        aria-label={`Trang ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    {paginationItems.showRightEllipsis && <span className="search-pagination-info">...</span>}
                    <button
                      type="button"
                      className="search-pagination-btn"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => p + 1)}
                      aria-label="Trang sau"
                    >
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="search-pagination-btn"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(totalPages - 1)}
                      aria-label="Trang cuoi"
                    >
                      <ChevronsRight size={14} aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="search-empty" role="status">
                <div className="search-empty-icon" aria-hidden="true">
                  <SearchX size={32} />
                </div>
                <h2 className="search-empty-title">
                  {query ? `Khong tim thay ket qua cho "${query}"` : 'Khong co san pham phu hop'}
                </h2>
                <p className="search-empty-sub">
                  {query
                    ? 'Thu mot tu khoa khac hoac mo rong bo loc ben duoi.'
                    : 'Hay thu thay doi bo loc de xem them san pham.'}
                </p>
                <div className="search-empty-suggestions">
                  {POPULAR_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className="search-hero-suggestion"
                      onClick={() => handleSearch(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {(query || categoryFilter || rxOnly || minPrice || maxPrice) && (
                  <button type="button" className="search-empty-clear" onClick={handleClearAll}>
                    <X size={14} aria-hidden="true" style={{ marginRight: 6, verticalAlign: '-2px' }} />
                    Xoa tat ca bo loc
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isActive && (
        <button className="search-mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
          <SlidersHorizontal size={16} aria-hidden="true" /> Bo loc
        </button>
      )}
    </div>
  )
}