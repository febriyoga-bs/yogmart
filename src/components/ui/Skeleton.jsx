import { useTheme } from '../../contexts/ThemeContext'

/**
 * Placeholder loading shimmer
 * @param {string|number} width
 * @param {number} height
 * @param {number} radius - border radius
 */
export function Skeleton({ width = '100%', height = 16, radius = 6 }) {
  const { theme } = useTheme()
  const C = theme.colors
  return (
    <div style={{
      width, height, borderRadius: radius, background: C.bgMuted,
      backgroundImage: `linear-gradient(90deg, ${C.bgMuted} 0%, ${C.bgHover} 50%, ${C.bgMuted} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'tk-shimmer 1.5s ease infinite',
    }} />
  )
}
