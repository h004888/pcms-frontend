import { useState, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { getCategories } from '../api/shopApi'

const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
  { value: 'name_asc', label: 'Tên A → Z' },
  { value: 'name_desc', label: 'Tên Z → A' },
]

export function FilterBar({ onFilter, onSort, totalResults, initialCategory }) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(initialCategory || null)
  const [rxOnly, setRxOnly] = useState(false)
  const [sort, setSort] = useState('default')

  useEffect(() => {
    getCategories()
      .then(data => {
        const list = data?.data || data || []
        setCategories(list)
      })
      .catch(() => setCategories([]))
  }, [])

  const apply = (cat, rx, s) => {
    setCategory(cat)
    setRxOnly(rx)
    setSort(s)
    onFilter?.({ categoryId: cat, prescriptionOnly: rx })
    onSort?.(s)
  }

  return (
    <div className="filter-bar">
      <div className="filter-bar-top">
        <span className="filter-results-count">{totalResults} kết quả</span>
        <div className="filter-bar-actions">
          <select className="filter-sort-select" value={sort}
            onChange={(e) => { const v = e.target.value; apply(category, rxOnly, v) }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className={`btn btn-ghost ${open ? 'active' : ''}`}
            onClick={() => setOpen(!open)}>
            <SlidersHorizontal size={14} /> Lọc
          </button>
        </div>
      </div>
      {open && (
        <div className="filter-bar-panel">
          <div className="filter-group">
            <span className="filter-label">Danh mục</span>
            <div className="filter-chips">
              <button
                className={`filter-chip ${category === null ? 'active' : ''}`}
                onClick={() => apply(null, rxOnly, sort)}
              >Tất cả</button>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={`filter-chip ${category === c.id ? 'active' : ''}`}
                  onClick={() => apply(c.id, rxOnly, sort)}
                >{c.name}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-checkbox">
              <input type="checkbox" checked={rxOnly}
                onChange={(e) => apply(category, e.target.checked, sort)} />
              Chỉ hiện thuốc kê đơn
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
