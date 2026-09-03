import { isFirebaseConfigured, db } from '../firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { isLikelyFakeEmail } from '../utils/email'

/* =========================================================
   DEFAULT / SEED DATA
   Used both as a fallback when Firebase is not configured and
   as the initial site content.
   ========================================================= */

export const DEFAULT_CONFIG = {
  storeName: 'BLACKYARD',
  tagline: '3D STL print files · Legal firearm components',
  heroTitle: 'Print your own parts.',
  heroText:
    'BLACKYARD is a small, curated catalog of STL files for legal 3D-printed firearm components. Most files are free — paid files ship for under $10 and are paid via CashApp.',
  heroCta: 'Browse the files',
  cashtag: '$BlackYard',
  contactEmail: 'blackyard@example.com',
  paymentInstructions:
    '1) Open CashApp and send the exact amount to {cashtag}. 2) Add an order note so we can match your payment. 3) We verify the payment and reply with your unlock code. 4) Enter the code below to unlock your download.',
  theme: {
    primaryColor: '#00c244',
    accentColor: '#00d632',
    bgColor: '#0a0a0a',
    surfaceColor: '#141414',
    textColor: '#f5f5f5',
    mutedColor: '#9aa0a6',
    borderColor: '#2a2a2a',
  },
  legalWarning:
    'LEGAL NOTICE: All files are for lawful use only. By browsing or downloading you confirm you are 18 or older and that possessing, printing, and using these files is legal in your jurisdiction. You are responsible for complying with all applicable local, state, and federal laws.',
  legalText:
    'All files are for legal use only. By downloading you confirm that you are 18 or older and that possessing, printing, and using these files is lawful in your jurisdiction. You are solely responsible for compliance with all applicable local, state, and federal laws.',
  restrictionNote:
    'Not offered in jurisdictions where these items are regulated or restricted. You are responsible for knowing and following the law where you live.',
  fulfillmentNote:
    'Paid downloads: your unlock code is sent within 24 hours after your CashApp payment is verified.',
  aboutTitle: 'About BLACKYARD REPO',
  aboutText:
    'BLACKYARD REPO is a small, curated open catalog of STL files for legal 3D-printed components. Most files are free to download. Files are added in versions, so check back and follow along as the catalog grows.',
  faq: [
    {
      q: 'Are the files free?',
      a: 'Most of the catalog is free to download. Any paid files are under a simple CashApp purchase and are clearly marked.',
    },
    {
      q: 'How do I download a file?',
      a: 'Click any file card to open it, then hit Download. Free files download straight away.',
    },
    {
      q: 'How do paid files work?',
      a: 'Paid files are bought via CashApp. After your payment is verified you receive an unlock code, which you enter on the product page to reveal the download.',
    },
    {
      q: 'Can I remix or share these files?',
      a: 'Check the license terms below. In general, files are for personal, lawful use; ask before redistributing a remix based on someone else\u2019s work.',
    },
    {
      q: 'Is this legal?',
      a: 'We only offer files for lawful components. By using the site you confirm you are 18+ and comply with all applicable laws in your jurisdiction.',
    },
  ],
  licenseText:
    'Unless stated on a specific product, files on this store are offered for personal, lawful use. You may download, print, and modify files for your own use. Do not resell the files themselves or redistribute them without permission. If a file credits another designer or pack (for example FOSSCANNON), you must respect that original creator\u2019s license before sharing any derivative work.',
  updatesBlurb:
    'New files drop regularly. Leave your email to get notified when the catalog updates. No spam, unsubscribe anytime.',
  footerText: '© 2026 BLACKYARD. All rights reserved.',
  vercelDeployHook: '',
  adminPasscode: 'blackyard',
}

export const SEED_PRODUCTS = [
  {
    id: 'p_sample_lower',
    name: 'AR-15 Lower Receiver (Sample)',
    category: 'Lower Receivers',
    description:
      'Placeholder product — replace this with your real catalog entry. STL file ready for printing in legal configurations.',
    price: 0,
    imageUrl: '',
    stlUrl: '',
    filesize: '—',
    tags: ['AR-15', 'lower', 'sample'],
    active: true,
    sortOrder: 0,
    createdAt: Date.now(),
  },
  {
    id: 'p_sample_frame',
    name: 'Pistol Frame (Sample)',
    category: 'Frames',
    description:
      'Placeholder product — replace this with your real catalog entry. Paid example so you can test the CashApp + unlock flow.',
    price: 5.0,
    imageUrl: '',
    stlUrl: '',
    filesize: '—',
    tags: ['pistol', 'frame', 'sample'],
    active: true,
    sortOrder: 1,
    createdAt: Date.now(),
  },
  {
    id: 'p_sample_grip',
    name: 'Ergonomic Grip (Sample)',
    category: 'Accessories',
    description:
      'Placeholder product — replace this with your real catalog entry. Free download example.',
    price: 0,
    imageUrl: '',
    stlUrl: '',
    filesize: '—',
    tags: ['grip', 'sample'],
    active: true,
    sortOrder: 2,
    createdAt: Date.now(),
  },
]

export const SEED_CODES = []

/* =========================================================
   LOCAL (demo) BACKEND — persists to localStorage
   ========================================================= */

const LS_PRODUCTS = 'by_products'
const LS_CONFIG = 'by_config'
const LS_CODES = 'by_codes'
const LS_SUBS = 'by_subscribers'

const readLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota errors */
  }
}

const ensureSeeded = () => {
  if (!localStorage.getItem(LS_CONFIG)) writeLS(LS_CONFIG, DEFAULT_CONFIG)
  if (!localStorage.getItem(LS_PRODUCTS)) writeLS(LS_PRODUCTS, SEED_PRODUCTS)
  if (!localStorage.getItem(LS_CODES)) writeLS(LS_CODES, SEED_CODES)
}

const local = {
  getSiteConfig: async () => {
    ensureSeeded()
    return readLS(LS_CONFIG, DEFAULT_CONFIG)
  },
  saveSiteConfig: async (config) => {
    ensureSeeded()
    writeLS(LS_CONFIG, config)
  },
  listProducts: async () => {
    ensureSeeded()
    const list = readLS(LS_PRODUCTS, SEED_PRODUCTS)
    return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  },
  upsertProduct: async (product) => {
    ensureSeeded()
    const list = readLS(LS_PRODUCTS, SEED_PRODUCTS)
    const id = product.id || `p_${Date.now()}`
    const next = { ...product, id }
    const exists = list.some((p) => p.id === id)
    writeLS(LS_PRODUCTS, exists ? list.map((p) => (p.id === id ? next : p)) : [...list, next])
    return id
  },
  deleteProduct: async (id) => {
    ensureSeeded()
    writeLS(LS_PRODUCTS, readLS(LS_PRODUCTS, SEED_PRODUCTS).filter((p) => p.id !== id))
  },
  listCodes: async () => {
    ensureSeeded()
    return readLS(LS_CODES, SEED_CODES)
  },
  addCode: async (code) => {
    ensureSeeded()
    const list = readLS(LS_CODES, SEED_CODES)
    const id = code.id || `c_${Date.now()}`
    writeLS(LS_CODES, [...list, { ...code, id }])
    return id
  },
  deleteCode: async (id) => {
    ensureSeeded()
    writeLS(LS_CODES, readLS(LS_CODES, SEED_CODES).filter((c) => c.id !== id))
  },
  redeemCode: async (code, productId) => {
    ensureSeeded()
    const list = readLS(LS_CODES, SEED_CODES)
    const match = list.find(
      (c) =>
        String(c.code || '').toUpperCase() === String(code || '').trim().toUpperCase() &&
        c.productId === productId &&
        !c.used,
    )
    if (!match) return { ok: false, error: 'Invalid, expired, or already used code.' }
    const updated = list.map((c) =>
      c.id === match.id ? { ...c, used: true, usedAt: Date.now() } : c,
    )
    writeLS(LS_CODES, updated)
    return { ok: true, code: { ...match, used: true } }
  },
  listSubscribers: async () => {
    ensureSeeded()
    return readLS(LS_SUBS, [])
  },
  addSubscriber: async (email) => {
    ensureSeeded()
    const list = readLS(LS_SUBS, [])
    const lower = String(email || '').trim().toLowerCase()
    if (isLikelyFakeEmail(lower)) return { ok: false, error: 'Please use a real email address.' }
    if (list.some((s) => s.email === lower)) return { ok: false, error: 'Already subscribed.' }
    const entry = { id: `s_${Date.now()}`, email: lower, createdAt: Date.now() }
    writeLS(LS_SUBS, [...list, entry])
    return { ok: true }
  },
  deleteSubscriber: async (id) => {
    ensureSeeded()
    writeLS(LS_SUBS, readLS(LS_SUBS, []).filter((s) => s.id !== id))
  },
}

/* =========================================================
   FIRESTORE BACKEND
   ========================================================= */

const fb = {
  getSiteConfig: async () => {
    const snap = await getDoc(doc(db, 'config', 'site'))
    // Merge defaults so newly added fields (e.g. legalWarning) appear
    // even if the stored config predates them.
    return snap.exists() ? { ...DEFAULT_CONFIG, ...snap.data() } : DEFAULT_CONFIG
  },
  saveSiteConfig: async (config) => {
    await setDoc(doc(db, 'config', 'site'), config)
  },
  listProducts: async () => {
    const q = query(collection(db, 'products'), orderBy('sortOrder', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  },
  upsertProduct: async (product) => {
    const { id, ...data } = product
    if (id) {
      await setDoc(doc(db, 'products', id), data, { merge: true })
      return id
    }
    const ref = await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
    return ref.id
  },
  deleteProduct: async (id) => {
    await deleteDoc(doc(db, 'products', id))
  },
  listCodes: async () => {
    const snap = await getDocs(collection(db, 'codes'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  },
  addCode: async (code) => {
    const ref = await addDoc(collection(db, 'codes'), { ...code, createdAt: serverTimestamp() })
    return ref.id
  },
  deleteCode: async (id) => {
    await deleteDoc(doc(db, 'codes', id))
  },
  redeemCode: async (code, productId) => {
    const q = query(
      collection(db, 'codes'),
      where('code', '==', String(code || '').trim().toUpperCase()),
      where('productId', '==', productId),
      where('used', '==', false),
    )
    const snap = await getDocs(q)
    if (snap.empty) return { ok: false, error: 'Invalid, expired, or already used code.' }
    const d = snap.docs[0]
    await updateDoc(d.ref, { used: true, usedAt: serverTimestamp() })
    return { ok: true, code: { id: d.id, ...d.data(), used: true } }
  },
  listSubscribers: async () => {
    const snap = await getDocs(collection(db, 'subscribers'))
    return snap.docs.map((d) => ({ id: d.id, email: d.data().email, createdAt: d.data().createdAt }))
  },
  addSubscriber: async (email) => {
    const lower = String(email || '').trim().toLowerCase()
    if (isLikelyFakeEmail(lower)) return { ok: false, error: 'Please use a real email address.' }
    const existing = await getDocs(query(collection(db, 'subscribers'), where('email', '==', lower)))
    if (!existing.empty) return { ok: false, error: 'Already subscribed.' }
    await addDoc(collection(db, 'subscribers'), { email: lower, createdAt: serverTimestamp() })
    return { ok: true }
  },
  deleteSubscriber: async (id) => {
    await deleteDoc(doc(db, 'subscribers', id))
  },
}

/* =========================================================
   PUBLIC API (auto-selects backend)
   ========================================================= */

const active = isFirebaseConfigured() ? fb : local

export const getSiteConfig = active.getSiteConfig
export const saveSiteConfig = active.saveSiteConfig
export const listProducts = active.listProducts
export const upsertProduct = active.upsertProduct
export const deleteProduct = active.deleteProduct
export const listCodes = active.listCodes
export const addCode = active.addCode
export const deleteCode = active.deleteCode
export const redeemCode = active.redeemCode
export const listSubscribers = active.listSubscribers
export const addSubscriber = active.addSubscriber
export const deleteSubscriber = active.deleteSubscriber
