import { useState } from 'react'
import { useStore } from '../context/StoreContext'

/** Gates the catalog behind an 18+/legal-compliance acknowledgement. */
export default function LegalNotice({ children }) {
  const { config } = useStore()
  const [agreed, setAgreed] = useState(() => sessionStorage.getItem('by_consent') === '1')
  const [checked, setChecked] = useState(false)

  if (agreed) return children

  const legalText =
    config?.legalText ||
    'By continuing you confirm you are 18 or older and that use of these files is lawful in your jurisdiction.'

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h3>Before you browse</h3>
        <p className="section-sub" style={{ margin: '12px 0 20px' }}>
          {legalText}
        </p>
        <label className="check-row" style={{ justifyContent: 'center' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>I am 18 or older and confirm compliance with my local laws.</span>
        </label>
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={!checked}
          onClick={() => {
            sessionStorage.setItem('by_consent', '1')
            setAgreed(true)
          }}
        >
          Continue to files
        </button>
      </div>
    </div>
  )
}
