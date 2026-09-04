import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { parseProductImages } from '../../utils/images'

const blank = {
  name: '',
  category: '',
  description: '',
  price: 0,
  imageUrl: '',
  stlUrl: '',
  filesize: '',
  tags: [],
  active: true,
  sortOrder: 0,
  startDownloads: 0,
  version: '',
  flag: '',
  printNotes: '',
}

export default function ProductEditor() {
  const { products, saveProduct, removeProduct } = useStore()
  const [editing, setEditing] = useState(null) // null = list view, {} = new, object = edit
  const [form, setForm] = useState(blank)
  const [tagsText, setTagsText] = useState('')
  const [imagesText, setImagesText] = useState('')
  const [saving, setSaving] = useState(false)

  const startNew = () => {
    setForm({ ...blank, sortOrder: products.length })
    setTagsText('')
    setImagesText('')
    setEditing({})
  }

  const startEdit = (p) => {
    setForm({
      ...p,
      price: Number(p.price) || 0,
      startDownloads: Number(p.startDownloads) || 0,
      version: p.version || '',
      flag: p.flag || '',
      printNotes: p.printNotes || '',
    })
    setTagsText((p.tags || []).join(', '))
    setImagesText(parseProductImages(p).join('\n'))
    setEditing(p)
  }

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const images = imagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images,
      imageUrl: images[0] || form.imageUrl || '',
      sortOrder: Number(form.sortOrder) || 0,
      startDownloads: Number(form.startDownloads) || 0,
      version: (form.version || '').trim(),
      flag: form.flag || '',
      printNotes: (form.printNotes || '').trim(),
      updatedAt: Date.now(),
    }
    await saveProduct(payload)
    setSaving(false)
    setEditing(null)
  }

  const confirmDelete = async (p) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      await removeProduct(p.id)
    }
  }

  /* ---------- List view ---------- */
  if (editing === null) {
    return (
      <div>
        <div className="toolbar">
          <h3 style={{ margin: 0 }}>Products ({products.length})</h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={startNew}>
            + Add product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products yet. Add your first one.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: '8px 16px', overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td>{Number(p.price) === 0 ? 'FREE' : `$${Number(p.price).toFixed(2)}`}</td>
                    <td>
                      <span className={`pill ${p.active ? 'pill-green' : 'pill-red'}`}>
                        {p.active ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => confirmDelete(p)}>
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

  /* ---------- Form view ---------- */
  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0 }}>{editing.id ? `Edit: ${editing.name}` : 'Add product'}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>
          ← Back to list
        </button>
      </div>

      <form onSubmit={submit}>
        <div className="card">
          <div className="form-grid">
            <div className="field">
              <label>Name *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div className="field">
              <label>Category</label>
              <input value={form.category} onChange={set('category')} placeholder="e.g. Lower Receivers" />
            </div>
            <div className="field">
              <label>Price (USD) — 0 = free</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} />
            </div>
            <div className="field">
              <label>File size (display)</label>
              <input value={form.filesize} onChange={set('filesize')} placeholder="e.g. 12.4 MB" />
            </div>
            <div className="field">
              <label>Starting downloads</label>
              <input type="number" min="0" value={form.startDownloads} onChange={set('startDownloads')} placeholder="e.g. 67" />
              <span className="hint">Base count shown as social proof. Real downloads add on top.</span>
            </div>
            <div className="field">
              <label>Sort order</label>
              <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
            </div>
            <div className="field">
              <label>Version tag</label>
              <input value={form.version} onChange={set('version')} placeholder="e.g. V2" />
              <span className="hint">Shown as a chip (e.g. V2) and used for the &quot;updated&quot; badge.</span>
            </div>
            <div className="field">
              <label>Flag</label>
              <select value={form.flag} onChange={set('flag')}>
                <option value="">None</option>
                <option value="new">New</option>
              </select>
              <span className="hint">&quot;New&quot; shows a small corner tag on the card.</span>
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={set('description')} />
          </div>

          <div className="field">
            <label>Print notes (shown on the file page)</label>
            <textarea
              value={form.printNotes}
              onChange={set('printNotes')}
              placeholder={'e.g. 4 walls, 100% infill, no supports'}
              style={{ minHeight: 70 }}
            />
            <span className="hint">Optional recommended print settings shown inside the file popup.</span>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Images (one URL per line)</label>
              <textarea
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder={'https://…/photo-1.jpg\nhttps://…/photo-2.jpg'}
                style={{ minHeight: 90 }}
              />
              <span className="hint">
                First image is the card thumbnail. Paste one public URL per line to build the gallery.
              </span>
            </div>
            <div className="field">
              <label>STL download URL (external)</label>
              <input value={form.stlUrl} onChange={set('stlUrl')} placeholder="https://drive.google.com/…" />
              <span className="hint">
                For free items this is the direct download. For paid items it&apos;s revealed after unlock. Set the
                link to &quot;anyone with link can view&quot;.
              </span>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Tags (comma separated)</label>
              <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="AR-15, lower, rail" />
            </div>
            <div className="field" style={{ justifyContent: 'flex-end' }}>
              <label className="check-row" style={{ marginBottom: 0 }}>
                <input type="checkbox" checked={form.active} onChange={set('active')} />
                <span>Visible on the store</span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : editing.id ? 'Save changes' : 'Add product'}
        </button>
      </form>
    </div>
  )
}
