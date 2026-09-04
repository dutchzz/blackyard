import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { parseProductImages, toDownloadUrl } from '../utils/images'
import { addSubscriber, incrementDownloads } from '../services/store'

export default function ProductModal({ product, onClose, onBuy }) {
  const { config } = useStore()
  const [idx, setIdx] = useState(0)
  const [gate, setGate] = useState({ show: false, email: '', busy: false, done: false, error: '' })

  const images = useMemo(() => parseProductImages(product), [product])

  useEffect(() => {
    setIdx(0)
    setGate({ show: false, email: '', busy: false, done: false, error: '' })
  }, [product.id])

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
  const emailUnlocked = gate.done || localStorage.getItem('by_email_ok') === '1'
  const cashtag = config?.cashtag || '$CashApp'
  const cashLink = `https://cash.app/${cashtag.replace(/^\$/, '')}`
  const isFrame = /frame|lower|receiver/i.test(product.category || '')
  const updatedLabel =
    product.updatedAt && !Number.isNaN(Number(product.updatedAt))
      ? new Date(Number(product.updatedAt)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      : ''

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setGate((g) => ({ ...g, busy: true, error: '' }))
    try {
      const res = await addSubscriber(gate.email)
      if (res.ok || res.error === 'Already subscribed.') {
        localStorage.setItem('by_email_ok', '1')
        setGate((g) => ({ ...g, busy: false, done: true }))
      } else {
        setGate((g) => ({ ...g, busy: false, error: res.error }))
      }
    } catch {
      setGate((g) => ({ ...g, busy: false, error: 'Something went wrong. Please try again.' }))
    }
  }

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

          {(product.version || updatedLabel) && (
            <div className="pm-meta" style={{ marginTop: -6, marginBottom: 12 }}>
              {product.version && <span className="tag tag-accent">{product.version}</span>}
              {updatedLabel && <span className="tag">Updated {updatedLabel}</span>}
            </div>
          )}

          {product.printNotes && (
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                marginBottom: 14,
                fontSize: '0.88rem',
              }}
            >
              <strong style={{ fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--primary)' }}>
                Print notes
              </strong>
              <p style={{ marginTop: 6, color: 'var(--muted)', whiteSpace: 'pre-line' }}>{product.printNotes}</p>
            </div>
          )}

          {config?.printDisclaimer && (
            <p className="section-sub" style={{ fontSize: '0.78rem', margin: '0 0 16px' }}>
              {config.printDisclaimer}
            </p>
          )}

          <div className="pm-actions">
            {isFrame && config?.frameNotice && (
              <div
                className="legal"
                style={{ margin: '0 0 12px', padding: '12px 14px', borderLeftColor: 'var(--danger)', fontSize: '0.8rem' }}
              >
                {config.frameNotice}
              </div>
            )}
            {!product.active ? (
              <span className="btn btn-ghost btn-block" aria-disabled>
                Coming soon
              </span>
            ) : isFree ? (
              product.stlUrl ? (
                emailUnlocked ? (
                  <a
                    className="btn btn-primary btn-block"
                    href={toDownloadUrl(product.stlUrl)}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => incrementDownloads(product.id)}
                  >
                    Download free
                  </a>
                ) : !gate.show ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => setGate((g) => ({ ...g, show: true }))}
                  >
                    Download free
                  </button>
                ) : (
                  <form className="unlock" onSubmit={handleEmailSubmit} style={{ marginTop: 0 }}>
                    <p className="section-sub" style={{ textAlign: 'center', marginBottom: 10 }}>
                      Enter your email to unlock this free file.
                    </p>
                    <input
                      type="email"
                      value={gate.email}
                      onChange={(e) => setGate((g) => ({ ...g, email: e.target.value, error: '' }))}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                    <button type="submit" className="btn btn-primary btn-block" disabled={gate.busy}>
                      {gate.busy ? 'One sec…' : 'Get my download'}
                    </button>
                    {gate.error && <p className="error-msg">{gate.error}</p>}
                  </form>
                )
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

            {isFree && (
              <a
                className="btn btn-ghost"
                href={cashLink}
                target="_blank"
                rel="noreferrer noopener"
                style={{ fontSize: '0.85rem' }}
              >
                Like it? Support with a tip · {cashtag}
              </a>
            )}

            {config?.contactEmail && (
              <a
                className="btn btn-ghost"
                href={`mailto:${config.contactEmail}?subject=${encodeURIComponent('Issue with: ' + product.name)}`}
                style={{ fontSize: '0.8rem', color: 'var(--muted)' }}
              >
                Report a problem with this file
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
