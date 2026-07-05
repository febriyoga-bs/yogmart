import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { validateProduct, isFormValid } from '../../utils/validators'
import { UNIT_OPTIONS } from '../../utils/constants'

/**
 * Modal form tambah / edit produk
 * @param {{ id?, name, barcode, price, stock, unit, category_id, description }} initial
 * @param {Array} categories
 * @param {Function} onSave - (formData) => void
 * @param {Function} onClose
 */
export function ProductFormModal({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState({ ...initial })
  const [errors, setErrors] = useState({})

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateProduct(form)
    setErrors(errs)
    if (!isFormValid(errs)) return
    onSave(form)
  }

  return (
    <Modal title={initial.id ? 'Edit Produk' : 'Tambah Produk'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input
          label="Nama Produk *"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Nama produk"
          error={errors.name}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input
            label="Barcode *"
            value={form.barcode}
            onChange={(e) => set('barcode', e.target.value)}
            placeholder="8991234567890"
            error={errors.barcode}
            style={{ fontFamily: 'monospace' }}
          />
          <Select
            label="Kategori"
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}>
            <option value="">-- Pilih --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </Select>

          <Input
            label="Harga (Rp) *"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="15000"
            error={errors.price}
          />
          <Input
            label="Stok"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            placeholder="100"
            error={errors.stock}
          />

          <Select
            label="Satuan *"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}>
            <option value="">-- Pilih --</option>
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Deskripsi"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Deskripsi singkat produk..."
        />

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <Button variant="secondary" onClick={onClose} fullWidth type="button">Batal</Button>
          <Button type="submit" fullWidth>💾 Simpan</Button>
        </div>
      </form>
    </Modal>
  )
}
