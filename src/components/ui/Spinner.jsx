/**
 * Loading spinner animasi
 * @param {number} size - ukuran dalam px
 * @param {string} color - warna spinner
 */
export function Spinner({ size = 20, color = '#fff' }) {
  const thickness = Math.max(2, size / 8)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      border: `${thickness}px solid ${color}30`,
      borderTopColor: color,
      animation: 'tk-spin 0.7s linear infinite',
    }} />
  )
}
