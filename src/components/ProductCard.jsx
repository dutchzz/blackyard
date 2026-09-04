import { useStore } from '../context/StoreContext'
import { productCover } from '../utils/images'

export default function ProductCard({ product, onSelect }) {
  const { config } = useStore()
  const isFree = !product.price || Number(product.price) === 0
  const placeholder = (product.name || 'B').trim().charAt(0).toUpperCase()
  const badge = !product.active ? 'Coming soon' : isFree ? 'FREE' : `$${Number(product.price).toFixed(2)}`
  const cover = productCover(product)

  // Social proof = owner-set starting base + real downloads. Only show once it
  // reaches the configured minimum so small/zero numbers never appear.
  const totalDownloads = Number(product.startDownloads || 0) + Number(product.downloads || 0)
  const minDownloads = Number(config?.downloadsStart) > 0 ? Number(config.downloadsStart) : 20

  const updatedLabel =
    product.updatedAt && !Number.isNaN(Number(product.updatedAt))
      ? new Date(Number(product.updatedAt)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : ''

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => onSelect(product)}
      aria-label={`View ${product.name}`}
    >
      <div className="product-thumb">
        {cover ? (
          <img src={cover} alt={product.name} loading="lazy" />
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className={`badge ${!product.active ? 'badge-hidden' : isFree ? 'badge-free' : 'badge-paid'}`}>
          {badge}
        </span>
        {product.flag === 'new' && (
          <span className="badge badge-new" style={{ left: 'auto', right: 12 }}>
            NEW
          </span>
        )}
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>
        {product.category && <span className="category">{product.category}</span>}
        {(product.version || updatedLabel) && (
          <span className="product-tags">
            {product.version && <span className="tag tag-accent">{product.version}</span>}
            {updatedLabel && <span className="tag">Updated {updatedLabel}</span>}
          </span>
        )}
        {totalDownloads >= minDownloads && (
          <span className="category" style={{ color: 'var(--primary)' }}>
            {totalDownloads} download{totalDownloads === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </button>
  )
}

