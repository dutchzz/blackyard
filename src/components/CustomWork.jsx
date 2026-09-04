import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function CustomWork() {
  const { config } = useStore()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const cashtag = config?.cashtag || '$CashApp'
  const cashLink = `https://cash.app/${cashtag.replace(/^\$/, '')}`
  const email = config?.contactEmail || ''
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Custom file request')}`

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard may be unavailable in some browsers */
    }
  }

  return (
    <section className="section" id="custom" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Custom work</span>
          <h3 style={{ margin: '10px 0 8px' }}>{config?.customTitle || 'Need a custom file?'}</h3>
          <p className="section-sub" style={{ marginBottom: 20 }}>{config?.customText}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {email && (
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)}>
                Email your idea
              </button>
            )}
            <a className="btn btn-primary" href={cashLink} target="_blank" rel="noreferrer noopener">
              Pay via CashApp
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="payment-modal"
            style={{ maxWidth: 440 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="pm-head">
              <h3>Email your idea</h3>
              <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="pm-body">
              <p className="section-sub" style={{ marginBottom: 16 }}>
                Tell us what you need built and we&apos;ll get back to you with a quote.
              </p>
              <a className="btn btn-primary btn-block" href={mailto}>
                Open in your mail app
              </a>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 12,
                  padding: '8px 8px 8px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  background: 'var(--bg)',
                }}
              >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted)', fontSize: '0.95rem' }}>
                  {email}
                </span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copyEmail}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="hint" style={{ marginTop: 10, textAlign: 'center' }}>
                If the button doesn&apos;t open your email app, copy the address above and paste it into your email.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

