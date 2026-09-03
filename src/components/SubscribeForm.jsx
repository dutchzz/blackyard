import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { addSubscriber } from '../services/store'

/** Compact email-capture form used inside the footer Updates modal. */
export default function SubscribeForm() {
  const { config } = useStore()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await addSubscriber(email)
      if (res.ok) {
        setStatus('done')
        setMsg('You\u2019re on the list — talk soon!')
        setEmail('')
      } else {
        setStatus('error')
        setMsg(res.error)
      }
    } catch {
      setStatus('error')
      setMsg('Something went wrong. Try again in a moment.')
    }
  }

  return (
    <>
      {status === 'done' ? (
        <div className="banner banner-info" style={{ marginBottom: 0 }}>
          {msg}
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={submit} style={{ maxWidth: 'none' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setStatus('idle')
            }}
            placeholder="you@example.com"
            required
          />
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing…' : 'Notify me'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="error-msg" style={{ marginBottom: 0 }}>{msg}</p>}
    </>
  )
}
