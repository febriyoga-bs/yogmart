import { describe, it, expect } from 'vitest'
import {
  validateProduct,
  validateCategory,
  isFormValid,
  isValidEAN13,
  isValidEAN8,
  isValidPrice,
  isValidStock,
} from '../../utils/validators'

// ─── validateProduct ──────────────────────────────────────────────────────────
describe('validateProduct', () => {
  const validForm = {
    name: 'Beras Premium',
    barcode: '8991234567890',
    price: '75000',
    stock: '50',
    unit: 'karung',
  }

  it('tidak mengembalikan error untuk form valid', () => {
    expect(validateProduct(validForm)).toEqual({})
  })

  it('mengembalikan error jika nama kosong', () => {
    const errors = validateProduct({ ...validForm, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('mengembalikan error jika barcode kosong', () => {
    const errors = validateProduct({ ...validForm, barcode: '' })
    expect(errors.barcode).toBeDefined()
  })

  it('mengembalikan error jika barcode bukan angka', () => {
    const errors = validateProduct({ ...validForm, barcode: 'ABC123' })
    expect(errors.barcode).toBeDefined()
  })

  it('mengembalikan error jika barcode terlalu pendek (< 8 digit)', () => {
    const errors = validateProduct({ ...validForm, barcode: '123' })
    expect(errors.barcode).toBeDefined()
  })

  it('tidak error untuk barcode 8 digit (EAN-8)', () => {
    const errors = validateProduct({ ...validForm, barcode: '12345678' })
    expect(errors.barcode).toBeUndefined()
  })

  it('mengembalikan error jika harga bukan angka', () => {
    const errors = validateProduct({ ...validForm, price: 'abc' })
    expect(errors.price).toBeDefined()
  })

  it('mengembalikan error jika harga negatif', () => {
    const errors = validateProduct({ ...validForm, price: '-100' })
    expect(errors.price).toBeDefined()
  })

  it('tidak error untuk harga nol', () => {
    const errors = validateProduct({ ...validForm, price: '0' })
    expect(errors.price).toBeUndefined()
  })

  it('mengembalikan error jika satuan kosong', () => {
    const errors = validateProduct({ ...validForm, unit: '' })
    expect(errors.unit).toBeDefined()
  })

  it('mengembalikan 4 error untuk form kosong', () => {
    const errors = validateProduct({})
    expect(Object.keys(errors).length).toBe(4) // name, barcode, price, unit
  })
})

// ─── validateCategory ─────────────────────────────────────────────────────────
describe('validateCategory', () => {
  it('tidak mengembalikan error untuk form valid', () => {
    expect(validateCategory({ name: 'Sembako', icon: '🌾' })).toEqual({})
  })

  it('mengembalikan error jika nama kosong', () => {
    const errors = validateCategory({ name: '', icon: '📦' })
    expect(errors.name).toBeDefined()
  })

  it('mengembalikan error jika icon kosong', () => {
    const errors = validateCategory({ name: 'Test', icon: '' })
    expect(errors.icon).toBeDefined()
  })
})

// ─── isFormValid ──────────────────────────────────────────────────────────────
describe('isFormValid', () => {
  it('mengembalikan true jika errors kosong', () => {
    expect(isFormValid({})).toBe(true)
  })

  it('mengembalikan false jika ada error', () => {
    expect(isFormValid({ name: 'required' })).toBe(false)
  })
})

// ─── isValidEAN13 ─────────────────────────────────────────────────────────────
describe('isValidEAN13', () => {
  it('valid untuk 13 digit angka', () => {
    expect(isValidEAN13('8991234567890')).toBe(true)
  })

  it('tidak valid untuk kurang dari 13 digit', () => {
    expect(isValidEAN13('123456789012')).toBe(false)
  })

  it('tidak valid jika mengandung huruf', () => {
    expect(isValidEAN13('8991234567ABC')).toBe(false)
  })
})

// ─── isValidEAN8 ──────────────────────────────────────────────────────────────
describe('isValidEAN8', () => {
  it('valid untuk 8 digit angka', () => {
    expect(isValidEAN8('12345678')).toBe(true)
  })

  it('tidak valid untuk 7 digit', () => {
    expect(isValidEAN8('1234567')).toBe(false)
  })
})

// ─── isValidPrice ─────────────────────────────────────────────────────────────
describe('isValidPrice', () => {
  it('valid untuk angka positif', () => {
    expect(isValidPrice(5000)).toBe(true)
    expect(isValidPrice('5000')).toBe(true)
  })

  it('valid untuk nol', () => {
    expect(isValidPrice(0)).toBe(true)
  })

  it('tidak valid untuk negatif', () => {
    expect(isValidPrice(-100)).toBe(false)
  })

  it('tidak valid untuk string non-angka', () => {
    expect(isValidPrice('abc')).toBe(false)
  })
})

// ─── isValidStock ─────────────────────────────────────────────────────────────
describe('isValidStock', () => {
  it('valid untuk integer positif', () => {
    expect(isValidStock(50)).toBe(true)
    expect(isValidStock('50')).toBe(true)
  })

  it('valid untuk nol', () => {
    expect(isValidStock(0)).toBe(true)
  })

  it('tidak valid untuk float', () => {
    expect(isValidStock(1.5)).toBe(false)
  })

  it('tidak valid untuk negatif', () => {
    expect(isValidStock(-1)).toBe(false)
  })
})
