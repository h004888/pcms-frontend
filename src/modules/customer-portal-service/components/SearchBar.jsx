import { Search } from 'lucide-react'

export function SearchBar({ initialValue, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get('query')?.toString().trim() || ''
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        className="input"
        type="text"
        name="query"
        defaultValue={initialValue || ''}
        placeholder="Tìm kiếm thuốc, bệnh, bài viết..."
        autoComplete="off"
        style={{ flex: 1 }}
      />
      <button className="btn btn-primary" type="submit">
        <Search size={16} aria-hidden="true" />
        Tìm kiếm
      </button>
    </form>
  )
}
