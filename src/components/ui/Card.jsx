import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const PADDING = { none: 0, sm: 12, md: 20, lg: 28, xl: 36 }

/**
 * Container kartu dengan shadow & border
 *
 * @param {'none'|'sm'|'md'|'lg'|'xl'} padding
 * @param {boolean} hoverable - aktifkan efek hover lift
 */
export function Card({ children, padding = 'md', hoverable, onClick, style = {} }) {
  const { theme } = useTheme()
  const C = theme.colors
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.bgCard, borderRadius: 16,
        border: `1px solid ${hov && hoverable ? C.borderStrong : C.border}`,
        padding: PADDING[padding] ?? padding,
        boxShadow: hov && hoverable ? C.shadowLg : C.shadow,
        transition: 'all 0.25s ease',
        transform: hov && hoverable ? 'translateY(-3px)' : 'none',
        cursor: onClick || hoverable ? 'pointer' : 'default',
        ...style,
      }}>
      {children}
    </div>
  )
}
