import { useTheme } from '../../contexts/ThemeContext'
import { THEMES } from '../../utils/constants'

/**
 * Tombol switcher tema Light / Dawn / Dark
 * Tersimpan otomatis ke localStorage via ThemeContext
 */
export function ThemeSwitcher() {
  const { themeName, setTheme, theme } = useTheme()
  const C = theme.colors

  return (
    <div style={{ display: 'flex', gap: 4, background: C.bgMuted, borderRadius: 12, padding: 4 }}>
      {Object.values(THEMES).map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          title={t.label}
          style={{
            padding: '6px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
            background: themeName === t.name ? C.bgCard : 'transparent',
            color:      themeName === t.name ? C.primary : C.textMuted,
            boxShadow:  themeName === t.name ? C.shadow : 'none',
          }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  )
}
