import { useRef, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { exportAll, importAll } from '../../services/store'

export default function BackupManager() {
  const { refresh } = useStore()
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const doExport = async () => {
    setBusy(true)
    try {
      const data = await exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blackyard-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setMsg({ type: 'info', text: 'Backup downloaded — keep it somewhere safe.' })
    } catch (e) {
      setMsg({ type: 'err', text: 'Export failed: ' + e.message })
    } finally {
      setBusy(false)
    }
  }

  const doImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!data || (!data.products && !data.config)) {
        setMsg({ type: 'err', text: 'That does not look like a BLACKYARD backup file.' })
        return
      }
      const ok = window.confirm(
        'Importing will REPLACE all current products, codes, and subscribers with the backup contents. Continue?',
      )
      if (!ok) return
      setBusy(true)
      await importAll(data)
      await refresh()
      setMsg({ type: 'info', text: 'Backup restored successfully.' })
    } catch (err) {
      setMsg({ type: 'err', text: 'Import failed: ' + err.message })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>Backup</h3>
      </div>

      {msg.text && (
        <div className={`banner ${msg.type === 'err' ? 'banner-err' : 'banner-info'}`}>{msg.text}</div>
      )}

      <div className="card" style={{ maxWidth: 560 }}>
        <p className="section-sub" style={{ marginBottom: 18 }}>
          Export everything (products, site settings, unlock codes, subscribers) to a JSON file, or
          restore from a previous backup. Good for moving between browsers or keeping a safe copy.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={doExport} disabled={busy}>
            {busy ? 'Working…' : '⬇ Export backup'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={busy}>
            ⬆ Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={doImport}
          />
        </div>
      </div>
    </div>
  )
}
