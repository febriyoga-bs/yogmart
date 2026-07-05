// ─── Formatters ───────────────────────────────────────────────────────────────
// Pure functions — no side effects, easily testable

/**
 * Format angka ke format Rupiah Indonesia
 * @param {number} amount
 * @returns {string} e.g. "Rp 75.000"
 */
export const formatPrice = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)

/**
 * Format angka ke format ribuan singkat
 * @param {number} num
 * @returns {string} e.g. 1500 → "1,5rb" | 2000000 → "2jt"
 */
export const formatShort = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '')}jt`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1).replace('.0', '')}rb`
  return String(num)
}

/**
 * Format tanggal ke locale Indonesia
 * @param {string|Date} date
 * @returns {string} e.g. "24 Januari 2024"
 */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

/**
 * Format tanggal + jam
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) =>
  new Date(date).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

/**
 * Generate ID unik (tidak bergantung library eksternal)
 * @param {string} prefix
 * @returns {string}
 */
export const generateId = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

/**
 * Singkat teks panjang dengan ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text ?? ''
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Capitalize huruf pertama tiap kata
 * @param {string} str
 * @returns {string}
 */
export const titleCase = (str) =>
  str?.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()) ?? ''
