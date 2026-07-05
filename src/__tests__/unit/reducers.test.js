import { describe, it, expect } from 'vitest'
import { productReducer, categoryReducer } from '../../utils/reducers'

// ─── productReducer ───────────────────────────────────────────────────────────
describe('productReducer', () => {
  const initialState = [
    { id: 'p-1', name: 'Beras', price: 75000, stock: 50 },
    { id: 'p-2', name: 'Gula',  price: 14000, stock: 20 },
  ]

  describe('ADD', () => {
    it('menambahkan produk baru di awal array', () => {
      const next = productReducer(initialState, {
        type: 'ADD',
        payload: { name: 'Mie', price: 3500, stock: 100 },
      })
      expect(next).toHaveLength(3)
      expect(next[0].name).toBe('Mie')
    })

    it('menghasilkan ID unik otomatis', () => {
      const next = productReducer([], {
        type: 'ADD',
        payload: { name: 'Test' },
      })
      expect(next[0].id).toBeDefined()
      expect(typeof next[0].id).toBe('string')
    })

    it('menambahkan field created_at', () => {
      const next = productReducer([], {
        type: 'ADD',
        payload: { name: 'Test' },
      })
      expect(next[0].created_at).toBeDefined()
    })

    it('tidak mengubah state awal (immutable)', () => {
      const original = [...initialState]
      productReducer(initialState, { type: 'ADD', payload: { name: 'X' } })
      expect(initialState).toHaveLength(original.length)
    })
  })

  describe('UPDATE', () => {
    it('mengubah produk dengan id yang cocok', () => {
      const next = productReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'p-1', name: 'Beras Premium', price: 80000, stock: 45 },
      })
      const updated = next.find((p) => p.id === 'p-1')
      expect(updated.name).toBe('Beras Premium')
      expect(updated.price).toBe(80000)
    })

    it('tidak mengubah produk lain', () => {
      const next = productReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'p-1', name: 'Baru', price: 100, stock: 1 },
      })
      const unchanged = next.find((p) => p.id === 'p-2')
      expect(unchanged.name).toBe('Gula')
    })

    it('menambahkan field updated_at', () => {
      const next = productReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'p-1', name: 'Updated', price: 1, stock: 1 },
      })
      expect(next.find((p) => p.id === 'p-1').updated_at).toBeDefined()
    })

    it('tidak mengubah panjang array', () => {
      const next = productReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'p-1', name: 'X', price: 1, stock: 1 },
      })
      expect(next).toHaveLength(initialState.length)
    })
  })

  describe('DELETE', () => {
    it('menghapus produk dengan id yang cocok', () => {
      const next = productReducer(initialState, { type: 'DELETE', payload: 'p-1' })
      expect(next).toHaveLength(1)
      expect(next.find((p) => p.id === 'p-1')).toBeUndefined()
    })

    it('tidak menghapus produk lain', () => {
      const next = productReducer(initialState, { type: 'DELETE', payload: 'p-1' })
      expect(next[0].id).toBe('p-2')
    })

    it('tidak error jika id tidak ditemukan', () => {
      const next = productReducer(initialState, { type: 'DELETE', payload: 'not-exist' })
      expect(next).toHaveLength(2)
    })
  })

  describe('DEFAULT', () => {
    it('mengembalikan state yang sama untuk action tidak dikenal', () => {
      const next = productReducer(initialState, { type: 'UNKNOWN' })
      expect(next).toBe(initialState) // referensi sama
    })
  })
})

// ─── categoryReducer ──────────────────────────────────────────────────────────
describe('categoryReducer', () => {
  const initialState = [
    { id: 'cat-1', name: 'Sembako',    icon: '🌾' },
    { id: 'cat-2', name: 'Kebersihan', icon: '🧼' },
  ]

  describe('ADD', () => {
    it('menambahkan kategori baru di akhir array', () => {
      const next = categoryReducer(initialState, {
        type: 'ADD',
        payload: { name: 'Snack', icon: '🍿' },
      })
      expect(next).toHaveLength(3)
      expect(next[2].name).toBe('Snack')
    })

    it('menghasilkan ID unik otomatis', () => {
      const next = categoryReducer([], {
        type: 'ADD',
        payload: { name: 'Test', icon: '📦' },
      })
      expect(next[0].id).toBeDefined()
    })
  })

  describe('UPDATE', () => {
    it('mengubah kategori dengan id yang cocok', () => {
      const next = categoryReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'cat-1', name: 'Bahan Pokok', icon: '🛒' },
      })
      expect(next.find((c) => c.id === 'cat-1').name).toBe('Bahan Pokok')
    })

    it('tidak mengubah kategori lain', () => {
      const next = categoryReducer(initialState, {
        type: 'UPDATE',
        payload: { id: 'cat-1', name: 'X', icon: '📦' },
      })
      expect(next.find((c) => c.id === 'cat-2').name).toBe('Kebersihan')
    })
  })

  describe('DELETE', () => {
    it('menghapus kategori dengan id yang cocok', () => {
      const next = categoryReducer(initialState, { type: 'DELETE', payload: 'cat-1' })
      expect(next).toHaveLength(1)
      expect(next.find((c) => c.id === 'cat-1')).toBeUndefined()
    })
  })

  describe('DEFAULT', () => {
    it('mengembalikan state yang sama untuk action tidak dikenal', () => {
      const next = categoryReducer(initialState, { type: 'NOOP' })
      expect(next).toBe(initialState)
    })
  })
})
