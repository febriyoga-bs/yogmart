import { useState } from 'react'
import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, History, Trash2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { useProductFilter } from '../hooks/useProductFilter'
import { useSaveProduct } from '../hooks/useSaveProduct'
import { useIsMobile } from '../hooks/useMediaQuery'
import { formatPrice, formatDateTime, generateId } from '../utils/formatters'
import { getProductImage } from '../utils/productImage'
import { EMPTY_PRODUCT } from '../utils/constants'
import {
  Card, Tabs, SearchBar, Select, Button, EmptyState, ConfirmDialog, PageHero, Modal
} from '../components/ui'
import {
  StatCard, StockBadge, ProductFormModal, ProductHistoryModal, CategoryForm
} from '../components/domain'
import { categoryAPI } from "../api";


const ADMIN_TABS = [
  { id: 'products', label: 'Produk', icon: '📦' },
  { id: 'categories', label: 'Kategori', icon: '🏷️' },
]

const EMPTY_CATEGORY = { name: '', icon: '📦' }

const iconButton = (C) => ({
  width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`,
  background: C.bgCard, color: C.textMuted, cursor: 'pointer', flexShrink: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
})

/**
 * Halaman dashboard admin — kelola produk, kategori, statistik
 */
export function AdminPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const { showToast } = useToast()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const saveProductRequest = useSaveProduct()

  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [productModal, setProductModal] = useState(null)
  const [catModal, setCatModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [historyProduct, setHistoryProduct] = useState(null)

  const {
    products,
    categories,
    loadCategories,
  } = useOutletContext();

  const { filtered, total } = useProductFilter(products, { search, categoryId })
  const getCat = (id) => categories.find((c) => c.id === id)

  const stats = {
    total: products.length,
    cats: categories.length,
    value: products.reduce((a, p) => a + p.price * p.stock, 0),
    low: products.filter((p) => p.stock < 10).length,
  }

  const saveProduct = async (formData) => {
    if (await saveProductRequest(formData)) setProductModal(null)
  };

  const saveCat = async (form) => {
    try {
      if (form.id) {
        await categoryAPI.update(form.id, form);
        showToast("Kategori berhasil diupdate!");
      } else {
        await categoryAPI.create({ ...form, id: generateId("cat") });
        showToast("Kategori berhasil ditambahkan!");
      }

      loadCategories();

      setCatModal(null);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Gagal menyimpan kategori", "error");
    }
  };

  const deleteCat = async (cat) => {
    try {
      await categoryAPI.delete(cat.id)
      showToast('Kategori dihapus!')
      loadCategories()
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.message || 'Gagal menghapus kategori', 'error')
    } finally {
      setConfirm(null)
    }
  }

  const productImage = (p, size) => {
    const src = getProductImage(p)
    return (
      <div style={{ width: size, height: size, borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.45, flexShrink: 0, overflow: 'hidden' }}>
        {src
          ? <img src={src} alt={p.name} loading="lazy" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
          : getCat(p.category_id)?.icon ?? '📦'}
      </div>
    )
  }

  const lastUpdate = (p) => p.updated_at
    ? <>{formatDateTime(p.updated_at)} · {p.updated_by_name ?? '—'}</>
    : '—'

  return (
    <div>
      <PageHero
        eyebrow="⚙️ Admin Panel"
        title="Dashboard Warung"
        subtitle={user ? `Halo, ${user.name}! Kelola produk dan kategori di sini.` : undefined}
      />

      <div className="tk-container" style={{ paddingTop: 20, paddingBottom: 28 }}>
        {/* Stats */}
        <div className="tk-stats-grid" style={{ marginBottom: 22 }}>
          <StatCard label="Total Produk" value={stats.total} icon="📦" variant="primary" />
          <StatCard label="Kategori" value={stats.cats} icon="🏷️" variant="info" />
          <StatCard label="Nilai Stok" value={formatPrice(stats.value)} icon="💰" variant="success" />
          <StatCard label="Stok Menipis" value={stats.low} icon="⚠️" variant={stats.low > 0 ? 'warning' : 'neutral'} />
        </div>

        <Tabs tabs={ADMIN_TABS} active={tab} onChange={setTab} />
        <div style={{ height: 16 }} />

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Cari nama / barcode..." />
              </div>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ height: 46, borderRadius: 14, minWidth: 150 }}>
                <option value="">Semua Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </Select>
              {!isMobile && (
                <Button icon={<Plus size={18} />} onClick={() => setProductModal(EMPTY_PRODUCT)} style={{ height: 46 }}>Tambah Produk</Button>
              )}
            </div>

            {filtered.length === 0 ? (
              <Card><EmptyState icon="📦" title="Belum ada produk" description="Tambahkan produk pertama" /></Card>
            ) : isMobile ? (
              /* ── Mobile: daftar kartu ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 64 }}>
                {filtered.map((p) => (
                  <Card key={p.id} padding="sm" style={{ borderRadius: 16 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {productImage(p, 60)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3, flex: 1, minWidth: 0 }}>{p.name}</div>
                          <StockBadge stock={p.stock} />
                        </div>
                        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2, fontFamily: 'monospace' }}>{p.barcode}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                          <span style={{ fontWeight: 800, color: C.primary }}>{formatPrice(p.price)}</span>
                          <span style={{ fontSize: 12, color: C.textMuted }}>stok {p.stock} {p.unit}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 11, color: C.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Diupdate: {lastUpdate(p)}
                      </div>
                      <button style={iconButton(C)} onClick={() => setHistoryProduct(p)} aria-label="Riwayat"><History size={16} /></button>
                      <button style={iconButton(C)} onClick={() => setProductModal({ ...p })} aria-label="Edit"><Pencil size={16} /></button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              /* ── Desktop: tabel ── */
              <div style={{ overflowX: 'auto', borderRadius: 16, border: `1px solid ${C.border}`, background: C.bgCard }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: C.bgMuted }}>
                    <tr>
                      {['Produk', 'Barcode', 'Kategori', 'Harga', 'Stok', 'Terakhir Diupdate', ''].map((h) => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.textMuted, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const cat = getCat(p.category_id)
                      return (
                        <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = C.bgMuted }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                          <td style={{ padding: '10px 16px', maxWidth: 320 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              {productImage(p, 44)}
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
                                {p.description && <div style={{ fontSize: 12, color: C.textMuted, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 13, color: C.textMuted }}>{p.barcode}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, color: C.text, whiteSpace: 'nowrap' }}>{cat?.icon} {cat?.name ?? '-'}</td>
                          <td style={{ padding: '10px 16px', fontWeight: 800, color: C.primary, whiteSpace: 'nowrap' }}>{formatPrice(p.price)}</td>
                          <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 700, color: C.text }}>{p.stock} {p.unit}</span>
                              <StockBadge stock={p.stock} />
                            </div>
                          </td>
                          <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                            {p.updated_at ? (
                              <>
                                <div style={{ fontSize: 13, color: C.text }}>{formatDateTime(p.updated_at)}</div>
                                <div style={{ fontSize: 12, color: C.textMuted }}>oleh {p.updated_by_name ?? '—'}</div>
                              </>
                            ) : (
                              <span style={{ fontSize: 13, color: C.textMuted }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button style={iconButton(C)} onClick={() => setHistoryProduct(p)} title="Riwayat" aria-label="Riwayat"><History size={16} /></button>
                              <button style={iconButton(C)} onClick={() => setProductModal({ ...p })} title="Edit" aria-label="Edit"><Pencil size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length > 0 && (
              <div style={{ marginTop: 10, fontSize: 13, color: C.textMuted, textAlign: 'right' }}>
                {filtered.length} dari {total} produk
              </div>
            )}

            {/* Tombol tambah melayang (mobile) */}
            {isMobile && (
              <button
                onClick={() => setProductModal(EMPTY_PRODUCT)}
                aria-label="Tambah produk"
                style={{
                  position: 'fixed', right: 16, bottom: 'calc(84px + env(safe-area-inset-bottom))', zIndex: 40,
                  width: 56, height: 56, borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: C.primary, color: '#fff', boxShadow: `0 10px 24px ${C.primary}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <Plus size={26} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}

        {/* ── Categories Tab ── */}
        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Button icon={<Plus size={18} />} onClick={() => setCatModal(EMPTY_CATEGORY)} fullWidth={isMobile}>Tambah Kategori</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length
                return (
                  <Card key={cat.id} padding="sm" style={{ borderRadius: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: C.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                        {cat.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{cat.name}</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{count} produk</div>
                      </div>
                      <button style={iconButton(C)} onClick={() => setCatModal({ ...cat })} aria-label="Edit kategori"><Pencil size={16} /></button>
                      <button
                        style={{ ...iconButton(C), color: C.danger }}
                        aria-label="Hapus kategori"
                        onClick={() => setConfirm({
                          title: 'Hapus Kategori',
                          message: `Yakin menghapus "${cat.name}"?`,
                          onConfirm: () => deleteCat(cat),
                        })}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {productModal && (
        <ProductFormModal initial={productModal} categories={categories} onSave={saveProduct} onClose={() => setProductModal(null)} />
      )}
      {historyProduct && (
        <ProductHistoryModal product={historyProduct} categories={categories} onClose={() => setHistoryProduct(null)} />
      )}
      {catModal && (
        <Modal title={catModal.id ? 'Edit Kategori' : 'Tambah Kategori'} onClose={() => setCatModal(null)} width={400}>
          <CategoryForm initial={catModal} onSave={saveCat} onClose={() => setCatModal(null)} />
        </Modal>
      )}
      {confirm && (
        <ConfirmDialog {...confirm} danger onCancel={() => setConfirm(null)} />
      )}
    </div>
  )
}
