// ─── Validators ───────────────────────────────────────────────────────────────
// Pure validation functions — returns error strings or undefined

/**
 * Validasi form produk
 * @param {Object} form
 * @returns {Object} errors — key: field, value: pesan error
 */
export const validateProduct = (form) => {
  const errors = {}

  if (!form.name?.trim())
    errors.name = 'Nama produk wajib diisi'

  if (!form.barcode?.trim())
    errors.barcode = 'Barcode wajib diisi'
  else if (!/^\d{8,14}$/.test(form.barcode.trim()))
    errors.barcode = 'Barcode harus 8–14 digit angka'

  if (form.price === '' || form.price === undefined || form.price === null)
    errors.price = 'Harga wajib diisi'
  else if (isNaN(Number(form.price)) || Number(form.price) < 0)
    errors.price = 'Harga harus angka positif'

  if (form.stock !== '' && form.stock !== undefined && form.stock !== null) {
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errors.stock = 'Stok harus angka positif atau nol'
  }

  if (!form.unit?.trim())
    errors.unit = 'Satuan wajib diisi'

  return errors
}

/**
 * Validasi form kategori
 * @param {Object} form
 * @returns {Object} errors
 */
export const validateCategory = (form) => {
  const errors = {}
  if (!form.name?.trim())
    errors.name = 'Nama kategori wajib diisi'
  if (!form.icon?.trim())
    errors.icon = 'Icon wajib dipilih'
  return errors
}

/**
 * Cek apakah form valid (tidak ada error)
 * @param {Object} errors
 * @returns {boolean}
 */
export const isFormValid = (errors) =>
  Object.keys(errors).length === 0

/**
 * Validasi barcode format EAN-13
 * @param {string} barcode
 * @returns {boolean}
 */
export const isValidEAN13 = (barcode) =>
  /^\d{13}$/.test(barcode)

/**
 * Validasi barcode format EAN-8
 * @param {string} barcode
 * @returns {boolean}
 */
export const isValidEAN8 = (barcode) =>
  /^\d{8}$/.test(barcode)

/**
 * Validasi harga
 * @param {number|string} price
 * @returns {boolean}
 */
export const isValidPrice = (price) =>
  !isNaN(Number(price)) && Number(price) >= 0

/**
 * Validasi stok
 * @param {number|string} stock
 * @returns {boolean}
 */
export const isValidStock = (stock) =>
  !isNaN(Number(stock)) && Number(stock) >= 0 && Number.isInteger(Number(stock))
