import { useCallback, useEffect, useState } from 'react'
import { listReports, deleteReport, setReportStatus } from '../../services/store'

export default function ReportsManager() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setReports(await listReports())
    } catch {
      setMsg('Could not load reports.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const remove = async (id) => {
    if (!window.confirm('Delete this report?')) return
    await deleteReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const toggle = async (r) => {
    const status = r.status === 'open' ? 'resolved' : 'open'
    await setReportStatus(r.id, status)
    setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)))
  }

  const open = reports.filter((r) => r.status !== 'resolved').length

  const fmtDate = (ts) => {
    if (!ts) return '—'
    const ms = ts.seconds ? ts.seconds * 1000 : ts
    return new Date(ms).toLocaleString()
  }

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>Reports ({reports.length})</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {open > 0 && (
        <div className="banner banner-info">
          <strong>{open} open</strong> report{open === 1 ? '' : 's'} need attention.
        </div>
      )}
      {msg && <div className="banner banner-warn">{msg}</div>}

      {loading ? (
        <div className="loading-wrap">
          <span className="spinner" />
        </div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <p>No reports yet. Buyers can flag broken links or file issues from any product page.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '8px 16px', overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Report</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.productName || '—'}</td>
                  <td style={{ maxWidth: 280 }}>{r.note || '—'}</td>
                  <td>{r.contact || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.createdAt)}</td>
                  <td>
                    <span className={`pill ${r.status === 'open' ? 'pill-red' : 'pill-green'}`}>
                      {r.status === 'open' ? 'Open' : 'Resolved'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(r)}>
                        {r.status === 'open' ? 'Resolve' : 'Reopen'}
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(r)}>
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
