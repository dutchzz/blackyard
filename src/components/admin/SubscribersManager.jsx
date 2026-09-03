import { useCallback, useEffect, useState } from 'react'
import { listSubscribers, deleteSubscriber } from '../../services/store'

export default function SubscribersManager() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setSubs(await listSubscribers())
    } catch (e) {
      setMsg('Could not load subscribers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (id) => {
    await deleteSubscriber(id)
    setSubs((prev) => prev.filter((s) => s.id !== id))
  }

  const exportCsv = () => {
    const rows = subs.map((s) => s.email).join('\n')
    const blob = new Blob([rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blackyard-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>Subscribers ({subs.length})</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv} disabled={subs.length === 0}>
            Export .csv
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {msg && <div className="banner banner-warn">{msg}</div>}

      {loading ? (
        <div className="loading-wrap">
          <span className="spinner" />
        </div>
      ) : subs.length === 0 ? (
        <div className="empty-state">
          <p>No subscribers yet. Emails collected on the homepage appear here.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '8px 16px', overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{s.createdAt ? new Date(s.createdAt.seconds ? s.createdAt.seconds * 1000 : s.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
