import { useTheme } from '../../contexts/ThemeContext'

/**
 * Pill button untuk filter kategori
 * @param {string} label
 * @param {string} icon - emoji icon
 * @param {boolean} active
 * @param {Function} onClick
 */
export function FilterPill({ label, icon, active, onClick }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 99, fontFamily: 'inherit', flexShrink: 0,
        border: `1.5px solid ${active ? C.primary : C.border}`,
        background: active ? C.primary : C.bgCard,
        color: active ? '#fff' : C.text,
        boxShadow: active ? `0 4px 12px ${C.primary}33` : 'none',
        fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.2s',
      }}>
      {icon} {label}
    </button>
  )
}
