import { useStore } from '../context/StoreContext'

export default function AboutFaq() {
  const { config } = useStore()
  const faq = Array.isArray(config?.faq) ? config.faq : []

  return (
    <section className="section" id="about" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">About</span>
            <h2>{config?.aboutTitle || 'About this store'}</h2>
          </div>
        </div>

        <div className="about-faq">
          <div className="card">
            <p style={{ color: 'var(--muted)' }}>{config?.aboutText}</p>
          </div>

          {faq.length > 0 && (
            <div className="faq-list">
              <h3 style={{ marginBottom: 14 }}>FAQ</h3>
              {faq.map((item, i) => (
                <details key={i} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
