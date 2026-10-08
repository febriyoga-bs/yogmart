import { ExternalLink, TrendingDown, TrendingUp, Equal } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { formatPrice, formatDate } from '../../utils/formatters'
import { alfagiftSearchUrl, compareWithAlfagift } from '../../utils/alfagift'

/**
 * Perbandingan harga dengan Alfagift + tombol buka pencarian di Alfagift
 * @param {{ name, price, alfagift_price, alfagift_checked_at }} product
 */
export function AlfagiftCompare({ product }) {
  const { theme } = useTheme()
  const C = theme.colors
  const cmp = compareWithAlfagift(product.price, product.alfagift_price)

  const tone = {
    cheaper: { bg: C.successBg, color: C.success, Icon: TrendingDown, text: `Lebih murah ${formatPrice(cmp?.diff)} dari Alfagift` },
    pricier: { bg: C.warningBg, color: C.warning, Icon: TrendingUp, text: `Lebih mahal ${formatPrice(cmp?.diff)} dari Alfagift` },
    same: { bg: C.infoBg, color: C.info, Icon: Equal, text: 'Harga sama dengan Alfagift' },
  }[cmp?.status]

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Bandingkan harga
      </div>

      {tone ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: tone.bg, color: tone.color }}>
            <tone.Icon size={20} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 800, fontSize: 14 }}>{tone.text}</span>
          </div>
          <div style={{ fontSize: 13, color: C.textMuted }}>
            Harga Alfagift <b style={{ color: C.text }}>{formatPrice(product.alfagift_price)}</b>
            {product.alfagift_checked_at && <> · dicek {formatDate(product.alfagift_checked_at)}</>}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 13, color: C.textMuted }}>Belum ada harga pembanding. Cek langsung di Alfagift:</div>
      )}

      <a
        href={alfagiftSearchUrl(product.name)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '11px 16px', borderRadius: 12, textDecoration: 'none',
          background: '#e31e24', color: '#fff', fontWeight: 700, fontSize: 14,
        }}>
        Cek harga di Alfagift <ExternalLink size={16} />
      </a>
    </div>
  )
}
