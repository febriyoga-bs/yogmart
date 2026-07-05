import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CATEGORY_ICONS } from '../../utils/constants'

/**
 * Form tambah / edit kategori
 * @param {{ id?, name, icon }} initial
 * @param {Function} onSave
 * @param {Function} onClose
 */
export function CategoryForm({ initial, onSave, onClose }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [form, setForm] = useState({ ...initial })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Nama Kategori *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Nama kategori"
      />

      {/* Icon picker */}
      <div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: C.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10,
        }}>
          Pilih Icon
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORY_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setForm({ ...form, icon })}
              style={{
                width: 40, height: 40, borderRadius: 8, fontSize: 20, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.15s',
                border: `2px solid ${form.icon === icon ? C.primary : C.border}`,
                background: form.icon === icon ? C.primaryAlpha : C.bgCard,
              }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="secondary" onClick={onClose} fullWidth>Batal</Button>
        <Button onClick={() => onSave(form)} disabled={!form.name.trim()} fullWidth>
          💾 Simpan
        </Button>
      </div>
    </div>
  )
}
