import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  formatShort,
  truncate,
  titleCase,
  generateId,
} from '../../utils/formatters'

// ─── formatPrice ──────────────────────────────────────────────────────────────
describe('formatPrice', () => {
  it('memformat angka ribuan dengan benar', () => {
    expect(formatPrice(75000)).toBe('Rp 75.000')
  })

  it('memformat nol', () => {
    expect(formatPrice(0)).toBe('Rp 0')
  })

  it('memformat jutaan', () => {
    expect(formatPrice(1500000)).toContain('1.500.000')
  })

  it('memformat angka kecil', () => {
    expect(formatPrice(500)).toBe('Rp 500')
  })

  it('tidak menampilkan desimal untuk bilangan bulat', () => {
    const result = formatPrice(10000)
    expect(result).not.toContain(',')
  })
})

// ─── formatShort ──────────────────────────────────────────────────────────────
describe('formatShort', () => {
  it('menampilkan ribuan sebagai rb', () => {
    expect(formatShort(5000)).toBe('5rb')
  })

  it('menampilkan jutaan sebagai jt', () => {
    expect(formatShort(2000000)).toBe('2jt')
  })

  it('menampilkan angka kecil apa adanya', () => {
    expect(formatShort(500)).toBe('500')
  })

  it('membulatkan desimal: 1500 → 1,5rb', () => {
    expect(formatShort(1500)).toBe('1,5rb')
  })

  it('tidak menampilkan .0 — 3000 → 3rb bukan 3.0rb', () => {
    expect(formatShort(3000)).toBe('3rb')
  })
})

// ─── truncate ─────────────────────────────────────────────────────────────────
describe('truncate', () => {
  it('tidak memotong teks yang lebih pendek dari maxLength', () => {
    expect(truncate('Halo', 10)).toBe('Halo')
  })

  it('memotong teks dan menambahkan ellipsis', () => {
    const result = truncate('Beras premium berkualitas tinggi', 10)
    expect(result).toHaveLength(11) // 10 + ellipsis char
    expect(result).toContain('…')
  })

  it('mengembalikan string kosong jika input null/undefined', () => {
    expect(truncate(null)).toBe('')
    expect(truncate(undefined)).toBe('')
  })

  it('mengembalikan teks penuh jika panjang persis sama', () => {
    expect(truncate('Halo', 4)).toBe('Halo')
  })
})

// ─── titleCase ────────────────────────────────────────────────────────────────
describe('titleCase', () => {
  it('mengkapitalisasi tiap kata', () => {
    expect(titleCase('beras premium')).toBe('Beras Premium')
  })

  it('mengubah huruf besar menjadi title case', () => {
    expect(titleCase('GULA PASIR')).toBe('Gula Pasir')
  })

  it('mengembalikan string kosong untuk input kosong', () => {
    expect(titleCase('')).toBe('')
    expect(titleCase(null)).toBe('')
  })
})

// ─── generateId ───────────────────────────────────────────────────────────────
describe('generateId', () => {
  it('menghasilkan string', () => {
    expect(typeof generateId()).toBe('string')
  })

  it('menggunakan prefix yang diberikan', () => {
    expect(generateId('prod')).toMatch(/^prod-/)
  })

  it('menghasilkan ID unik setiap kali dipanggil', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('menggunakan prefix default "id" jika tidak ada', () => {
    expect(generateId()).toMatch(/^id-/)
  })
})
