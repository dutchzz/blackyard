import { useStore } from '../context/StoreContext'

export default function Hero() {
  const { config } = useStore()
  if (!config) return null

  const { heroTitle, heroText, heroCta, tagline, storeName } = config
  const words = (heroTitle || '').trim().split(/\s+/)
  const rest = words.length > 2 ? words.slice(0, -2).join(' ') : ''
  const highlight = words.length > 2 ? words.slice(-2).join(' ') : words.join(' ')

  return (
    <section className="hero">
      <div className="container">
        <span className="hero-tag">
          <span className="dot" />
          {tagline || `${storeName} · STL files`}
        </span>
        <h1>
          {rest && <>{rest} </>}
          <span className="green">{highlight}</span>
        </h1>
        <p>{heroText}</p>
        <a href="#files" className="btn btn-primary btn-lg">
          {heroCta || 'Browse the files'}
        </a>
      </div>
    </section>
  )
}
