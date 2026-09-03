import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Header() {
  const { config } = useStore()
  const name = config?.storeName || 'BLACKYARD'

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${name} home`}>
          <img className="brand-logo" src="/logo.png" alt={name} />
        </Link>
        <nav className="nav">
          <a href="#files">Files</a>
          <a href="#how">How to pay</a>
          <Link to="/admin" className="nav-admin">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
