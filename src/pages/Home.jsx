import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import Header from '../components/Header'
import LegalBanner from '../components/LegalBanner'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import ProductModal from '../components/ProductModal'
import PaymentModal from '../components/PaymentModal'
import LegalNotice from '../components/LegalNotice'
import AboutFaq from '../components/AboutFaq'
import CustomWork from '../components/CustomWork'
import { normalizeImageUrl } from '../utils/images'

export default function Home() {
  const { config, loading } = useStore()
  const [viewing, setViewing] = useState(null)
  const [buying, setBuying] = useState(null)

  const cashtag = config?.cashtag || '$CashApp'
  const cashLink = `https://cash.app/${cashtag.replace(/^\$/, '')}`
  const howToPay = (config?.paymentInstructions || '').replaceAll('{cashtag}', cashtag)

  return (
    <>
      <Header />
      <LegalBanner />
      <Hero />

      {loading ? (
        <div className="loading-wrap">
          <span className="spinner" />
        </div>
      ) : (
        <>
          <LegalNotice>
            <section className="section" id="files">
              <div className="container">
                <div className="section-head">
                  <div>
                    <h2>The files</h2>
                    <p className="section-sub">Curated STL files — most are free.</p>
                  </div>
                </div>
                <ProductGrid onSelect={setViewing} />
              </div>
            </section>

            <CustomWork />

            <section className="section" id="how" style={{ paddingTop: 0 }}>
              <div className="container">
                <div className="how-card">
                  <div className="how-visual">
                    {config?.howImage ? (
                      <img src={normalizeImageUrl(config.howImage)} alt="How paying works" />
                    ) : (
                      <div className="how-visual-fallback">
                        <span className="how-logo">$</span>
                        <span className="eyebrow">CashApp only</span>
                        <span className="cashtag">{cashtag}</span>
                      </div>
                    )}
                  </div>
                  <div className="how-content">
                    <span className="eyebrow">Payments</span>
                    <h2>{config?.howTitle || 'How paying works'}</h2>
                    {config?.howSubtitle && <p className="section-sub">{config.howSubtitle}</p>}
                    <ol className="steps" style={{ margin: '4px 0 0', fontSize: '0.98rem' }}>
                      {howToPay
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                    </ol>
                    {config?.fulfillmentNote && (
                      <p className="legal" style={{ marginTop: 16 }}>
                        <strong>Good to know: </strong>
                        {config.fulfillmentNote}
                      </p>
                    )}
                    <a
                      className="btn btn-primary"
                      href={cashLink}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {config?.howButtonText || 'Pay with CashApp'}
                    </a>
                    <p className="legal" style={{ marginTop: 16 }}>
                      <strong>Payment:</strong> CashApp only · {cashtag}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </LegalNotice>

          <AboutFaq />
        </>
      )}

      <Footer />

      {viewing && (
        <ProductModal
          product={viewing}
          onClose={() => setViewing(null)}
          onBuy={(p) => setBuying(p)}
        />
      )}
      {buying && <PaymentModal product={buying} onClose={() => setBuying(null)} />}
    </>
  )
}
