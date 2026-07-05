import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Spinner } from './Spinner'

/**
 * Tombol serbaguna dengan berbagai variant & ukuran
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'|'accent'} variant
 * @param {'xs'|'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth - apakah tombol memenuhi lebar container
 * @param {boolean} loading - tampilkan spinner & disable
 * @param {ReactNode} icon - ikon sebelum label
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  fullWidth,
  type = 'button',
  style = {},
  icon,
  loading,
}) {
  const { theme } = useTheme()
  const C = theme.colors
  const [hovered, setHovered] = useState(false)

  const variants = {
    primary:   { bg: C.primary,    color: '#fff',        border: 'none',                          hoverBg: C.primaryLight },
    secondary: { bg: C.bgMuted,    color: C.text,        border: `1.5px solid ${C.border}`,       hoverBg: C.bgHover     },
    ghost:     { bg: 'transparent', color: C.textMuted,  border: 'none',                          hoverBg: C.bgMuted     },
    danger:    { bg: C.dangerBg,   color: C.danger,      border: `1.5px solid ${C.danger}20`,     hoverBg: C.danger, hoverColor: '#fff' },
    accent:    { bg: C.accent,     color: '#fff',        border: 'none',                          hoverBg: C.accentLight },
  }

  const sizes = {
    xs: { padding: '4px 10px',   fontSize: 12, radius: 6,  gap: 4  },
    sm: { padding: '6px 14px',   fontSize: 13, radius: 8,  gap: 6  },
    md: { padding: '10px 20px',  fontSize: 14, radius: 10, gap: 8  },
    lg: { padding: '14px 28px',  fontSize: 16, radius: 12, gap: 10 },
  }

  const v = variants[variant] ?? variants.primary
  const s = sizes[size] ?? sizes.md
  const isActive = hovered && !disabled && !loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap, padding: s.padding, fontSize: s.fontSize, borderRadius: s.radius,
        border: v.border ?? 'none', fontFamily: 'inherit', fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : 'auto',
        background: isActive && v.hoverBg ? v.hoverBg : v.bg,
        color:      isActive && v.hoverColor ? v.hoverColor : v.color,
        transform:  isActive ? 'translateY(-1px)' : 'none',
        boxShadow:  isActive ? `0 4px 12px ${C.primaryAlpha}` : 'none',
        ...style,
      }}>
      {loading ? <Spinner size={s.fontSize} color={v.color} /> : icon}
      {children}
    </button>
  )
}
