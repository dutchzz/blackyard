import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'

export default function ProductGrid({ onSelect }) {
  const { products, loading } = useStore()
  const [category, setCategory] = useState('All')

  const visible = useMemo(
    () => [...products].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [products],
  )

  const categories = useMemo(() => {
    const set = new Set(visible.map((p) => p.category).filter(Boolean))
    return ['All', ...set]
  }, [visible])

  const filtered = category === 'All' ? visible : visible.filter((p) => p.category === category)

  if (loading) {
    return (
      <div className="loading-wrap">
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {categories.length > 1 && (
        <div className="toolbar" style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No files here yet — check back soon.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
