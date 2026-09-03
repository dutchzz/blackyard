/**
 * Normalizes a product's images into an array of clean, de-duplicated URLs.
 * Handles legacy data where multiple URLs were pasted into a single
 * `imageUrl` field separated by commas or newlines, plus the newer
 * `images` array. Products saved through the admin store both `images`
 * and `imageUrl` (== images[0]), so identical URLs are de-duplicated here
 * to avoid showing the same image twice.
 */
export function parseProductImages(product) {
  const raw = []
  if (Array.isArray(product.images)) raw.push(...product.images)
  if (product.imageUrl) raw.push(product.imageUrl)

  const seen = new Set()
  const result = []
  for (const s of raw.flatMap((s) => String(s || '').split(/[,\n]/))) {
    const url = normalizeImageUrl(s.trim())
    if (!url) continue
    const key = url.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(url)
  }
  return result
}

/** Returns the first image URL for a product (for card thumbnails). */
export function productCover(product) {
  return parseProductImages(product)[0] || ''
}

/**
 * Converts a Dropbox "dl=0" share link to a raw inline link ("raw=1")
 * so images render directly in <img> tags instead of a preview page.
 */
export function normalizeImageUrl(url) {
  if (!url || !url.includes('dropbox.com') || !url.includes('dl=0')) return url
  return url.replace('dl=0', 'raw=1')
}

/**
 * Converts a Dropbox "dl=0" share link to a download link ("dl=1")
 * so STL files download instead of opening a preview page.
 */
export function toDownloadUrl(url) {
  if (!url || !url.includes('dropbox.com') || !url.includes('dl=0')) return url
  return url.replace('dl=0', 'dl=1')
}
