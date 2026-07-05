import { useTheme } from '../../contexts/ThemeContext'

/**
 * Garis pemisah horizontal dengan label opsional
 * @param {string} label - teks di tengah garis
 */
export function Divider({ label }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      {label && (
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  )
}
