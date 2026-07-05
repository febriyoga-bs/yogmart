import { Badge } from '../ui/Badge'
import { STOCK_THRESHOLD_LOW, STOCK_THRESHOLD_ZERO } from '../../utils/constants'

/**
 * Badge status stok produk
 * @param {number} stock - jumlah stok
 */
export function StockBadge({ stock }) {
  if (stock <= STOCK_THRESHOLD_ZERO) return <Badge variant="danger">Habis</Badge>
  if (stock < STOCK_THRESHOLD_LOW)   return <Badge variant="warning">Sisa {stock}</Badge>
  return <Badge variant="success">Tersedia</Badge>
}
