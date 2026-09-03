import { useStore } from '../context/StoreContext'

export default function CustomWork() {
  const { config } = useStore()
  const cashtag = config?.cashtag || '$CashApp'
  const cashLink = `https://cash.app/${cashtag.replace(/^\$/, '')}`

  return (
    <section className="section" id="custom" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Custom work</span>
          <h3 style={{ margin: '10px 0 8px' }}>{config?.customTitle || 'Need a custom file?'}</h3>
          <p className="section-sub" style={{ marginBottom: 20 }}>{config?.customText}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {config?.contactEmail && (
              <a
                className="btn btn-ghost"
                href={`mailto:${config.contactEmail}?subject=${encodeURIComponent('Custom file request')}`}
              >
                Email your idea
              </a>
            )}
            <a className="btn btn-primary" href={cashLink} target="_blank" rel="noreferrer noopener">
              Pay via CashApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
