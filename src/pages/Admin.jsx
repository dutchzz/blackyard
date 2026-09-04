import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import LoginGate from '../components/admin/LoginGate'
import ProductEditor from '../components/admin/ProductEditor'
import SettingsEditor from '../components/admin/SettingsEditor'
import CodesManager from '../components/admin/CodesManager'
import SubscribersManager from '../components/admin/SubscribersManager'
import ReportsManager from '../components/admin/ReportsManager'
import BackupManager from '../components/admin/BackupManager'

const TABS = [
  { id: 'products', label: 'Products' },
  { id: 'settings', label: 'Site settings' },
  { id: 'codes', label: 'Unlock codes' },
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'reports', label: 'Reports' },
  { id: 'backup', label: 'Backup' },
]

function AdminShell() {
  const { config, firebaseOn } = useStore()
  const [tab, setTab] = useState('products')
  const [deploy, setDeploy] = useState({ busy: false, msg: '', type: '' })

  const logout = () => {
    sessionStorage.removeItem('by_admin')
    window.location.reload()
  }

  const triggerDeploy = async () => {
    const hook = (config?.vercelDeployHook || '').trim()
    if (!hook) {
      setDeploy({ busy: false, msg: 'No deploy hook set — add it under Site settings → Deployment.', type: 'warn' })
      return
    }
    setDeploy({ busy: true, msg: 'Triggering deploy…', type: 'info' })
    try {
      const res = await fetch(hook, { method: 'POST' })
      if (res.ok) {
        setDeploy({ busy: false, msg: 'Deploy started — the latest GitHub code is building now.', type: 'info' })
      } else {
        window.open(hook, '_blank')
        setDeploy({ busy: false, msg: 'Opened the deploy hook in a new tab to trigger the build.', type: 'info' })
      }
    } catch {
      // Browser CORS can block direct calls; opening the hook URL still triggers the deploy.
      window.open(hook, '_blank')
      setDeploy({ busy: false, msg: 'Opened the deploy hook in a new tab to trigger the build.', type: 'info' })
    }
    setTimeout(() => setDeploy((d) => ({ ...d, msg: '' })), 8000)
  }

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="brand">
          <img className="brand-logo" src="/logo.png" alt={config?.storeName} />
          <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" className="btn btn-ghost btn-sm">
            View site
          </Link>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={triggerDeploy}
            disabled={deploy.busy}
            title="Trigger a Vercel deploy of the latest GitHub code"
          >
            {deploy.busy ? 'Deploying…' : 'Deploy'}
          </button>
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
          {deploy.msg && (
            <div className={`banner ${deploy.type === 'warn' ? 'banner-warn' : deploy.type === 'err' ? 'banner-err' : 'banner-info'}`}>
              {deploy.msg}
            </div>
          )}
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
          {tab === 'subscribers' && <SubscribersManager />}
          {tab === 'reports' && <ReportsManager />}
          {tab === 'backup' && <BackupManager />}
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
