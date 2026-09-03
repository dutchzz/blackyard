import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { DEFAULT_CONFIG } from '../../services/store'

export default function SettingsEditor() {
  const { config, updateConfig } = useStore()
  const [form, setForm] = useState(null)
  const [faqText, setFaqText] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  if (!form && config) {
    setForm({
      storeName: config.storeName ?? '',
      tagline: config.tagline ?? '',
      heroTitle: config.heroTitle ?? '',
      heroText: config.heroText ?? '',
      heroCta: config.heroCta ?? '',
      cashtag: config.cashtag ?? '',
      contactEmail: config.contactEmail ?? '',
      paymentInstructions: config.paymentInstructions ?? '',
      fulfillmentNote: config.fulfillmentNote ?? '',
      updatesBlurb: config.updatesBlurb ?? '',
      aboutTitle: config.aboutTitle ?? '',
      aboutText: config.aboutText ?? '',
      licenseText: config.licenseText ?? '',
      restrictionNote: config.restrictionNote ?? '',
      legalWarning: config.legalWarning ?? '',
      legalText: config.legalText ?? '',
      footerText: config.footerText ?? '',
      vercelDeployHook: config.vercelDeployHook ?? '',
      adminPasscode: config.adminPasscode ?? '',
      theme: { ...DEFAULT_CONFIG.theme, ...(config.theme || {}) },
    })
    setFaqText(
      (Array.isArray(config.faq) ? config.faq : [])
        .map((f) => `${f.q} | ${f.a}`)
        .join('\n'),
    )
    return null
  }

  if (!form) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setTheme = (key) => (e) =>
    setForm((f) => ({ ...f, theme: { ...f.theme, [key]: e.target.value } }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const faq = faqText
      .split('\n')
      .map((line) => {
        const [q, ...rest] = line.split('|')
        return { q: (q || '').trim(), a: rest.join('|').trim() }
      })
      .filter((f) => f.q && f.a)
    await updateConfig({ ...form, faq })
    setSaving(false)
    setSavedMsg('Settings saved. Changes are live.')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <form onSubmit={submit}>
      <div className="card">
        <h3>Branding &amp; hero</h3>
        <div className="form-grid">
          <div className="field">
            <label>Store name</label>
            <input value={form.storeName} onChange={set('storeName')} />
          </div>
          <div className="field">
            <label>Tagline</label>
            <input value={form.tagline} onChange={set('tagline')} />
          </div>
          <div className="field">
            <label>Hero title</label>
            <input value={form.heroTitle} onChange={set('heroTitle')} />
          </div>
          <div className="field">
            <label>Hero button text</label>
            <input value={form.heroCta} onChange={set('heroCta')} />
          </div>
        </div>
        <div className="field">
          <label>Hero text</label>
          <textarea value={form.heroText} onChange={set('heroText')} />
        </div>
      </div>

      <div className="card">
        <h3>CashApp &amp; contact</h3>
        <div className="form-grid">
          <div className="field">
            <label>Cashtag</label>
            <input value={form.cashtag} onChange={set('cashtag')} placeholder="$YourTag" />
          </div>
          <div className="field">
            <label>Contact email</label>
            <input value={form.contactEmail} onChange={set('contactEmail')} placeholder="you@example.com" />
          </div>
        </div>
        <div className="field">
          <label>Payment instructions (one step per line, use {'{cashtag}'} for your tag)</label>
          <textarea value={form.paymentInstructions} onChange={set('paymentInstructions')} style={{ minHeight: 130 }} />
        </div>
        <div className="field">
          <label>Fulfillment note (what buyers should expect after paying)</label>
          <textarea value={form.fulfillmentNote} onChange={set('fulfillmentNote')} style={{ minHeight: 60 }} />
        </div>
      </div>

      <div className="card">
        <h3>About &amp; updates</h3>
        <div className="field">
          <label>About heading</label>
          <input value={form.aboutTitle} onChange={set('aboutTitle')} />
        </div>
        <div className="field">
          <label>About text</label>
          <textarea value={form.aboutText} onChange={set('aboutText')} style={{ minHeight: 90 }} />
        </div>
        <div className="field">
          <label>Updates blurb (email capture section)</label>
          <textarea value={form.updatesBlurb} onChange={set('updatesBlurb')} style={{ minHeight: 60 }} />
        </div>
        <div className="field">
          <label>FAQ — one per line as {"Question | Answer"}</label>
          <textarea value={faqText} onChange={(e) => setFaqText(e.target.value)} style={{ minHeight: 150 }} />
          <span className="hint">Example: Are the files free? | Yes, most are free to download.</span>
        </div>
      </div>

      <div className="card">
        <h3>License &amp; restrictions</h3>
        <div className="field">
          <label>License / use terms</label>
          <textarea value={form.licenseText} onChange={set('licenseText')} style={{ minHeight: 110 }} />
        </div>
        <div className="field">
          <label>Restriction notice (shown in red)</label>
          <textarea value={form.restrictionNote} onChange={set('restrictionNote')} style={{ minHeight: 60 }} />
          <span className="hint">E.g. not offered in jurisdictions where the items are restricted.</span>
        </div>
      </div>

      <div className="card">
        <h3>Theme colors</h3>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {[
            ['primaryColor', 'Primary green'],
            ['accentColor', 'Accent'],
            ['bgColor', 'Background'],
            ['surfaceColor', 'Surface'],
            ['textColor', 'Text'],
            ['mutedColor', 'Muted text'],
            ['borderColor', 'Borders'],
          ].map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <input type="color" value={form.theme[key]} onChange={setTheme(key)} style={{ height: 44, padding: 4 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Legal &amp; footer</h3>
        <div className="field">
          <label>Top-of-page legal warning</label>
          <textarea value={form.legalWarning} onChange={set('legalWarning')} style={{ minHeight: 70 }} />
          <span className="hint">Shown in the thin bar at the very top of the site. Leave blank to hide it.</span>
        </div>
        <div className="field">
          <label>Legal / disclaimer text</label>
          <textarea value={form.legalText} onChange={set('legalText')} style={{ minHeight: 110 }} />
        </div>
        <div className="field">
          <label>Footer text</label>
          <input value={form.footerText} onChange={set('footerText')} />
        </div>
      </div>

      <div className="card">
        <h3>Deployment</h3>
        <div className="field">
          <label>Vercel deploy hook URL</label>
          <input value={form.vercelDeployHook} onChange={set('vercelDeployHook')} placeholder="https://api.vercel.com/v1/integrations/deploy/…" />
          <span className="hint">
            Used by the <strong>Deploy</strong> button in the admin top bar to ship the latest GitHub code.
            Create one in Vercel: Project → Settings → Git → Deploy Hooks → add a hook (e.g. name "admin") →
            copy the URL here.
          </span>
        </div>
      </div>

      <div className="card">
        <h3>Admin security</h3>
        <div className="field">
          <label>Admin passcode</label>
          <input value={form.adminPasscode} onChange={set('adminPasscode')} />
          <span className="hint">Used to unlock the /admin page. Pick something hard to guess.</span>
        </div>
      </div>

      {savedMsg && <div className="banner banner-info">{savedMsg}</div>}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save all settings'}
      </button>
    </form>
  )
}
