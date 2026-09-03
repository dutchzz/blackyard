import { useStore } from '../context/StoreContext'

export default function LicenseTerms() {
  const { config } = useStore()
  return (
    <section className="section" id="terms" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Terms</span>
            <h2>License &amp; use</h2>
          </div>
        </div>
        <div className="legal" style={{ marginTop: 0 }}>
          {config?.licenseText}
        </div>
        {config?.restrictionNote && (
          <div className="legal" style={{ marginTop: 14, borderLeftColor: 'var(--danger)' }}>
            <strong>Restrictions: </strong>
            {config.restrictionNote}
          </div>
        )}
      </div>
    </section>
  )
}
