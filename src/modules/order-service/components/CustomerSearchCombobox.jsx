import { useState, useEffect, useRef } from 'react'
import { Search, User, X } from 'lucide-react'
import { searchCustomers } from '../api/orderApi.js'
import {
  formatTierBadgeClass,
  formatTierLabel,
} from '@modules/customer-service/services/customerFormatters.js'

export function CustomerSearchCombobox({ value, onChange }) {
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
        const res = await searchCustomers(query)
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

  function handleSelect(customer) {
    onChange(customer)
    setQuery('')
    setIsOpen(false)
    setResults([])
  }

  if (value) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: 'var(--ink-50)',
        borderRadius: 8,
        border: '1px solid var(--ink-200)',
      }}>
        <User size={16} style={{ color: 'var(--ink-400)', flexShrink: 0 }} aria-hidden="true" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong>{value.name}</strong>
          <span className="mono" style={{ color: 'var(--ink-500)', fontSize: 13 }}>{value.phone}</span>
          <span className={formatTierBadgeClass(value.tier)}>{formatTierLabel(value.tier)}</span>
          {value.code && (
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-400)' }}>#{value.code}</span>
          )}
        </div>
        <button
          className="btn btn-ghost btn-icon"
          type="button"
          onClick={() => onChange(null)}
          title="Xóa khách hàng"
          aria-label="Xóa khách hàng đã chọn"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--ink-400)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
        <input
          className="input"
          style={{ paddingLeft: 36 }}
          placeholder="Tìm khách hàng theo SĐT, tên hoặc mã..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          aria-label="Tìm kiếm khách hàng"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
      </div>

      {isOpen && (
        <div
          role="listbox"
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
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '12px 16px', color: 'var(--ink-500)', fontSize: 14 }}>
              Đang tìm kiếm...
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '12px 16px', color: 'var(--ink-500)', fontSize: 14 }}>
              Không tìm thấy khách hàng.
            </div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                role="option"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--ink-100)',
                  cursor: 'pointer',
                  flexWrap: 'wrap',
                }}
                onMouseDown={() => handleSelect(c)}
              >
                <strong style={{ fontSize: 14 }}>{c.name}</strong>
                <span className="mono" style={{ color: 'var(--ink-500)', fontSize: 13 }}>{c.phone}</span>
                <span className={formatTierBadgeClass(c.tier)}>{formatTierLabel(c.tier)}</span>
                {c.code && (
                  <span className="mono" style={{ fontSize: 12, color: 'var(--ink-400)' }}>#{c.code}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
