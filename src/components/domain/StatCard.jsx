import { useTheme } from '../../contexts/ThemeContext'
import { Card } from '../ui/Card'

/**
 * Kartu statistik untuk dashboard admin
 * @param {string} label
 * @param {string|number} value
 * @param {string} icon - emoji
 * @param {'success'|'warning'|'danger'|'info'|'primary'|'neutral'} variant
 */
export function StatCard({ label, value, icon, variant = 'neutral' }) {
  const { theme } = useTheme()
  const C = theme.colors

  const variants = {
    success: { bg: C.successBg, color: C.success },
    warning: { bg: C.warningBg, color: C.warning },
    danger:  { bg: C.dangerBg,  color: C.danger  },
    info:    { bg: C.infoBg,    color: C.info    },
    primary: { bg: C.primaryAlpha, color: C.primary },
    neutral: { bg: C.bgMuted,   color: C.textMuted },
  }

  const v = variants[variant] ?? variants.neutral

  return (
    <Card padding="sm" style={{ borderRadius: 16, padding: 'clamp(12px, 3vw, 18px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 700 }}>{label}</span>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: v.bg, color: v.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 'clamp(17px, 4.6vw, 24px)', fontWeight: 800, color: C.text, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </Card>
  )
}
