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
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initial.image_url || null)

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // basic validation
    const maxSizeMB = 2
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'File harus berupa gambar' }))
      return
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Ukuran gambar maksimal ${maxSizeMB}MB` }))
      return
    }

    setErrors((prev) => ({ ...prev, image: undefined }))
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    set('image_url', null) // signal removal to backend on edit
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateProduct(form)
    setErrors((prev) => ({ ...prev, ...errs }))
    if (!isFormValid(errs)) return

    // Build multipart payload since an image file may be attached
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    if (imageFile) {
      formData.append('image', imageFile)
    } else if (form.image_url === null) {
      // explicit removal flag for edit mode
      formData.append('remove_image', 'true')
    }

    console.log(formData)
    onSave(formData)
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

        {/* Image upload */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>
            Gambar Produk
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#fafafa',
                flexShrink: 0,
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 24 }}>img</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <Button type="button" variant="secondary" onClick={handleRemoveImage}>
                  Hapus Gambar
                </Button>
              )}
            </div>
          </div>
          {errors.image && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{errors.image}</div>}
        </div>

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