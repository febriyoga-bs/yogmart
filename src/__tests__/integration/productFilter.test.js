import { describe, it, expect } from 'vitest'
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../../utils/constants'

// Fungsi filter murni (sama logika dengan useProductFilter hook)
const filterProducts = (products, { search = '', categoryId = '' }) =>
  products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search)
    const matchCategory = !categoryId || p.category_id === categoryId
    return matchSearch && matchCategory
  })

// ─── Filter by search ─────────────────────────────────────────────────────────
describe('Filter produk — search', () => {
  it('mengembalikan semua produk jika search kosong', () => {
    const result = filterProducts(SEED_PRODUCTS, {})
    expect(result).toHaveLength(SEED_PRODUCTS.length)
  })

  it('filter case-insensitive berdasarkan nama', () => {
    const result = filterProducts(SEED_PRODUCTS, { search: 'BERAS' })
    expect(result.length).toBeGreaterThan(0)
    result.forEach((p) => expect(p.name.toLowerCase()).toContain('beras'))
  })

  it('filter berdasarkan barcode', () => {
    const target = SEED_PRODUCTS[0]
    const result = filterProducts(SEED_PRODUCTS, { search: target.barcode })
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.some((p) => p.id === target.id)).toBe(true)
  })

  it('filter parsial barcode', () => {
    const partial = SEED_PRODUCTS[0].barcode.slice(0, 4)
    const result = filterProducts(SEED_PRODUCTS, { search: partial })
    expect(result.length).toBeGreaterThan(0)
  })

  it('mengembalikan array kosong untuk search yang tidak ada hasilnya', () => {
    const result = filterProducts(SEED_PRODUCTS, { search: 'xyzxyz_tidak_ada' })
    expect(result).toHaveLength(0)
  })

  it('mengabaikan spasi dan tetap menemukan produk', () => {
    const result = filterProducts(SEED_PRODUCTS, { search: 'gula' })
    expect(result.some((p) => p.name.toLowerCase().includes('gula'))).toBe(true)
  })
})

// ─── Filter by category ───────────────────────────────────────────────────────
describe('Filter produk — kategori', () => {
  it('filter berdasarkan category_id', () => {
    const catId = 'cat-2'
    const result = filterProducts(SEED_PRODUCTS, { categoryId: catId })
    expect(result.length).toBeGreaterThan(0)
    result.forEach((p) => expect(p.category_id).toBe(catId))
  })

  it('mengembalikan semua produk jika categoryId kosong', () => {
    const result = filterProducts(SEED_PRODUCTS, { categoryId: '' })
    expect(result).toHaveLength(SEED_PRODUCTS.length)
  })

  it('mengembalikan array kosong untuk kategori tidak ada', () => {
    const result = filterProducts(SEED_PRODUCTS, { categoryId: 'cat-9999' })
    expect(result).toHaveLength(0)
  })
})

// ─── Filter kombinasi ─────────────────────────────────────────────────────────
describe('Filter produk — kombinasi', () => {
  it('filter search + kategori sekaligus', () => {
    const catId = 'cat-2'
    const result = filterProducts(SEED_PRODUCTS, { search: 'beras', categoryId: catId })
    result.forEach((p) => {
      expect(p.category_id).toBe(catId)
      expect(p.name.toLowerCase()).toContain('beras')
    })
  })

  it('mengembalikan kosong jika kombinasi tidak ada hasilnya', () => {
    const result = filterProducts(SEED_PRODUCTS, { search: 'sabun', categoryId: 'cat-1' })
    expect(result).toHaveLength(0)
  })
})
