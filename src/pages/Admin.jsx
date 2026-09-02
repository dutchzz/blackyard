import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import LoginGate from '../components/admin/LoginGate'
import ProductEditor from '../components/admin/ProductEditor'
import SettingsEditor from '../components/admin/SettingsEditor'
import CodesManager from '../components/admin/CodesManager'

const TABS = [
  { id: 'products', label: 'Products' },
  { id: 'settings', label: 'Site settings' },
  { id: 'codes', label: 'Unlock codes' },
]

function AdminShell() {
  const { config, firebaseOn } = useStore()
  const [tab, setTab] = useState('products')

  const logout = () => {
    sessionStorage.removeItem('by_admin')
    window.location.reload()
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="brand">
          <span className="brand-mark">B</span>
          {config?.storeName} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            View site
          </Link>
          <button type="button" className="btn btn-danger btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-side">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <main className="admin-main">
          {!firebaseOn && (
            <div className="banner banner-warn">
              <strong>Demo mode.</strong> Firebase isn&apos;t configured yet, so changes are saved to this
              browser only. Add your Firebase keys to <code>.env</code> to go live (see README).
            </div>
          )}
          {config?.adminPasscode === 'blackyard' && (
            <div className="banner banner-warn">
              <strong>Default passcode.</strong> Change the admin passcode under <em>Site settings → Admin
              security</em> before going live.
            </div>
          )}

          {tab === 'products' && <ProductEditor />}
          {tab === 'settings' && <SettingsEditor />}
          {tab === 'codes' && <CodesManager />}
        </main>
      </div>
    </div>
  )
}

export default function Admin() {
  return (
    <LoginGate>
      <AdminShell />
    </LoginGate>
  )
}
