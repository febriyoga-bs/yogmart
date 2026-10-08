import { useTheme } from '../../contexts/ThemeContext'
import { Card } from '../ui/Card'
import { StockBadge } from './StockBadge'
import { formatPrice } from '../../utils/formatters'
import { getProductImage } from '../../utils/productImage'
import { STOCK_THRESHOLD_LOW } from '../../utils/constants'

/**
 * Kartu produk untuk katalog publik
 * @param {{ id, name, price, stock, unit, barcode, description }} product
 * @param {{ id, name, icon }} category
 */
export function ProductCard({ product, category }) {
  const { theme } = useTheme()
  const C = theme.colors
  const image = getProductImage(product)

  return (
    <Card hoverable padding="none" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 18 }}>
      {/* Thumbnail */}
      <div style={{
        aspectRatio: '4 / 3',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44, position: 'relative', flexShrink: 0,
      }}>
        {image
          ? <img src={image} alt={product.name} loading="lazy" style={{ position: 'absolute', inset: 10, width: 'calc(100% - 20px)', height: 'calc(100% - 20px)', objectFit: 'contain' }} />
          : category?.icon ?? '📦'}

        {/* Badge stok di pojok — hanya kalau menipis / habis */}
        {product.stock < STOCK_THRESHOLD_LOW && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <StockBadge stock={product.stock} />
          </div>
        )}

        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)' }} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, borderTop: `1px solid ${C.border}` }}>
        {category && (
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {category.icon} {category.name}
          </div>
        )}

        <div style={{
          fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: C.text,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </div>

        {product.description && (
          <div className="tk-product-card__desc" style={{
            fontSize: 12, color: C.textMuted, lineHeight: 1.5, overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {product.description}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{formatPrice(product.price)}</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>/{product.unit}</span>
        </div>

        <div className="tk-product-card__barcode" style={{ fontSize: 11, color: C.textLight, fontFamily: 'monospace' }}>
          {product.barcode}
        </div>
      </div>
    </Card>
  )
}
