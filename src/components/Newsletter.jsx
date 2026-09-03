import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { addSubscriber } from '../services/store'

export default function Newsletter() {
  const { config } = useStore()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [msg, setMsg] = useState('')

  const blurb =
    config?.updatesBlurb ||
    'New files drop regularly. Leave your email to get notified when the catalog updates. No spam, unsubscribe anytime.'

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
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMsg('Something went wrong. Try again in a moment.')
    }
  }

  return (
    <section className="section" id="updates" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="card newsletter" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Updates</span>
          <h3 style={{ margin: '10px 0 8px' }}>Get notified when new files drop</h3>
          <p className="section-sub" style={{ marginBottom: 18 }}>
            {blurb}
          </p>
          {status === 'done' ? (
            <div className="banner banner-info">{msg}</div>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
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
          {status === 'error' && !msg.includes('subscribed') && (
            <p className="error-msg">{msg}</p>
          )}
        </div>
      </div>
    </section>
  )
}
