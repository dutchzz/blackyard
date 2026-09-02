import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const genCode = () =>
  'BY-' + Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')

export default function CodesManager() {
  const { products, codes, createCode, revokeCode } = useStore()
  const paid = products.filter((p) => Number(p.price) > 0 && p.active)
  const [productId, setProductId] = useState(paid[0]?.id || '')
  const [code, setCode] = useState(genCode())

  const add = async (e) => {
    e.preventDefault()
    if (!productId || !code.trim()) return
    await createCode({
      code: code.trim().toUpperCase(),
      productId,
      productName: products.find((p) => p.id === productId)?.name || '',
      used: false,
    })
    setCode(genCode())
  }

  const productName = (id) => products.find((p) => p.id === id)?.name || '—'

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>Unlock codes ({codes.length})</h3>
      </div>

      <div className="card">
        <h3>Create a code</h3>
        <p className="section-sub" style={{ marginBottom: 14 }}>
          Generate a code, then send it to a buyer after you verify their CashApp payment. Each code works
          once for its product.
        </p>
        <form onSubmit={add} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: '1 1 200px' }}>
            <label>Product</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              {paid.length === 0 && <option value="">No paid products yet</option>}
              {paid.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${Number(p.price).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: '1 1 180px' }}>
            <label>Code</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={code} onChange={(e) => setCode(e.target.value)} required />
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCode(genCode())}>
                ↻
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={paid.length === 0}>
            + Add code
          </button>
        </form>
      </div>

      {codes.length === 0 ? (
        <div className="empty-state">
          <p>No codes yet.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '8px 16px', overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Product</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...codes]
                .sort((a, b) => (a.used ? 1 : 0) - (b.used ? 1 : 0))
                .map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{c.code}</td>
                    <td>{c.productName || productName(c.productId)}</td>
                    <td>
                      <span className={`pill ${c.used ? 'pill-red' : 'pill-green'}`}>
                        {c.used ? 'Used' : 'Available'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => revokeCode(c.id)}>
                          Revoke
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
