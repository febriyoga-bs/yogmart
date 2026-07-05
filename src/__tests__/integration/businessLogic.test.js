import { describe, it, expect } from 'vitest'
import { SEED_PRODUCTS, SEED_CATEGORIES, STOCK_THRESHOLD_LOW } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'
import { productReducer, categoryReducer } from '../../utils/reducers'

// ─── Validasi Data Seed ───────────────────────────────────────────────────────
describe('Integritas data seed', () => {
  it('semua produk memiliki field wajib', () => {
    SEED_PRODUCTS.forEach((p) => {
      expect(p.id,          `${p.name}: id`).toBeTruthy()
      expect(p.name,        `${p.name}: name`).toBeTruthy()
      expect(p.barcode,     `${p.name}: barcode`).toBeTruthy()
      expect(typeof p.price, `${p.name}: price type`).toBe('number')
      expect(typeof p.stock, `${p.name}: stock type`).toBe('number')
      expect(p.unit,        `${p.name}: unit`).toBeTruthy()
    })
  })

  it('semua kategori memiliki field wajib', () => {
    SEED_CATEGORIES.forEach((c) => {
      expect(c.id).toBeTruthy()
      expect(c.name).toBeTruthy()
      expect(c.icon).toBeTruthy()
    })
  })

  it('semua category_id produk merujuk ke kategori yang ada', () => {
    const catIds = new Set(SEED_CATEGORIES.map((c) => c.id))
    SEED_PRODUCTS
      .filter((p) => p.category_id)
      .forEach((p) => expect(catIds.has(p.category_id), `${p.name}: category_id "${p.category_id}" tidak ada`).toBe(true))
  })

  it('semua harga non-negatif', () => {
    SEED_PRODUCTS.forEach((p) => expect(p.price).toBeGreaterThanOrEqual(0))
  })

  it('semua stok non-negatif', () => {
    SEED_PRODUCTS.forEach((p) => expect(p.stock).toBeGreaterThanOrEqual(0))
  })
})

// ─── Kalkulasi Statistik ──────────────────────────────────────────────────────
describe('Kalkulasi statistik toko', () => {
  it('nilai total stok dihitung dengan benar', () => {
    const total = SEED_PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0)
    expect(total).toBeGreaterThan(0)
    expect(typeof total).toBe('number')
    expect(isNaN(total)).toBe(false)
  })

  it('formatPrice pada nilai total menghasilkan string valid', () => {
    const total = SEED_PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0)
    const formatted = formatPrice(total)
    expect(typeof formatted).toBe('string')
    expect(formatted.length).toBeGreaterThan(0)
    expect(formatted).toContain('Rp')
  })

  it('deteksi produk stok menipis (< threshold)', () => {
    const low = SEED_PRODUCTS.filter((p) => p.stock < STOCK_THRESHOLD_LOW)
    expect(Array.isArray(low)).toBe(true)
    low.forEach((p) => expect(p.stock).toBeLessThan(STOCK_THRESHOLD_LOW))
  })

  it('deteksi produk stok habis (= 0)', () => {
    const out = SEED_PRODUCTS.filter((p) => p.stock === 0)
    expect(Array.isArray(out)).toBe(true)
    out.forEach((p) => expect(p.stock).toBe(0))
  })

  it('jumlah produk per kategori dihitung dengan benar', () => {
    SEED_CATEGORIES.forEach((cat) => {
      const count = SEED_PRODUCTS.filter((p) => p.category_id === cat.id).length
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })
})

// ─── Alur CRUD Produk ─────────────────────────────────────────────────────────
describe('Alur CRUD produk end-to-end', () => {
  it('add → update → delete menghasilkan state konsisten', () => {
    let state = [...SEED_PRODUCTS]

    // ADD
    state = productReducer(state, {
      type: 'ADD',
      payload: { name: 'Produk Test', barcode: '1234567890123', price: 5000, stock: 10, unit: 'buah' },
    })
    const newItem = state[0]
    expect(newItem.name).toBe('Produk Test')
    expect(state).toHaveLength(SEED_PRODUCTS.length + 1)

    // UPDATE
    state = productReducer(state, {
      type: 'UPDATE',
      payload: { ...newItem, price: 7500, stock: 20 },
    })
    const updated = state.find((p) => p.id === newItem.id)
    expect(updated.price).toBe(7500)
    expect(updated.stock).toBe(20)

    // DELETE
    state = productReducer(state, { type: 'DELETE', payload: newItem.id })
    expect(state).toHaveLength(SEED_PRODUCTS.length)
    expect(state.find((p) => p.id === newItem.id)).toBeUndefined()
  })

  it('multiple ADD menghasilkan ID unik semua', () => {
    let state = []
    for (let i = 0; i < 20; i++) {
      state = productReducer(state, {
        type: 'ADD',
        payload: { name: `Produk ${i}`, price: 1000, stock: 1 },
      })
    }
    const ids = state.map((p) => p.id)
    expect(new Set(ids).size).toBe(20)
  })
})

// ─── Alur CRUD Kategori ───────────────────────────────────────────────────────
describe('Alur CRUD kategori end-to-end', () => {
  it('add → update → delete menghasilkan state konsisten', () => {
    let state = [...SEED_CATEGORIES]

    // ADD
    state = categoryReducer(state, {
      type: 'ADD',
      payload: { name: 'Kategori Baru', icon: '🧪' },
    })
    expect(state).toHaveLength(SEED_CATEGORIES.length + 1)
    const newCat = state[state.length - 1]
    expect(newCat.name).toBe('Kategori Baru')

    // UPDATE
    state = categoryReducer(state, {
      type: 'UPDATE',
      payload: { ...newCat, name: 'Kategori Updated', icon: '🎯' },
    })
    const updated = state.find((c) => c.id === newCat.id)
    expect(updated.name).toBe('Kategori Updated')

    // DELETE
    state = categoryReducer(state, { type: 'DELETE', payload: newCat.id })
    expect(state).toHaveLength(SEED_CATEGORIES.length)
  })
})
