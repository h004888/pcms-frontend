import { useState, useEffect, useRef } from 'react'
import { Plus, Search } from 'lucide-react'
import { searchMedicines } from '../api/orderApi.js'

function formatVND(amount) {
  if (amount == null) return '--'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export function MedicinePickerCombobox({ onAdd, existingIds }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await searchMedicines(query)
        setResults(res.data || [])
        setIsOpen(true)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function handleSelect(medicine) {
    onAdd({
      medicineId: medicine.id,
      medicineName: medicine.name,
      qty: 1,
      unitPrice: medicine.price || 0,
      prescriptionRequired: medicine.prescriptionRequired || false,
    })
    setQuery('')
    setIsOpen(false)
    setResults([])
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Plus size={16} style={{ color: 'var(--ink-400)', flexShrink: 0 }} aria-hidden="true" />
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--ink-400)',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          <input
            className="input"
            style={{ paddingLeft: 30, fontSize: 14 }}
            placeholder="Thêm thuốc — nhập tên để tìm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            aria-label="Tìm và thêm thuốc vào đơn hàng"
          />
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 'var(--z-dropdown)',
            background: 'var(--color-surface)',
            border: '1px solid var(--ink-200)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-md)',
            marginTop: 4,
            maxHeight: 240,
            overflowY: 'auto',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '10px 16px', color: 'var(--ink-500)', fontSize: 14 }}>
              Đang tìm kiếm...
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '10px 16px', color: 'var(--ink-500)', fontSize: 14 }}>
              Không tìm thấy thuốc.
            </div>
          ) : (
            results.map((m) => {
              const alreadyAdded = existingIds.has(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={alreadyAdded}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--ink-100)',
                    cursor: alreadyAdded ? 'not-allowed' : 'pointer',
                    opacity: alreadyAdded ? 0.5 : 1,
                  }}
                  onMouseDown={() => !alreadyAdded && handleSelect(m)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14 }}>{m.name}</strong>
                    {m.prescriptionRequired && (
                      <span className="badge badge-warning" style={{ fontSize: 11 }}>Rx</span>
                    )}
                    {m.unit && (
                      <span style={{ color: 'var(--ink-400)', fontSize: 12 }}>{m.unit}</span>
                    )}
                    {alreadyAdded && (
                      <span style={{ color: 'var(--ink-400)', fontSize: 12 }}>· Đã thêm</span>
                    )}
                  </span>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--ink-600)', flexShrink: 0 }}>
                    {formatVND(m.price)}
                  </span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
