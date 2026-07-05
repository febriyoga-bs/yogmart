import { useState } from 'react'
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
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 16, color: C.textMuted, pointerEvents: 'none',
      }}>🔍</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 40px 10px 40px',
          borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
          background: C.bgCard, color: C.text,
          border: `1.5px solid ${focused ? C.primary : C.border}`,
          outline: 'none', transition: 'border-color 0.2s',
          boxShadow: focused ? `0 0 0 3px ${C.primaryAlpha}` : 'none',
        }}
      />

      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            border: 'none', background: 'none', cursor: 'pointer',
            color: C.textMuted, fontSize: 18, lineHeight: 1, padding: 2,
          }}>
          ×
        </button>
      )}
    </div>
  )
}
