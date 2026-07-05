import { useTheme } from '../../contexts/ThemeContext'

/**
 * State kosong dengan ilustrasi & pesan
 * @param {string} icon - emoji icon
 * @param {string} title
 * @param {string} description
 * @param {ReactNode} action - tombol/link aksi
 */
export function EmptyState({ icon = '📦', title, description, action }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', textAlign: 'center', gap: 12,
    }}>
      <div style={{ fontSize: 52, lineHeight: 1 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 14, color: C.textMuted, maxWidth: 300, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}
