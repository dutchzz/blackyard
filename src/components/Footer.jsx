import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { config } = useStore()
  if (!config) return null
  const { storeName, footerText, contactEmail, cashtag } = config

  return (
    <footer className="site-footer" id="legal">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="brand">
            <span className="brand-mark">{(storeName || 'B').charAt(0)}</span>
            {storeName}
          </div>
          <p style={{ marginTop: 8 }}>{footerText}</p>
        </div>
        <div className="footer-col">
          <h4>Payments</h4>
          <p>CashApp · {cashtag}</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
        <div className="footer-col">
          <h4>Links</h4>
          <p>
            <Link to="/admin">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
