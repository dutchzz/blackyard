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
import Newsletter from '../components/Newsletter'
import AboutFaq from '../components/AboutFaq'
import CustomWork from '../components/CustomWork'
import LicenseTerms from '../components/LicenseTerms'

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
                <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
                  <h3>How paying works</h3>
                  <ol className="steps" style={{ margin: '6px 0 0', fontSize: '1rem' }}>
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
                  <p className="legal" style={{ marginTop: 16 }}>
                    <strong>Payment:</strong> CashApp only · {cashtag}
                  </p>
                  <a
                    className="btn btn-primary btn-block"
                    style={{ marginTop: 16 }}
                    href={cashLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Pay with CashApp
                  </a>
                </div>
              </div>
            </section>
          </LegalNotice>

          <Newsletter />
          <AboutFaq />
          <LicenseTerms />
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
