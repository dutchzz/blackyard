import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' })

  return (
    <span className="nav-clock" title="Current date &amp; time">
      <span className="nav-clock-dot" aria-hidden="true" />
      {date} · {time}
    </span>
  )
}

export default function Header() {
  const { config } = useStore()
  const name = config?.storeName || 'BLACKYARD'

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${name} home`}>
          <img className="brand-logo" src="/logo.png" alt={name} />
        </Link>
        <div className="header-right">
          <nav className="nav">
            <Link to="/admin" className="nav-admin">
              Admin
            </Link>
          </nav>
          <Clock />
        </div>
      </div>
    </header>
  )
}
