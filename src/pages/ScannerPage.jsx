import { useState, useCallback, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { Card, Button, Input, Divider, EmptyState, Spinner } from '../components/ui'
import { ScanBarcode, Camera, Search, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'
import { StockBadge } from '../components/domain'
import { formatPrice } from '../utils/formatters'
import { SEED_CATEGORIES } from '../utils/constants'
import { useOutletContext } from "react-router-dom";

/**
 * Halaman cek harga via scan barcode / input manual
 */
export function ScannerPage() {
  const { theme } = useTheme()
  const C = theme.colors
  const { showToast } = useToast()
  const {
    products,
    categories
  } = useOutletContext();

  const [mode, setMode] = useState('idle') // idle | scanning | loading | found | notfound
  const [barcode, setBarcode] = useState('')
  const [result, setResult] = useState(null)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const scannerRef = useRef(null)

  const [manualBarcode, setManualBarcode] = useState('')
  const [product, setProduct] = useState(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (scannerRef.current) {
      clearInterval(scannerRef.current)
      scannerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const doSearch = useCallback((bc) => {
    if (!bc.trim()) return
    setMode('loading')
    setTimeout(() => {
      const found = products.find((p) => p.barcode === bc.trim())
      setResult(found ?? null)
      setMode(found ? 'found' : 'notfound')
      if (!found) showToast(`Barcode "${bc}" tidak ditemukan`, 'warning')
    }, 900)
  }, [products, showToast])

  const simulateScan = () => {
    setMode('simulation')
    setTimeout(() => {
      const rnd = products[Math.floor(Math.random() * products.length)]
      setBarcode(rnd.barcode)
      doSearch(rnd.barcode)
    }, 2200)
  }

  const startCamera = async () => {
    setMode('scanning')
    setProduct(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      // Use BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e'] })
        scannerRef.current = setInterval(async () => {
          if (!videoRef.current) return
          try {
            const barcodes = await detector.detect(videoRef.current)
            if (barcodes.length > 0) {
              const barcode = barcodes[0].rawValue
              stopCamera()
              await fetchProduct(barcode)
            }
          } catch (e) { }
        }, 300)
      } else {
        // Fallback: show manual entry hint
        setTimeout(() => {
          if (mode === 'scanning') {
            setMode('manual')
            stopCamera()
          }
        }, 2000)
      }
    } catch (e) {
      setMode('error')
      setErrorMsg('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }

  const fetchProduct = useCallback(async (barcode) => {
    doSearch(barcode)
    // try {
    //   const data = await productAPI.getProductbyBarcode(barcode);
    //   setProducts(data);
    // } catch (err) {
    //   console.error(err);
    // }
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualBarcode.trim()) {
      fetchProduct(manualBarcode.trim())
    }
  }

  const reset = () => {
    stopCamera();
    setMode('idle');
    setProduct(null);
    setBarcode('');
    setResult(null)
  }

  const getCatIcon = (catId) => SEED_CATEGORIES.find((c) => c.id === catId)?.icon ?? '📦'

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: C.bg }}>
      {/* Hero */}
      <div style={{ background: C.heroGrad, padding: '36px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>📱</div>
        <h1 style={{ fontSize: 34, color: 'white', fontWeight: 400, fontFamily: 'Georgia,serif', marginBottom: 8 }}>
          Cek <em>Harga</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Scan barcode atau masukkan kode produk</p>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '28px 24px' }}>

        {/* IDLE */}
        {mode === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'tk-fadeIn 0.3s ease' }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 68, height: 68, borderRadius: 18, background: C.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 30 }}>📷</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Scan Barcode</h3>
                <Button onClick={simulateScan} fullWidth size="lg">Simulasi</Button>
                <Button onClick={startCamera} fullWidth size="lg" icon="📷" style={{ marginTop: 10 }}>Buka Kamera</Button>
              </div>
            </Card>

            <Divider label="atau masukkan manual" />

            <Card>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 12 }}>Input Barcode</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <Input
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch(barcode)}
                    placeholder="Contoh: 8991234567890"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
                <Button onClick={() => doSearch(barcode)} disabled={!barcode.trim()} icon="🔍">Cari</Button>
              </div>

              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Contoh barcode:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {products.slice(0, 5).map((p) => (
                  <button key={p.id} onClick={() => { setBarcode(p.barcode); doSearch(p.barcode) }}
                    style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.bgMuted, fontSize: 11, fontFamily: 'monospace', cursor: 'pointer', color: C.textMuted, fontWeight: 600 }}>
                    {p.barcode}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SCANNING */}
        {mode === 'simulation' && (
          <div style={{ animation: 'tk-fadeIn 0.3s ease' }}>
            <div style={{ background: '#111', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'relative', width: 200, height: 130, zIndex: 2 }}>
                {[['top', 'left', '3px 0 0 3px'], ['top', 'right', '3px 3px 0 0'], ['bottom', 'left', '0 0 3px 3px'], ['bottom', 'right', '0 3px 3px 0']].map(([v, h, bw], i) => (
                  <div key={i} style={{ position: 'absolute', width: 22, height: 22, [v]: 0, [h]: 0, borderColor: C.accent, borderStyle: 'solid', borderWidth: bw }} />
                ))}
                <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: C.accent, borderRadius: 2, animation: 'tk-scanLine 1.8s ease-in-out infinite', boxShadow: `0 0 10px ${C.accent}` }} />
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 20px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', textAlign: 'center' }}>
                <p style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Sedang memindai...</p>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button variant="secondary" onClick={reset} fullWidth>✕ Batal</Button>
            </div>
          </div>
        )}

        {/* Scanning */}
        {mode === 'scanning' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ background: 'black', borderRadius: 20, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted />

              {/* Scan overlay */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 220, height: 140 }}>
                  {/* Corner brackets */}
                  {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                    <div key={pos} style={{
                      position: 'absolute',
                      width: 24, height: 24,
                      ...(pos.includes('top') ? { top: 0 } : { bottom: 0 }),
                      ...(pos.includes('left') ? { left: 0 } : { right: 0 }),
                      borderColor: 'var(--accent)', borderStyle: 'solid',
                      borderWidth: pos.includes('top') ? '3px 0 0 3px' : pos === 'top-right' ? '3px 3px 0 0' : pos === 'bottom-left' ? '0 0 3px 3px' : '0 3px 3px 0',
                    }} />
                  ))}
                  {/* Scan line */}
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'var(--accent)', animation: 'scanLine 2s ease-in-out infinite',
                    boxShadow: '0 0 8px var(--accent)'
                  }} />
                </div>
              </div>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '20px 20px 16px', textAlign: 'center'
              }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>Arahkan kamera ke barcode produk</p>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button variant="secondary" onClick={reset} fullWidth>✕ Batal</Button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {mode === 'loading' && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Spinner size={52} color={C.primary} />
            <div style={{ marginTop: 20, fontWeight: 700, color: C.textMuted }}>Mencari produk...</div>
          </div>
        )}

        {/* FOUND */}
        {mode === 'found' && result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'tk-fadeIn 0.4s ease' }}>
            <Card padding="none" style={{ overflow: 'hidden' }}>
              <div style={{ height: 120, background: C.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                {getCatIcon(result.category_id)}
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Ditemukan</div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{result.name}</h2>
                  {result.description && <p style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>{result.description}</p>}
                </div>
                {/* Price box */}
                <div style={{ background: C.primary, borderRadius: 16, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700 }}>HARGA</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: 'white' }}>{formatPrice(result.price)}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>per {result.unit}</div>
                  </div>
                  <span style={{ fontSize: 40 }}>🏷️</span>
                </div>
                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['Barcode', result.barcode, true], ['Satuan', result.unit, false]].map(([lbl, val, mono]) => (
                    <div key={lbl} style={{ background: C.bgMuted, borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>{lbl}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2, fontFamily: mono ? 'monospace' : 'inherit', color: C.text }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: result.stock === 0 ? C.dangerBg : result.stock < 10 ? C.warningBg : C.successBg }}>
                  <span style={{ fontSize: 18 }}>{result.stock === 0 ? '❌' : result.stock < 10 ? '⚠️' : '✅'}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: result.stock === 0 ? C.danger : result.stock < 10 ? C.warning : C.success }}>
                    {result.stock === 0 ? 'Stok Habis' : result.stock < 10 ? `Sisa ${result.stock} ${result.unit}` : `${result.stock} ${result.unit} tersedia`}
                  </span>
                </div>
              </div>
            </Card>
            <Button variant="secondary" onClick={reset} fullWidth icon="🔄">Scan Lagi</Button>
          </div>
        )}

        {/* NOT FOUND */}
        {mode === 'notfound' && (
          <div style={{ animation: 'tk-fadeIn 0.3s ease' }}>
            <Card>
              <EmptyState
                icon="🔍"
                title="Tidak Ditemukan"
                description={`Barcode "${barcode}" tidak terdaftar di sistem`}
                action={<Button onClick={reset} icon="🔄">Coba Lagi</Button>}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
