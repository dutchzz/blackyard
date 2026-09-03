import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import SubscribeForm from './SubscribeForm'

export default function Footer() {
  const { config } = useStore()
  const [modal, setModal] = useState(null) // 'updates' | 'terms'

  const storeName = config?.storeName || 'BLACKYARD'
  const contactEmail = config?.contactEmail || ''
  const cashtag = config?.cashtag || '$CashApp'

  const openModal = (which) => {
    // Hover or click both open; clicking the open one closes it.
    setModal((m) => (m === which ? null : which))
  }

  useEffect(() => {
    if (!modal) return
    const onKey = (e) => e.key === 'Escape' && setModal(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [modal])

  return (
    <footer className="site-footer" id="legal">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="brand">
            <img className="brand-logo brand-logo-lg" src="/logo.png" alt={storeName} />
          </div>
          <p style={{ marginTop: 8 }}>{config?.footerText}</p>
        </div>
        <div className="footer-col">
          <h4>Payments</h4>
          <p>CashApp · {cashtag}</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
        </div>
        <div className="footer-col">
          <h4>Links</h4>
          <button
            type="button"
            className="footer-link"
            onMouseEnter={() => openModal('updates')}
            onClick={() => openModal('updates')}
          >
            Updates
          </button>
          <button
            type="button"
            className="footer-link"
            onMouseEnter={() => openModal('terms')}
            onClick={() => openModal('terms')}
          >
            Terms &amp; use
          </button>
          <Link to="/admin" className="footer-link">
            Admin
          </Link>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div
            className="payment-modal"
            style={{ maxWidth: 540 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="pm-head">
              <h3>{modal === 'updates' ? 'Updates' : 'Terms &amp; use'}</h3>
              <button type="button" className="modal-close" onClick={() => setModal(null)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="pm-body">
              {modal === 'updates' ? (
                <>
                  <p className="section-sub" style={{ marginBottom: 16 }}>
                    {config?.updatesBlurb || 'New files drop regularly. Get notified when the catalog updates.'}
                  </p>
                  <SubscribeForm />
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--muted)', marginBottom: 14 }}>{config?.licenseText}</p>
                  {config?.restrictionNote && (
                    <div className="legal" style={{ marginTop: 0, borderLeftColor: 'var(--danger)' }}>
                      <strong>Restrictions: </strong>
                      {config.restrictionNote}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

