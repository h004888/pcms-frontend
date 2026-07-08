export function BranchSelect({ branches, value, onChange, label = 'Chi nhánh', error }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Chọn chi nhánh</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.code ? `${branch.code} - ${branch.name}` : branch.name}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}

export function MedicineSelect({ medicines, value, onChange, error }) {
  return (
    <label className="field">
      <span className="field-label">Thuốc</span>
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Chọn thuốc</option>
        {medicines.map((medicine) => (
          <option key={medicine.id} value={medicine.id}>
            {medicine.sku ? `${medicine.sku} - ${medicine.name}` : medicine.name}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}

export function SupplierSelect({ suppliers, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">Nhà cung cấp</span>
      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Không chọn</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>
    </label>
  )
}
