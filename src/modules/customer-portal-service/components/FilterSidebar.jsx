export function FilterSidebar({ categories, selectedCategory, onCategoryChange, rxOnly, onRxChange, minPrice: minPriceProp, maxPrice: maxPriceProp, onPriceChange, onClear }) {
  const hasActive = selectedCategory || rxOnly || minPriceProp || maxPriceProp

  const handleApplyPrice = (e) => {
    const form = e.target.closest('.filter-sidebar-section')
    const inputs = form.querySelectorAll('input')
    const min = inputs[0]?.value || ''
    const max = inputs[1]?.value || ''
    onPriceChange?.(min, max)
  }

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-header">
        <span className="filter-sidebar-title">Bo loc</span>
        {hasActive && (
          <button className="filter-sidebar-clear" onClick={onClear}
            style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer' }}>
            Xoa tat ca
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="filter-sidebar-section">
        <span className="filter-sidebar-label">Danh muc</span>
        <div>
          <div
            className={`filter-category-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            <span>Tat ca</span>
          </div>
          {categories.map(c => (
            <div
              key={c.id}
              className={`filter-category-item ${selectedCategory === c.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(c.id)}
            >
              <span>{c.name}</span>
              {c.productCount != null && (
                <span className="filter-category-count">{c.productCount}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-sidebar-section">
        <span className="filter-sidebar-label">Khoang gia</span>
        <div className="filter-price-inputs">
          <input type="number" placeholder="0" defaultValue={minPriceProp || ''}
            onKeyDown={e => { if (e.key === 'Enter') handleApplyPrice(e) }} />
          <span>-</span>
          <input type="number" placeholder="500000" defaultValue={maxPriceProp || ''}
            onKeyDown={e => { if (e.key === 'Enter') handleApplyPrice(e) }} />
        </div>
        <button className="filter-price-apply"
          onClick={handleApplyPrice}>
          Áp dụng
        </button>
      </div>

      {/* Prescription Toggle */}
      <div className="filter-sidebar-section">
        <label className="filter-checkbox">
          <input type="checkbox" checked={rxOnly || false} onChange={e => onRxChange(e.target.checked)} />
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Chi hien thuoc ke don</span>
        </label>
      </div>
    </div>
  )
}
