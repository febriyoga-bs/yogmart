import { describe, it, expect } from 'vitest'
import { SEED_PRODUCTS } from '../../utils/constants'
import { isValidEAN13, isValidEAN8 } from '../../utils/validators'

// Fungsi lookup barcode
const findByBarcode = (products, barcode) =>
  products.find((p) => p.barcode === barcode) ?? null

// ─── Barcode Lookup ───────────────────────────────────────────────────────────
describe('Barcode lookup', () => {
  it('menemukan produk yang ada', () => {
    const target = SEED_PRODUCTS[0]
    const result = findByBarcode(SEED_PRODUCTS, target.barcode)
    expect(result).not.toBeNull()
    expect(result.id).toBe(target.id)
  })

  it('mengembalikan null untuk barcode tidak ada', () => {
    const result = findByBarcode(SEED_PRODUCTS, '0000000000000')
    expect(result).toBeNull()
  })

  it('barcode bersifat case-sensitive (hanya angka)', () => {
    const target = SEED_PRODUCTS[0]
    // barcode sama tapi tidak boleh ada spasi
    const result = findByBarcode(SEED_PRODUCTS, ` ${target.barcode}`)
    expect(result).toBeNull()
  })

  it('setiap barcode di seed data unik', () => {
    const barcodes = SEED_PRODUCTS.map((p) => p.barcode)
    const unique = new Set(barcodes)
    expect(unique.size).toBe(barcodes.length)
  })

  it('dapat lookup semua produk seed data berdasarkan barcode masing-masing', () => {
    SEED_PRODUCTS.forEach((p) => {
      const found = findByBarcode(SEED_PRODUCTS, p.barcode)
      expect(found).not.toBeNull()
      expect(found.id).toBe(p.id)
    })
  })
})

// ─── Barcode Format Validation ────────────────────────────────────────────────
describe('Validasi format barcode seed data', () => {
  it('semua barcode di seed data valid (EAN-13 atau EAN-8)', () => {
    SEED_PRODUCTS.forEach((p) => {
      const valid = isValidEAN13(p.barcode) || isValidEAN8(p.barcode)
      expect(valid, `Barcode "${p.barcode}" untuk produk "${p.name}" tidak valid`).toBe(true)
    })
  })

  it('tidak ada barcode yang kosong atau undefined', () => {
    SEED_PRODUCTS.forEach((p) => {
      expect(p.barcode).toBeTruthy()
      expect(typeof p.barcode).toBe('string')
    })
  })
})

// ─── Trim Handling ────────────────────────────────────────────────────────────
describe('Barcode lookup dengan trim', () => {
  it('hasil pencarian setelah trim() menemukan produk', () => {
    const target = SEED_PRODUCTS[0]
    const barcodeWithSpace = `  ${target.barcode}  `
    const result = findByBarcode(SEED_PRODUCTS, barcodeWithSpace.trim())
    expect(result).not.toBeNull()
  })
})
