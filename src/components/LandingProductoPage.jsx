import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductos } from '../context/ProductosContext.jsx'
import { productosApi, pagosApi, BASE_URL } from '../utils/api'
import { CreditCard, X, Package } from 'lucide-react'
import { getLandingTemplate } from '../templates'
import { alertError } from '../utils/alerts'

const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`
const WHATSAPP_NUMBER = '573243520379'
const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

function isCustomDomain() {
  const h = window.location.hostname
  return h !== 'localhost' && h !== MAIN_DOMAIN && h !== `www.${MAIN_DOMAIN}`
}

/* ── Modal input ── */
function ModalInput({ name, type = 'text', placeholder, half = false, value, error, onChange }) {
  return (
    <div style={{ flex: half ? '1 1 44%' : '1 1 100%', minWidth: half ? 120 : 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="modal-input"
        style={{ borderColor: error ? '#C8352B' : undefined }}
      />
      {error && <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: '#C8352B' }}>{error}</span>}
    </div>
  )
}

/* ── Payment Modal (shared across all templates) ── */
function PagoModal({ producto, cantidad, loading, onClose, onSubmit }) {
  const [datos, setDatos] = useState({
    clienteNombre: '', clienteCelular: '', clienteEmail: '', clienteCedula: '',
    envioDireccion: '', envioBarrio: '', envioUnidad: '', envioTorre: '', envioApto: '',
  })
  const [errs, setErrs] = useState({})

  const set = (k, v) => { setDatos((d) => ({ ...d, [k]: v })); setErrs((e) => ({ ...e, [k]: undefined })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrs = {}
    if (!datos.clienteNombre.trim()) newErrs.clienteNombre = 'Requerido'
    if (!datos.clienteCelular.trim()) newErrs.clienteCelular = 'Requerido'
    if (!datos.clienteEmail.trim()) newErrs.clienteEmail = 'Requerido'
    if (producto?.tipo === 'producto') {
      if (!datos.envioDireccion.trim()) newErrs.envioDireccion = 'Requerido'
      if (!datos.envioBarrio.trim()) newErrs.envioBarrio = 'Requerido'
    }
    if (Object.keys(newErrs).length > 0) { setErrs(newErrs); return }
    onSubmit(datos)
  }

  const inp = (name, props = {}) => (
    <ModalInput name={name} value={datos[name]} error={errs[name]} onChange={set} {...props} />
  )

  return (
    <div className="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{MODAL_CSS}</style>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Completa tus datos</h2>
            <p className="modal-sub">Para procesar tu pedido correctamente</p>
          </div>
          <button type="button" onClick={onClose} className="modal-close">
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p className="modal-section">Datos personales</p>
          <div className="modal-row">{inp('clienteNombre', { placeholder: 'Nombre completo *' })}</div>
          <div className="modal-row">
            {inp('clienteCelular', { type: 'tel', placeholder: 'Celular / WhatsApp *', half: true })}
            {inp('clienteEmail', { type: 'email', placeholder: 'Correo electrónico *', half: true })}
          </div>
          <div className="modal-row">{inp('clienteCedula', { placeholder: 'Cédula / NIT (opcional)' })}</div>

          {producto?.tipo === 'producto' && (
            <>
              <div className="modal-divider" />
              <p className="modal-section">Datos de envío</p>
              <div className="modal-row">{inp('envioDireccion', { placeholder: 'Dirección *' })}</div>
              <div className="modal-row">{inp('envioBarrio', { placeholder: 'Barrio / Ciudad *' })}</div>
              <div className="modal-row">{inp('envioUnidad', { placeholder: 'Unidad residencial (opcional)' })}</div>
              <div className="modal-row">
                {inp('envioTorre', { placeholder: 'Torre / Bloque', half: true })}
                {inp('envioApto', { placeholder: 'Apto / Casa', half: true })}
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-mp btn-mp-full">
            <CreditCard style={{ width: 15, height: 15 }} />
            {loading ? 'Procesando...' : 'Continuar al pago'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Main Page (data wrapper — delegates rendering to template) ── */
function LandingProductoPage({ defaultSlug } = {}) {
  const { productoId: id, slug: slugFromParams } = useParams()
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

  const handlePago = async (datos) => {
    setLoadingPago(true)
    try {
      const { init_point } = await pagosApi.crearPreferencia({ productoId: producto.id, cantidad, ...datos })
      window.location.href = init_point
    } catch {
      alertError('No se pudo iniciar el pago. Contáctanos por WhatsApp.')
    } finally {
      setLoadingPago(false)
    }
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
      <LandingComponent
        producto={producto}
        cantidad={cantidad}
        setCantidad={setCantidad}
        maxCantidad={maxCantidad}
        sinStock={sinStock}
        stockBajo={stockBajo}
        onWhatsApp={handleWhatsApp}
        onComprar={() => !sinStock && setShowModal(true)}
        loadingPago={loadingPago}
        navigateBack={navigateBack}
        tenantSlug={tenantSlug}
      />
      {showModal && (
        <PagoModal
          producto={producto}
          cantidad={cantidad}
          loading={loadingPago}
          onClose={() => setShowModal(false)}
          onSubmit={handlePago}
        />
      )}
    </>
  )
}

export default LandingProductoPage

/* ── MODAL STYLES (shared) ── */
const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .modal-back {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(13,13,13,0.55);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: #fff;
    width: 100%; max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: none;
    animation: slideUp 0.25s ease;
    border: 1px solid #E8E4DF;
    border-radius: 8px;
  }
  .modal-box::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-header {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    padding: 24px 24px 20px;
    border-bottom: 1px solid #F0EDE9;
  }
  .modal-title {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 700;
    color: #0D0D0D; line-height: 1;
  }
  .modal-sub { font-family: 'Outfit',sans-serif; font-size: 13px; color: #8A8480; margin-top: 5px; }
  .modal-close {
    width: 34px; height: 34px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #F8F5F1; border: 1px solid #E8E4DF;
    color: #8A8480; cursor: pointer; transition: all 0.15s ease;
    border-radius: 50%;
  }
  .modal-close:hover { background: #0D0D0D; color: #fff; border-color: #0D0D0D; }
  .modal-form { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 10px; }
  .modal-section {
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
    color: #C0BAB3; margin-top: 4px;
  }
  .modal-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .modal-input {
    width: 100%;
    background: #F8F5F1;
    border: 1.5px solid #E8E4DF;
    padding: 12px 14px;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    color: #0D0D0D; outline: none;
    transition: border-color 0.18s ease;
    border-radius: 6px;
  }
  .modal-input::placeholder { color: #C0BAB3; }
  .modal-input:focus { border-color: #0D0D0D; background: #fff; }
  .modal-divider { height: 1px; background: #F0EDE9; margin: 4px 0; }
  .btn-mp {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 15px;
    background: #009ee3;
    border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
    transition: opacity 0.18s ease;
    border-radius: 6px;
  }
  .btn-mp:hover:not(:disabled) { opacity: 0.9; }
  .btn-mp:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn-mp-full { margin-top: 4px; }
  @media (max-width: 480px) {
    .modal-header { padding: 18px 16px 16px; }
    .modal-form { padding: 16px 16px 20px; }
    .modal-row { flex-direction: column; }
  }
`
