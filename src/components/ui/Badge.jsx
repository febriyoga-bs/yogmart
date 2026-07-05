import { useTheme } from '../../contexts/ThemeContext'

/**
 * Badge / chip kecil untuk label & status
 *
 * @param {'success'|'warning'|'danger'|'info'|'primary'|'neutral'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export function Badge({ variant = 'neutral', size = 'md', children }) {
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

  const sizes = {
    sm: { fontSize: 11, padding: '2px 8px' },
    md: { fontSize: 12, padding: '3px 10px' },
    lg: { fontSize: 14, padding: '5px 14px' },
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      borderRadius: 99, fontWeight: 700,
      ...(variants[variant] ?? variants.neutral),
      ...(sizes[size] ?? sizes.md),
    }}>
      {children}
    </span>
  )
}
