import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { ScanLine, Search, RotateCcw, CameraOff, PackagePlus, PackageSearch, LogIn } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useSaveProduct } from '../hooks/useSaveProduct'
import { Card, Button, Input, Divider, Spinner, PageHero, Modal } from '../components/ui'
import { ProductFormModal } from '../components/domain'
import { formatPrice } from '../utils/formatters'
import { EMPTY_PRODUCT } from '../utils/constants'
import { getProductImage } from '../utils/productImage'

const BARCODE_FORMATS = ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e']

// BarcodeDetector bawaan (Chrome Android) atau polyfill ZXing-wasm (iPhone / Safari / Firefox)
async function createDetector() {
  if ('BarcodeDetector' in window) {
    const supported = await window.BarcodeDetector.getSupportedFormats?.()
    if (!supported || supported.length > 0) {
      return new window.BarcodeDetector({ formats: BARCODE_FORMATS })
    }
  }
  const { BarcodeDetector } = await import('barcode-detector/ponyfill')
  return new BarcodeDetector({ formats: BARCODE_FORMATS })
}

/**
 * Halaman cek harga via scan barcode / input manual.
 * Barcode yang belum terdaftar langsung membuka form tambah produk (perlu login).
 */
export function ScannerPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const { user } = useAuth()
  const { products, categories } = useOutletContext()
  const saveProduct = useSaveProduct()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [mode, setMode] = useState('idle') // idle | scanning | found | notfound
  const [barcode, setBarcode] = useState('')
  const [result, setResult] = useState(null)
  const [cameraError, setCameraError] = useState('')
  const [addModal, setAddModal] = useState(null)       // initial form tambah produk
  const [loginPrompt, setLoginPrompt] = useState(null) // barcode yang perlu login dulu
  const [justAdded, setJustAdded] = useState(null)     // barcode produk yang baru disimpan

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const loopRef = useRef(null)

  const stopCamera = useCallback(() => {
    clearTimeout(loopRef.current)
    loopRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => stopCamera, [stopCamera])

  const findProduct = useCallback(
    (bc) => products.find((p) => String(p.barcode ?? '').trim() === bc),
    [products]
  )

  const openAddProduct = useCallback((bc) => {
    if (user) setAddModal({ ...EMPTY_PRODUCT, barcode: bc })
    else setLoginPrompt(bc)
  }, [user])

  const lookup = useCallback((raw) => {
    const bc = String(raw ?? '').trim()
    if (!bc) return
    stopCamera()
    setBarcode(bc)

    const found = findProduct(bc)
    setResult(found ?? null)
    setMode(found ? 'found' : 'notfound')
    if (!found) openAddProduct(bc)
  }, [findProduct, openAddProduct, stopCamera])

  const startCamera = async () => {
    setCameraError('')
    setMode('scanning')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) return stopCamera()
      video.srcObject = stream
      await video.play()

      const detector = await createDetector()

      const tick = async () => {
        if (!streamRef.current) return
        try {
          if (video.readyState >= 2) {
            const codes = await detector.detect(video)
            if (codes.length > 0) {
              navigator.vibrate?.(80)
              lookup(codes[0].rawValue)
              return
            }
          }
        } catch { /* frame belum siap */ }
        loopRef.current = setTimeout(tick, 250)
      }
      tick()
    } catch (e) {
      console.error(e)
      stopCamera()
      setMode('idle')
      setCameraError(
        e?.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser, atau masukkan barcode manual.'
          : 'Kamera tidak dapat dibuka. Masukkan barcode secara manual.'
      )
    }
  }

  const reset = () => {
    stopCamera()
    setMode('idle')
    setBarcode('')
    setResult(null)
  }

  // Kembali dari halaman login dengan ?add=<barcode> -> langsung buka form tambah
  useEffect(() => {
    const bc = searchParams.get('add')
    if (!bc || !user) return
    setSearchParams({}, { replace: true })
    setBarcode(bc)
    setMode('notfound')
    setAddModal({ ...EMPTY_PRODUCT, barcode: bc })
  }, [searchParams, setSearchParams, user])

  // Setelah produk baru tersimpan & daftar produk termuat ulang -> tampilkan hasilnya
  useEffect(() => {
    if (!justAdded) return
    const found = findProduct(justAdded)
    if (found) {
      setResult(found)
      setMode('found')
      setJustAdded(null)
    }
  }, [justAdded, findProduct])

  const handleSaveNew = async (formData) => {
    const ok = await saveProduct(formData)
    if (ok) {
      setJustAdded(String(formData.get('barcode')).trim())
      setAddModal(null)
    }
  }

  const goLogin = () => {
    navigate('/login', { state: { from: `/scanner?add=${encodeURIComponent(loginPrompt)}` } })
  }

  const getCatIcon = (catId) => categories.find((c) => c.id === catId)?.icon ?? '📦'

  return (
    <div>
      <PageHero
        eyebrow="📱 Cek Harga"
        title="Scan Barcode"
        subtitle="Arahkan kamera ke barcode atau ketik kodenya"
        align="center"
      />

      <div className="tk-container" style={{ maxWidth: 520, paddingTop: 20, paddingBottom: 28 }}>

        {/* IDLE */}
        {mode === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'tk-fadeIn 0.3s ease' }}>
            <Card padding="lg" style={{ textAlign: 'center' }}>
              <button
                onClick={startCamera}
                aria-label="Buka kamera untuk scan"
                style={{
                  width: 96, height: 96, borderRadius: 28, margin: '0 auto 16px', cursor: 'pointer',
                  border: 'none', background: C.heroGrad, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 12px 28px ${C.primary}44`,
                }}>
                <ScanLine size={44} strokeWidth={2.2} />
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Scan dengan Kamera</h3>
              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Mendukung EAN-13, UPC, Code-128 & QR</p>
              <Button onClick={startCamera} fullWidth size="lg" style={{ marginTop: 16 }}>Buka Kamera</Button>

              {cameraError && (
                <div style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', marginTop: 14,
                  padding: '12px 14px', borderRadius: 12, background: C.dangerBg, color: C.danger, fontSize: 13,
                }}>
                  <CameraOff size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{cameraError}</span>
                </div>
              )}
            </Card>

            <Divider label="atau ketik manual" />

            <Card>
              <form
                onSubmit={(e) => { e.preventDefault(); lookup(barcode) }}
                style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Contoh: 8991234567890"
                    inputMode="numeric"
                    enterKeyHint="search"
                    aria-label="Barcode"
                    style={{ fontFamily: 'monospace', height: 46 }}
                  />
                </div>
                <Button type="submit" disabled={!barcode.trim()} icon={<Search size={18} />} style={{ height: 46 }}>Cari</Button>
              </form>

              {products.length > 0 && (
                <>
                  <div style={{ fontSize: 12, color: C.textMuted, margin: '14px 0 8px', fontWeight: 600 }}>Coba barcode:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {products.slice(0, 4).map((p) => (
                      <button key={p.id} onClick={() => lookup(p.barcode)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bgMuted, fontSize: 12, fontFamily: 'monospace', cursor: 'pointer', color: C.textMuted, fontWeight: 600 }}>
                        {p.barcode}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* SCANNING */}
        {mode === 'scanning' && (
          <div style={{ animation: 'tk-fadeIn 0.3s ease' }}>
            <div style={{ background: '#000', borderRadius: 24, overflow: 'hidden', position: 'relative', aspectRatio: '3 / 4', maxHeight: '62vh', width: '100%' }}>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted autoPlay />

              {/* Bingkai scan */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ position: 'relative', width: '72%', aspectRatio: '1.6', borderRadius: 18, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }}>
                  {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                    <div key={v + h} style={{
                      position: 'absolute', width: 28, height: 28, [v]: -2, [h]: -2,
                      borderColor: '#fff', borderStyle: 'solid', borderWidth: 0,
                      [`border${v[0].toUpperCase() + v.slice(1)}Width`]: 4,
                      [`border${h[0].toUpperCase() + h.slice(1)}Width`]: 4,
                      [`border${v[0].toUpperCase() + v.slice(1)}${h[0].toUpperCase() + h.slice(1)}Radius`]: 18,
                    }} />
                  ))}
                  <div style={{ position: 'absolute', left: '6%', right: '6%', height: 2, background: C.accent, borderRadius: 2, animation: 'tk-scanLine 2s ease-in-out infinite', boxShadow: `0 0 12px ${C.accent}` }} />
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 20px 18px', background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', textAlign: 'center' }}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, animation: 'tk-pulse 2s ease infinite' }}>Arahkan ke barcode produk…</p>
              </div>
            </div>
            <Button variant="secondary" onClick={reset} fullWidth size="lg" style={{ marginTop: 14 }}>Batal</Button>
          </div>
        )}

        {/* FOUND */}
        {mode === 'found' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'tk-slideUp 0.35s ease' }}>
            <Card padding="none" style={{ overflow: 'hidden', borderRadius: 22 }}>
              <div style={{ aspectRatio: '16 / 10', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
                {getProductImage(result)
                  ? <img src={getProductImage(result)} alt={result.name} style={{ position: 'absolute', inset: 16, width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', objectFit: 'contain' }} />
                  : getCatIcon(result.category_id)}
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, borderTop: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 12, color: C.success, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>✓ Ditemukan</div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1.25 }}>{result.name}</h2>
                  {result.description && <p style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>{result.description}</p>}
                </div>

                <div style={{ background: C.heroGrad, borderRadius: 18, padding: '16px 20px', color: '#fff' }}>
                  <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 700 }}>HARGA</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(result.price)}</div>
                  <div style={{ opacity: 0.7, fontSize: 13 }}>per {result.unit}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: C.bgMuted, borderRadius: 12, padding: '10px 14px', minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Barcode</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, fontFamily: 'monospace', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>{result.barcode}</div>
                  </div>
                  <div style={{ borderRadius: 12, padding: '10px 14px', background: result.stock === 0 ? C.dangerBg : result.stock < 10 ? C.warningBg : C.successBg }}>
                    <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Stok</div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginTop: 2, color: result.stock === 0 ? C.danger : result.stock < 10 ? C.warning : C.success }}>
                      {result.stock === 0 ? 'Habis' : `${result.stock} ${result.unit}`}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Button onClick={() => { reset(); startCamera() }} fullWidth size="lg" icon={<ScanLine size={18} />}>Scan Lagi</Button>
            <Button variant="ghost" onClick={reset} fullWidth>Kembali</Button>
          </div>
        )}

        {/* NOT FOUND */}
        {mode === 'notfound' && (
          <Card padding="lg" style={{ textAlign: 'center', animation: 'tk-fadeIn 0.3s ease' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: C.warningBg, color: C.warning, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <PackageSearch size={34} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Produk belum terdaftar</h3>
            <p style={{ fontSize: 14, color: C.textMuted, marginTop: 6 }}>
              Barcode <span style={{ fontFamily: 'monospace', fontWeight: 700, color: C.text }}>{barcode}</span> tidak ada di katalog
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
              <Button onClick={() => openAddProduct(barcode)} fullWidth size="lg" icon={<PackagePlus size={18} />}>Tambah Produk Ini</Button>
              <Button variant="secondary" onClick={() => { reset(); startCamera() }} fullWidth icon={<RotateCcw size={16} />}>Scan Ulang</Button>
            </div>
          </Card>
        )}

        {/* Menunggu daftar produk termuat setelah simpan */}
        {justAdded && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Spinner size={28} color={C.primary} />
          </div>
        )}
      </div>

      {/* Popup tambah produk dengan barcode hasil scan */}
      {addModal && (
        <ProductFormModal
          initial={addModal}
          categories={categories}
          onSave={handleSaveNew}
          onClose={() => setAddModal(null)}
        />
      )}

      {/* Belum login -> ajak login dulu */}
      {loginPrompt && (
        <Modal title="Produk belum terdaftar" onClose={() => setLoginPrompt(null)} width={400}>
          <p style={{ color: C.textMuted, lineHeight: 1.6, fontSize: 14 }}>
            Barcode <b style={{ fontFamily: 'monospace', color: C.text }}>{loginPrompt}</b> belum ada di katalog.
            Login sebagai admin untuk langsung menambahkannya.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="secondary" onClick={() => setLoginPrompt(null)} fullWidth>Nanti</Button>
            <Button onClick={goLogin} fullWidth icon={<LogIn size={16} />}>Login</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
