import { useRef, useState } from 'react'
import { ImagePlus, Trash2, ExternalLink } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Modal } from '../ui/Modal'
import { Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { validateProduct, isFormValid } from '../../utils/validators'
import { UNIT_OPTIONS } from '../../utils/constants'
import { getProductImage } from '../../utils/productImage'
import { alfagiftSearchUrl } from '../../utils/alfagift'
import { formatDate } from '../../utils/formatters'

// Field yang dikirim ke backend (sisanya — image_url, updated_at, category_name, dst — hanya untuk tampilan)
const PAYLOAD_FIELDS = ['id', 'name', 'barcode', 'price', 'stock', 'unit', 'category_id', 'description', 'alfagift_price']

/**
 * Modal form tambah / edit produk
 * @param {{ id?, name, barcode, price, stock, unit, category_id, description }} initial
 * @param {Array} categories
 * @param {Function} onSave - (formData) => Promise | void
 * @param {Function} onClose
 */

export function ProductFormModal({ initial, categories, onSave, onClose }) {
  const { theme } = useTheme()
  const C = theme.colors
  const fileRef = useRef(null)
  // NUMERIC dari Postgres datang sebagai string "8000.00"
  const [form, setForm] = useState({
    ...initial,
    alfagift_price: initial.alfagift_price != null && initial.alfagift_price !== '' ? Number(initial.alfagift_price) : '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(getProductImage(initial))

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
    setRemoveImage(false)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setRemoveImage(true) // signal removal to backend on edit
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateProduct(form)
    setErrors((prev) => ({ ...prev, ...errs }))
    if (!isFormValid(errs)) return

    // Build multipart payload since an image file may be attached
    const formData = new FormData()
    PAYLOAD_FIELDS.forEach((key) => {
      const value = form[key]
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    if (imageFile) {
      formData.append('image', imageFile)
    } else if (removeImage) {
      // explicit removal flag for edit mode
      formData.append('remove_image', 'true')
    }

    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={initial.id ? 'Edit Produk' : 'Tambah Produk'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Image upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Pilih gambar produk"
            style={{
              width: 88, height: 88, borderRadius: 16, flexShrink: 0, cursor: 'pointer', overflow: 'hidden',
              border: `1.5px dashed ${errors.image ? C.danger : C.borderStrong}`,
              background: imagePreview ? '#fff' : C.bgMuted, color: C.textMuted,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
            {imagePreview ? (
              <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <>
                <ImagePlus size={24} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>Foto</span>
              </>
            )}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: C.textMuted }}>Gambar Produk</div>
            <div style={{ fontSize: 12, color: C.textLight }}>Ambil foto atau pilih dari galeri · maks 2MB</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                {imagePreview ? 'Ganti' : 'Pilih Gambar'}
              </Button>
              {imagePreview && (
                <Button type="button" variant="danger" size="sm" onClick={handleRemoveImage} icon={<Trash2 size={14} />}>
                  Hapus
                </Button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </div>
        {errors.image && <div style={{ color: C.danger, fontSize: 12, marginTop: -6 }}>{errors.image}</div>}

        <Input
          label="Nama Produk *"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Nama produk"
          error={errors.name}
          autoFocus={!initial.id && !!initial.barcode}
        />

        <div className="tk-form-grid">
          <Input
            label="Barcode *"
            value={form.barcode}
            onChange={(e) => set('barcode', e.target.value)}
            placeholder="8991234567890"
            inputMode="numeric"
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
            inputMode="numeric"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="15000"
            error={errors.price}
          />
          <Input
            label="Stok"
            type="number"
            inputMode="numeric"
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

        {/* Harga pembanding Alfagift (opsional, diisi manual) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Input
            label="Harga Alfagift (Rp)"
            type="number"
            inputMode="numeric"
            min="0"
            value={form.alfagift_price ?? ''}
            onChange={(e) => set('alfagift_price', e.target.value)}
            placeholder="Opsional — untuk perbandingan harga"
            helper={initial.alfagift_checked_at ? `Terakhir dicek ${formatDate(initial.alfagift_checked_at)}` : undefined}
          />
          <a
            href={alfagiftSearchUrl(form.name)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: C.primary, pointerEvents: form.name?.trim() ? 'auto' : 'none', opacity: form.name?.trim() ? 1 : 0.4 }}>
            Cek harga "{form.name?.trim() || 'nama produk'}" di Alfagift <ExternalLink size={14} />
          </a>
        </div>

        <Textarea
          label="Deskripsi"
          value={form.description ?? ''}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Deskripsi singkat produk..."
        />

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <Button variant="secondary" onClick={onClose} fullWidth type="button" size="lg">Batal</Button>
          <Button type="submit" fullWidth size="lg" loading={saving}>Simpan</Button>
        </div>
      </form>
    </Modal>
  )
}
