import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { parseProductImages, toDownloadUrl } from '../utils/images'

export default function ProductModal({ product, onClose, onBuy }) {
  const { config } = useStore()
  const [idx, setIdx] = useState(0)

  const images = useMemo(() => parseProductImages(product), [product])

  useEffect(() => setIdx(0), [product.id])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const isFree = !product.price || Number(product.price) === 0
  const current = images[Math.min(idx, Math.max(images.length - 1, 0))]

  const prev = (e) => {
    e.stopPropagation()
    setIdx((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e) => {
    e.stopPropagation()
    setIdx((i) => (i + 1) % images.length)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pm-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Gallery */}
        <div className="pm-gallery">
          <div className="gallery-main">
            {current ? (
              <img src={current} alt={`${product.name} — image ${idx + 1}`} />
            ) : (
              <span className="placeholder">{(product.name || 'B').charAt(0).toUpperCase()}</span>
            )}
            {images.length > 1 && (
              <>
                <button type="button" className="gallery-nav prev" onClick={prev} aria-label="Previous image">
                  ‹
                </button>
                <button type="button" className="gallery-nav next" onClick={next} aria-label="Next image">
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === idx ? 'active' : ''}
                  onClick={() => setIdx(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pm-info">
          <span className={`badge ${isFree ? 'badge-free' : 'badge-paid'}`}>
            {isFree ? 'FREE' : `$${Number(product.price).toFixed(2)}`}
          </span>
          <h2>{product.name}</h2>
          <div className="pm-meta">
            {product.category && <span>{product.category}</span>}
            {product.filesize && product.filesize !== '—' && (
              <>
                <span>·</span>
                <span>{product.filesize}</span>
              </>
            )}
          </div>
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="pm-meta">
              {product.tags.map((t) => (
                <span className="tag" key={t} style={{ padding: '2px 10px', border: '1px solid var(--border)', borderRadius: 999, fontSize: '0.76rem' }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          {product.description && <p className="pm-desc">{product.description}</p>}

          <div className="pm-actions">
            {!product.active ? (
              <span className="btn btn-ghost btn-block" aria-disabled>
                Coming soon
              </span>
            ) : isFree ? (
              product.stlUrl ? (
                <a
                  className="btn btn-primary btn-block"
                  href={toDownloadUrl(product.stlUrl)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Download free
                </a>
              ) : (
                <span className="btn btn-ghost btn-block" aria-disabled>
                  File coming soon
                </span>
              )
            ) : (
              <button type="button" className="btn btn-primary btn-block" onClick={() => onBuy(product)}>
                Buy via CashApp · ${Number(product.price).toFixed(2)}
              </button>
            )}

            {isFree && !product.stlUrl && config?.contactEmail && (
              <p className="section-sub" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                Need it before it&apos;s live?{' '}
                <a href={`mailto:${config.contactEmail}`} style={{ color: 'var(--primary)' }}>
                  {config.contactEmail}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
