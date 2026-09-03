import { productCover } from '../utils/images'

export default function ProductCard({ product, onSelect }) {
  const isFree = !product.price || Number(product.price) === 0
  const placeholder = (product.name || 'B').trim().charAt(0).toUpperCase()
  const badge = !product.active ? 'Coming soon' : isFree ? 'FREE' : `$${Number(product.price).toFixed(2)}`
  const cover = productCover(product)

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
      </div>

      <div className="product-body">
        <h3>{product.name}</h3>
        {product.category && <span className="category">{product.category}</span>}
        {Number(product.downloads || 0) > 0 && (
          <span className="category" style={{ color: 'var(--primary)' }}>
            {product.downloads} download{Number(product.downloads) === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </button>
  )
}

