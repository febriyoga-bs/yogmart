import { useTheme } from '../../contexts/ThemeContext'

/**
 * Header halaman dengan latar gradient tema
 *
 * @param {string} eyebrow - label kecil di atas judul
 * @param {string} title
 * @param {string} subtitle
 * @param {'left'|'center'} align
 * @param {ReactNode} children - slot di bawah subtitle (search bar, dll)
 */
export function PageHero({ eyebrow, title, subtitle, align = 'left', children }) {
  const { theme } = useTheme()
  const C = theme.colors

  return (
    <section style={{
      background: C.heroGrad, position: 'relative', overflow: 'hidden',
      padding: 'clamp(22px, 5vw, 44px) 0 clamp(26px, 6vw, 52px)',
    }}>
      {/* Dekorasi */}
      <div aria-hidden style={{ position: 'absolute', top: -120, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: -90, left: '20%', width: 220, height: 220, borderRadius: '50%', background: `${C.accent}22`, filter: 'blur(4px)' }} />

      <div className="tk-container" style={{ position: 'relative', textAlign: align }}>
        {eyebrow && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 99, marginBottom: 10,
            background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.9)',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{
          fontSize: 'clamp(24px, 5.5vw, 40px)', fontWeight: 800, color: '#fff',
          lineHeight: 1.15, letterSpacing: '-0.02em',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(13px, 3.4vw, 15px)', marginTop: 6,
            maxWidth: align === 'center' ? 420 : 520, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0,
          }}>
            {subtitle}
          </p>
        )}
        {children && <div style={{ marginTop: 'clamp(16px, 4vw, 24px)' }}>{children}</div>}
      </div>
    </section>
  )
}
