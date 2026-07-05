import { useTheme } from '../../contexts/ThemeContext'
import { ThemeSwitcher } from './ThemeSwitcher'
import { NAV_ITEMS, APP_NAME } from '../../utils/constants'

/**
 * Navbar utama aplikasi
 * @param {string} page - halaman aktif
 * @param {Function} setPage
 */
export function Navbar({ page, setPage }) {
  const { theme } = useTheme()
  const C = theme.colors

  return (
    <nav style={{
      background: C.bgCard,
      borderBottom: `1px solid ${C.border}`,
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: `0 1px 12px rgba(0,0,0,${theme.name === 'dark' ? 0.4 : 0.05})`,
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 64, gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🛒</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.primary, lineHeight: 1.1 }}>{APP_NAME}</div>
            <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Katalog Digital</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                background: page === n.id ? C.primary : 'transparent',
                color:      page === n.id ? 'white'   : C.textMuted,
              }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>

        <ThemeSwitcher />
      </div>
    </nav>
  )
}
