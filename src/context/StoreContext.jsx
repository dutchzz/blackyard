import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from '../firebase'
import {
  DEFAULT_CONFIG,
  getSiteConfig,
  saveSiteConfig,
  listProducts,
  upsertProduct,
  deleteProduct,
  listCodes,
  addCode,
  deleteCode,
  redeemCode,
} from '../services/store'

const StoreContext = createContext(null)

/** Applies the site theme (from Firestore config) to CSS variables. */
function applyTheme(theme = {}) {
  const root = document.documentElement.style
  root.setProperty('--primary', theme.primaryColor || DEFAULT_CONFIG.theme.primaryColor)
  root.setProperty('--accent', theme.accentColor || DEFAULT_CONFIG.theme.accentColor)
  root.setProperty('--bg', theme.bgColor || DEFAULT_CONFIG.theme.bgColor)
  root.setProperty('--surface', theme.surfaceColor || DEFAULT_CONFIG.theme.surfaceColor)
  root.setProperty('--text', theme.textColor || DEFAULT_CONFIG.theme.textColor)
  root.setProperty('--muted', theme.mutedColor || DEFAULT_CONFIG.theme.mutedColor)
  root.setProperty('--border', theme.borderColor || DEFAULT_CONFIG.theme.borderColor)
}

export function StoreProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [products, setProducts] = useState([])
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [cfg, prods, cds] = await Promise.all([
        getSiteConfig(),
        listProducts(),
        listCodes(),
      ])
      setConfig(cfg)
      setProducts(prods)
      setCodes(cds)
      applyTheme(cfg.theme)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateConfig = useCallback(
    async (patch) => {
      const next = { ...(config || DEFAULT_CONFIG), ...patch }
      setConfig(next)
      applyTheme(next.theme)
      await saveSiteConfig(next)
      return next
    },
    [config],
  )

  const saveProduct = useCallback(async (product) => {
    const id = await upsertProduct(product)
    const saved = { ...product, id }
    setProducts((prev) =>
      prev.some((p) => p.id === id) ? prev.map((p) => (p.id === id ? saved : p)) : [...prev, saved],
    )
    return id
  }, [])

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const createCode = useCallback(async (code) => {
    const id = await addCode(code)
    setCodes((prev) => [...prev, { ...code, id }])
    return id
  }, [])

  const revokeCode = useCallback(async (id) => {
    await deleteCode(id)
    setCodes((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const redeem = useCallback((code, productId) => redeemCode(code, productId), [])

  const value = useMemo(
    () => ({
      config,
      products,
      codes,
      loading,
      error,
      firebaseOn: isFirebaseConfigured(),
      refresh,
      updateConfig,
      saveProduct,
      removeProduct,
      createCode,
      revokeCode,
      redeem,
    }),
    [config, products, codes, loading, error, refresh, updateConfig, saveProduct, removeProduct, createCode, revokeCode, redeem],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>')
  return ctx
}
