import { useTheme } from '../../contexts/ThemeContext'
import { THEMES } from '../../utils/constants'

/**
 * Tombol switcher tema Light / Dawn / Dark
 * Tersimpan otomatis ke localStorage via ThemeContext
 *
 * @param {boolean} compact - satu tombol ikon yang berganti tema tiap ditekan (untuk mobile)
 */
export function ThemeSwitcher({ compact = false }) {
  const { themeName, setTheme, theme } = useTheme()
  const C = theme.colors
  const themes = Object.values(THEMES)

  if (compact) {
    const next = themes[(themes.findIndex((t) => t.name === themeName) + 1) % themes.length]
    return (
      <button
        onClick={() => setTheme(next.name)}
        aria-label={`Ganti tema ke ${next.label}`}
        title={`Tema: ${theme.label}`}
        style={{
          width: 40, height: 40, borderRadius: 12, border: `1px solid ${C.border}`,
          background: C.bgMuted, cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
        {theme.icon}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 2, background: C.bgMuted, borderRadius: 12, padding: 3 }}>
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          title={t.label}
          aria-label={`Tema ${t.label}`}
          style={{
            width: 34, height: 34, borderRadius: 9, border: 'none', cursor: 'pointer',
            fontSize: 16, transition: 'all 0.2s',
            background: themeName === t.name ? C.bgCard : 'transparent',
            boxShadow: themeName === t.name ? C.shadow : 'none',
            opacity: themeName === t.name ? 1 : 0.6,
          }}>
          {t.icon}
        </button>
      ))}
    </div>
  )
}
