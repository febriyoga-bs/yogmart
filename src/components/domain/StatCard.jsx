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
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>{label}</span>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: v.bg, color: v.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{value}</div>
    </Card>
  )
}
