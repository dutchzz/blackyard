import { useStore } from '../context/StoreContext'

/** Slim legal-warning strip shown at the very top of the page. */
export default function LegalBanner() {
  const { config } = useStore()
  const text = config?.legalWarning
  if (!text) return null

  return (
    <div className="legal-topbar" role="note">
      {text}
    </div>
  )
}
