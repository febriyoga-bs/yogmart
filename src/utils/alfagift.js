/**
 * Link hasil pencarian produk di Alfagift
 * @param {string} name - nama produk
 */
export const alfagiftSearchUrl = (name) =>
  `https://alfagift.id/find/${encodeURIComponent(String(name ?? '').trim())}`

/**
 * Bandingkan harga warung dengan harga Alfagift yang dicatat admin
 * @returns {{ diff: number, status: 'cheaper'|'pricier'|'same' } | null} null kalau belum ada harga pembanding
 */
export const compareWithAlfagift = (price, alfagiftPrice) => {
  if (alfagiftPrice === null || alfagiftPrice === undefined || alfagiftPrice === '') return null
  const diff = Number(alfagiftPrice) - Number(price)
  if (!Number.isFinite(diff)) return null
  return { diff: Math.abs(diff), status: diff > 0 ? 'cheaper' : diff < 0 ? 'pricier' : 'same' }
}
