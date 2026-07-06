import { useTheme } from '../../contexts/ThemeContext'
import { Card } from '../ui/Card'
import { StockBadge } from './StockBadge'
import { formatPrice } from '../../utils/formatters'

/**
 * Kartu produk untuk katalog publik
 * @param {{ id, name, price, stock, unit, barcode, description }} product
 * @param {{ id, name, icon }} category
 */
export function ProductCard({ product, category }) {
  const { theme } = useTheme()
  const C = theme.colors

  return (
    <Card hoverable padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail */}
      <div style={{
        height: 150,
        background: `#fff`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 52, position: 'relative',
      }}>
        {product?.image ?
          <img
            src={`/image/${product?.image}.png`}
            height={150}
          />
          :
          category?.icon
        }

        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '0.05em' }}>
              HABIS
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {category && (
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {category.icon} {category.name}
          </div>
        )}

        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, color: C.text }}>
          {product.name}
        </div>

        {product.description && (
          <div style={{
            fontSize: 12, color: C.textMuted, lineHeight: 1.5, overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {product.description}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.primary }}>{formatPrice(product.price)}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>/{product.unit}</div>
          </div>
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Barcode footer */}
      <div style={{ padding: '8px 16px', borderTop: `1px solid ${C.border}`, background: C.bgMuted }}>
        <span style={{ fontSize: 12, color: C.textLight, fontFamily: 'monospace' }}>
          🏷 {product.barcode}
        </span>
      </div>
    </Card>
  )
}
