import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { toDownloadUrl } from '../utils/images'
import { incrementDownloads } from '../services/store'

export default function UnlockCode({ product }) {
  const { redeem } = useStore()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setStatus('loading')
    const result = await redeem(code, product.id)
    if (result.ok) {
      setStatus('success')
      setMessage('')
    } else {
      setStatus('error')
      setMessage(result.error)
    }
  }

  return (
    <div className="unlock">
      {status !== 'success' && (
        <form onSubmit={submit}>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setStatus('idle')
            }}
            placeholder="Enter your unlock code (e.g. BY-XXXX)"
            autoComplete="off"
            required
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Checking…' : 'Unlock download'}
          </button>
          {status === 'error' && <p className="error-msg">{message}</p>}
        </form>
      )}

      {status === 'success' && (
        <div className="success-box">
          <strong>Unlocked!</strong>
          {product.stlUrl ? (
            <p style={{ marginTop: 8 }}>
              <a
                className="btn btn-primary btn-block"
                href={toDownloadUrl(product.stlUrl)}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => incrementDownloads(product.id)}
              >
                Download {product.name}
              </a>
            </p>
          ) : (
            <p style={{ marginTop: 8 }}>
              Your file link is being prepared — it will be sent to you shortly.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
