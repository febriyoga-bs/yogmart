import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { useProductFilter } from '../hooks/useProductFilter'
import { formatPrice } from '../utils/formatters'
import {
  Card, Tabs, SearchBar, Select, Button, EmptyState, ConfirmDialog
} from '../components/ui'
import {
  StatCard, StockBadge, ProductFormModal, CategoryForm
} from '../components/domain'
import { Modal } from '../components/ui/Modal'
import { useOutletContext } from "react-router-dom";
import { productAPI, categoryAPI } from "../api";


const ADMIN_TABS = [
  { id: 'products', label: 'Produk', icon: '📦' },
  { id: 'categories', label: 'Kategori', icon: '🏷️' },
]

const EMPTY_PRODUCT = { name: '', barcode: '', price: '', stock: '', unit: 'buah', category_id: '', description: '' }
const EMPTY_CATEGORY = { name: '', icon: '📦' }

/**
 * Halaman dashboard admin — kelola produk, kategori, statistik
 */
export function AdminPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const { showToast } = useToast()

  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [productModal, setProductModal] = useState(null)
  const [catModal, setCatModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const {
    products,
    loadProducts,
    categories,
    loadCategories,
    dispatch,
    catDispatch
  } = useOutletContext();

  const { filtered, total } = useProductFilter(products, { search, categoryId })
  const getCat = (id) => categories.find((c) => c.id === id)

  const stats = {
    total: products.length,
    cats: categories.length,
    value: products.reduce((a, p) => a + p.price * p.stock, 0),
    low: products.filter((p) => p.stock < 10).length,
  }

  const saveProduct = async (form) => {
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        image: form.name?.toLowerCase().split(" ").join("-")
      };

      if (payload.id) {
        await productAPI.update(payload.id, payload);
        showToast("Produk berhasil diupdate!");
      } else {
        await productAPI.create({ ...payload, id: "p-" + parseInt(products.length + 1) });
        showToast("Produk berhasil ditambahkan!");
      }

      loadProducts()

      setProductModal(null);
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan produk");
    }
  };

  const saveCat = async (form) => {
    const payload = {
      ...form,
    };

    try {
      if (form.id) {
        await categoryAPI.update(form.id, form);
        showToast("Kategori berhasil diupdate!");
      } else {
        await categoryAPI.create({ ...payload, id: "cat-" + parseInt(categories.length + 1), update_by: "Yoga" });
        showToast("Kategori berhasil ditambahkan!");
      }

      loadCategories();

      setCatModal(null);
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan kategori");
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.heroGrad, padding: '28px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Admin Panel</div>
          <h1 style={{ fontSize: 32, color: 'white', fontWeight: 400, fontFamily: 'Georgia,serif' }}>Dashboard <em>Warung</em></h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Total Produk" value={stats.total} icon="📦" variant="primary" />
          <StatCard label="Kategori" value={stats.cats} icon="🏷️" variant="info" />
          <StatCard label="Nilai Stok" value={formatPrice(stats.value)} icon="💰" variant="success" />
          <StatCard label="Stok Menipis" value={stats.low} icon="⚠️" variant={stats.low > 0 ? 'warning' : 'neutral'} />
        </div>

        <Tabs tabs={ADMIN_TABS} active={tab} onChange={setTab} />
        <div style={{ height: 20 }} />

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Cari nama / barcode..." />
              </div>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
                <option value="">Semua Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </Select>
              <Button icon="＋" onClick={() => setProductModal(EMPTY_PRODUCT)}>Tambah Produk</Button>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${C.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: C.bgMuted }}>
                  <tr>
                    {['Produk', 'Barcode', 'Kategori', 'Harga', 'Stok', 'Status', ''].map((h, idx) => (
                      <th key={h} style={{ position: (idx === 0) && "sticky", left: (idx === 0) && 0, zIndex: (idx === 0) && 3, background: (idx === 0) && C.bgMuted, padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: C.textMuted, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState icon="📦" title="Belum ada produk" description="Tambahkan produk pertama" /></td></tr>
                  ) : filtered.map((p) => {
                    const cat = getCat(p.category_id)
                    return (
                      <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}
                        onMouseEnter={(e) => Array.from(e.currentTarget.cells).forEach((td) => td.style.background = C.bgMuted)}
                        onMouseLeave={(e) => Array.from(e.currentTarget.cells).forEach((td) => td.style.background = C.bg)}>
                        <td style={{ maxWidth: "40vw", wordBreak: "break-word", padding: '12px 16px', position: "sticky", left: 0, zIndex: 3, background: C.bg }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                              <img
                                src={`/image/${p?.image}.png`}
                                width={30}
                                height={30}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
                              {p.description && <div style={{ fontSize: 12, color: C.textMuted, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}><span style={{ background: C.bg, fontFamily: 'monospace', fontSize: 13, color: C.textMuted }}>{p.barcode}</span></td>
                        <td style={{ padding: '12px 16px' }}><span style={{ background: C.bg, fontSize: 13, color: C.text }}>{cat?.icon} {cat?.name ?? '-'}</span></td>
                        <td style={{ padding: '12px 16px' }}><span style={{ background: C.bg, fontWeight: 800, color: C.primary }}>{formatPrice(p.price)}</span></td>
                        <td style={{ padding: '12px 16px' }}><span style={{ background: C.bg, fontWeight: 700, color: C.text }}>{p.stock} {p.unit}</span></td>
                        <td style={{ padding: '12px 16px' }}><StockBadge stock={p.stock} /></td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Button variant="ghost" size="xs" onClick={() => setProductModal({ ...p })}>✏️</Button>
                            {/* <Button variant="danger" size="xs" onClick={() => setConfirm({
                              title: 'Hapus Produk',
                              message: `Yakin menghapus "${p.name}"? Tindakan ini tidak bisa dibatalkan.`,
                              onConfirm: () => { dispatch({ type: 'DELETE', payload: p.id }); showToast('Produk dihapus!'); setConfirm(null) },
                            })}>🗑️</Button> */}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div style={{ marginTop: 10, fontSize: 13, color: C.textMuted, textAlign: 'right' }}>
                {filtered.length} dari {total} produk
              </div>
            )}
          </div>
        )}

        {/* ── Categories Tab ── */}
        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
              <Button icon="＋" onClick={() => setCatModal(EMPTY_CATEGORY)}>Tambah Kategori</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category_id === cat.id).length
                return (
                  <Card key={cat.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: C.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                        {cat.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{cat.name}</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{count} produk</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Button variant="ghost" size="xs" onClick={() => setCatModal({ ...cat })}>✏️</Button>
                        <Button variant="danger" size="xs" onClick={() => setConfirm({
                          title: 'Hapus Kategori',
                          message: `Yakin menghapus "${cat.name}"?`,
                          onConfirm: () => { catDispatch({ type: 'DELETE', payload: cat.id }); showToast('Kategori dihapus!'); setConfirm(null) },
                        })}>🗑️</Button>
                      </div>
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
