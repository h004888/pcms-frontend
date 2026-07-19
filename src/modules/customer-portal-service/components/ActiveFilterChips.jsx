export function ActiveFilterChips({ query, categoryName, rxOnly, priceLabel, onRemoveQuery, onRemoveCategory, onRemoveRx, onRemovePrice }) {
  const chips = []
  if (query) chips.push({ key: 'q', label: `"${query}"`, onRemove: onRemoveQuery })
  if (categoryName) chips.push({ key: 'cat', label: categoryName, onRemove: onRemoveCategory })
  if (rxOnly) chips.push({ key: 'rx', label: 'Thuoc ke don', onRemove: onRemoveRx })
  if (priceLabel) chips.push({ key: 'price', label: priceLabel, onRemove: onRemovePrice })

  if (chips.length === 0) return null

  return (
    <div className="active-filters">
      {chips.map(chip => (
        <span key={chip.key} className="active-filter-chip">
          {chip.label}
          <button onClick={chip.onRemove} aria-label={`Xoa bo loc ${chip.label}`}>&times;</button>
        </span>
      ))}
    </div>
  )
}
