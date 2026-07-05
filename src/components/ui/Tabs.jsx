import { useTheme } from '../../contexts/ThemeContext'

/**
 * Tab navigation bar
 * @param {{ id: string, label: string, icon?: string }[]} tabs
 * @param {string} active - id tab aktif
 * @param {Function} onChange - (id: string) => void
 */
export function Tabs({ tabs, active, onChange }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: C.bgMuted, borderRadius: 12, padding: 4, width: 'fit-content',
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
            background: active === t.id ? C.bgCard : 'transparent',
            color:      active === t.id ? C.primary : C.textMuted,
            boxShadow:  active === t.id ? C.shadow : 'none',
          }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  )
}
