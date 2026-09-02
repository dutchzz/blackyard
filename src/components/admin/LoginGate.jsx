import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export default function LoginGate({ children }) {
  const { config, loading } = useStore()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('by_admin') === '1')

  if (authed) return children

  if (loading || !config) {
    return (
      <div className="login-wrap">
        <div className="login-card card">
          <div className="loading-wrap">
            <span className="spinner" />
          </div>
        </div>
      </div>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    if (passcode === config.adminPasscode) {
      sessionStorage.setItem('by_admin', '1')
      setAuthed(true)
    } else {
      setError('Incorrect passcode.')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card card">
        <div className="brand">
          <span className="brand-mark">B</span>
          {config.storeName}
        </div>
        <h1>Admin</h1>
        <p>Enter your admin passcode to manage the store.</p>
        <form onSubmit={submit}>
          <div className="field">
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value)
                setError('')
              }}
              placeholder="Passcode"
              autoFocus
              required
            />
          </div>
          {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
