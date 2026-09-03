import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useStore } from '../context/StoreContext'
import UnlockCode from './UnlockCode'

export default function PaymentModal({ product, onClose }) {
  const { config } = useStore()
  const [step, setStep] = useState('pay') // pay | unlock
  const [qr, setQr] = useState('')

  const cashtag = config?.cashtag || '$CashApp'
  const instructions = (config?.paymentInstructions || '').replaceAll('{cashtag}', cashtag)
  const cashLink = `https://cash.app/${cashtag.replace(/^\$/, '')}`

  useEffect(() => {
    let active = true
    QRCode.toDataURL(cashLink, { width: 360, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then((url) => {
        if (active) setQr(url)
      })
      .catch(() => {
        /* QR generation failed — fall back to showing the link */
      })
    return () => {
      active = false
    }
  }, [cashLink])

  return (
    <div className="modal-overlay modal-overlay-top" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="pm-head">
          <h3>{step === 'pay' ? 'Pay via CashApp' : 'Unlock your download'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="pm-body">
          {step === 'pay' ? (
            <>
              <p style={{ marginBottom: 4 }}>
                <strong>{product.name}</strong>
              </p>
              <p className="section-sub">Total: ${Number(product.price).toFixed(2)}</p>

              <div className="pay-card">
                <div className="qr-box">{qr ? <img src={qr} alt="CashApp QR code" /> : <span className="spinner" />}</div>
                <p className="section-sub">Scan with CashApp</p>
                <p className="cashtag">{cashtag}</p>
                <a
                  className="btn btn-primary btn-sm"
                  href={cashLink}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Open in CashApp
                </a>
              </div>

              <ol className="steps">{instructions.split('\n').map((s) => s.trim()).filter(Boolean).map((s, i) => <li key={i}>{s}</li>)}</ol>

              {config?.fulfillmentNote && (
                <p className="legal" style={{ marginTop: 16 }}>
                  <strong>Good to know: </strong>
                  {config.fulfillmentNote}
                </p>
              )}

              <button type="button" className="btn btn-primary btn-block" onClick={() => setStep('unlock')}>
                I&apos;ve paid — get my code
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: 12 }} className="section-sub">
                After we verify your payment, we&apos;ll reply with an unlock code. Enter it below.
              </p>
              <UnlockCode product={product} />
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-block"
                style={{ marginTop: 12 }}
                onClick={() => setStep('pay')}
              >
                ← Back to payment info
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
