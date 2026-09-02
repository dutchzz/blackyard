import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Header() {
  const { config } = useStore()
  const name = config?.storeName || 'BLACKYARD'

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">{name.charAt(0)}</span>
          {name}
        </Link>
        <nav className="nav">
          <a href="#files">Files</a>
          <a href="#how">How to pay</a>
          <a href="#legal">Legal</a>
          <Link to="/admin" className="nav-admin">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
