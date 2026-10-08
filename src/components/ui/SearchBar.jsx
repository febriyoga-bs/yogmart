import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * Search input dengan clear button
 * @param {string} value
 * @param {Function} onChange - (value: string) => void
 * @param {string} placeholder
 */
export function SearchBar({ value, onChange, placeholder = 'Cari...' }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Search size={18} style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: C.textMuted, pointerEvents: 'none',
      }} />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 46, padding: '0 42px 0 42px',
          borderRadius: 14, fontSize: 15, fontFamily: 'inherit',
          background: C.bgCard, color: C.text,
          border: `1.5px solid ${focused ? C.primary : C.border}`,
          outline: 'none', transition: 'border-color 0.2s',
          boxShadow: focused ? `0 0 0 3px ${C.primaryAlpha}` : 'none',
        }}
      />

      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            width: 30, height: 30, borderRadius: '50%',
            border: 'none', background: C.bgMuted, cursor: 'pointer',
            color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <X size={16} />
        </button>
      )}
    </div>
  )
}
