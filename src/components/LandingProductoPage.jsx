import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { productosApi, BASE_URL } from '../utils/api'
import { Package } from 'lucide-react'
import { getLandingTemplate } from '../templates'
import CheckoutModal from './CheckoutModal'
import MiniCart from './MiniCart'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const WHATSAPP_NUMBER = '573243520379'
const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

function isCustomDomain() {
  const h = window.location.hostname
  return h !== 'localhost' && h !== MAIN_DOMAIN && h !== `www.${MAIN_DOMAIN}`
}

/* ── Main Page (data wrapper — delegates rendering to template) ── */
function LandingProductoPage({ defaultSlug } = {}) {
  const { productoId: id, slug: slugFromParams } = useParams()
  const { addToCart, isInCart } = useCart()
  const { alertSuccess } = useNotifications()
  const navigate = useNavigate()
  const { findProductoById } = useProductos()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [loadingPago, setLoadingPago] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [tenantSlug, setTenantSlug] = useState(slugFromParams || defaultSlug || null)
  const [plantilla, setPlantilla] = useState('luxury')

  useEffect(() => {
    document.title = 'Miracle Store'
    return () => { document.title = 'Miracle Solutions - Dashboard' }
  }, [])

  // Resolver slug si no viene ni de la URL ni de prop
  useEffect(() => {
    if (slugFromParams) { setTenantSlug(slugFromParams); return }
    if (defaultSlug) { setTenantSlug(defaultSlug); return }
    if (!isCustomDomain()) return
    const hostname = window.location.hostname.replace(/^www\./, '')
    fetch(`${BASE_URL}/store-config/dominio?hostname=${encodeURIComponent(hostname)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.slug) setTenantSlug(d.slug)
        if (d.plantilla) setPlantilla(d.plantilla)
      })
      .catch(() => setError(new Error('No se pudo resolver la tienda.')))
  }, [slugFromParams, defaultSlug])

  // Fetch plantilla when slug is known
  useEffect(() => {
    if (!tenantSlug) return
    fetch(`${BASE_URL}/store-config/info?slug=${tenantSlug}`)
      .then((r) => r.json())
      .then((d) => { if (d.plantilla) setPlantilla(d.plantilla) })
      .catch(() => {})
  }, [tenantSlug])

  // Fetch producto
  useEffect(() => {
    if (!tenantSlug) return
    let cancel = false
    async function load() {
      setCargando(true); setError(null); window.scrollTo(0, 0)
      try {
        const local = findProductoById(id)
        if (local) { if (!cancel) { setProducto(local); setCargando(false) }; return }
        const data = await productosApi.obtenerPublico(id, tenantSlug)
        if (!cancel) { setProducto(data); setCargando(false) }
      } catch (e) {
        if (!cancel) { setError(e); setCargando(false) }
      }
    }
    load()
    return () => { cancel = true }
  }, [id, tenantSlug, findProductoById])

  const handleWhatsApp = () => {
    const msg = [
      'Hola, estoy interesado en:',
      `• Producto: ${producto.nombre}`,
      cantidad > 1 ? `• Cantidad: ${cantidad}` : '',
      producto.precio != null ? `• Precio: ${fmt(producto.precio)}` : '',
      producto.precio != null && cantidad > 1 ? `• Total: ${fmt(producto.precio * cantidad)}` : '',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  const handleAddToCart = () => {
    addToCart(producto, cantidad)
    alertSuccess(`${producto.nombre} agregado al carrito`)
  }

  const navigateBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(isCustomDomain() || defaultSlug ? '/' : (tenantSlug ? `/${tenantSlug}/tienda` : '/'))
    }
  }

  // Loading state
  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #E8E4DF', borderTopColor: '#999', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Error state
  if (error || !producto) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: "'Outfit', sans-serif" }}>
        <Package strokeWidth={1} style={{ width: 44, height: 44, color: '#E8E4DF', marginBottom: 16 }} />
        <p style={{ fontSize: 14, color: '#8A8480', marginBottom: 24 }}>
          {error ? 'No se pudo cargar el producto.' : 'Producto no disponible.'}
        </p>
        <button type="button" onClick={navigateBack} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#0D0D0D', background: '#fff', border: '1.5px solid #0D0D0D', borderRadius: 100, padding: '10px 22px', cursor: 'pointer' }}>
          Volver a la tienda
        </button>
      </div>
    )
  }

  const sinStock = producto.stock != null && producto.stock <= 0
  const stockBajo = producto.stock != null && producto.stock > 0 && producto.stock <= 10
  const maxCantidad = (producto.tipo === 'producto' && producto.stock > 0) ? producto.stock : 99

  const LandingComponent = getLandingTemplate(plantilla)

  return (
    <>
      <MiniCart position="floating" />
      <LandingComponent
        producto={producto}
        cantidad={cantidad}
        setCantidad={setCantidad}
        maxCantidad={maxCantidad}
        sinStock={sinStock}
        stockBajo={stockBajo}
        onWhatsApp={handleWhatsApp}
        onAddToCart={handleAddToCart}
        onComprar={() => !sinStock && setShowModal(true)}
        isInCart={isInCart(producto.id)}
        navigateBack={navigateBack}
        tenantSlug={tenantSlug}
      />
      {showModal && (
        <CheckoutModal
          producto={producto}
          cantidad={cantidad}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default LandingProductoPage
