/**
 * Normalizes a product's images into an array of clean URLs.
 * Handles legacy data where multiple URLs were pasted into a single
 * `imageUrl` field separated by commas or newlines, plus the newer
 * `images` array.
 */
export function parseProductImages(product) {
  const raw = []
  if (Array.isArray(product.images)) raw.push(...product.images)
  if (product.imageUrl) raw.push(product.imageUrl)
  return raw
    .flatMap((s) => String(s || '').split(/[,\n]/))
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeImageUrl)
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
