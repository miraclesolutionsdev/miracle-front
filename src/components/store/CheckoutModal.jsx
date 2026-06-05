import { useState } from 'react'
import { X, CreditCard } from 'lucide-react'
import { pagosApi } from '../../utils/api'
import { useNotifications } from '../../context/NotificationsContext'
import { useCart } from '../../context/CartContext'

// ─── ESTILOS ──────────────────────────────────────────────────────────────────

const CSS_DARK = `
.modal-back { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeIn 0.15s ease; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.modal-box { background:#09090e; border-radius:20px; width:100%; max-width:600px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.06); animation:slideUp 0.2s ease; max-height:90vh; overflow-y:auto; }
@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.modal-header { display:flex; justify-content:space-between; align-items:flex-start; padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.06); }
.modal-title { font-size:1.25rem; font-weight:700; color:#fff; margin:0; }
.modal-sub { font-size:0.875rem; color:rgba(255,255,255,0.5); margin:0.25rem 0 0; }
.modal-close { background:rgba(255,255,255,0.05); border:none; border-radius:8px; padding:8px; cursor:pointer; color:rgba(255,255,255,0.6); transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
.modal-close:hover { background:rgba(255,255,255,0.1); color:#fff; }
.modal-form { padding:1.5rem; }
.modal-section { font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.5); margin:0 0 0.75rem; font-weight:600; }
.modal-row { display:flex; gap:0.75rem; margin-bottom:0.75rem; }
.modal-input { flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:0.875rem 1rem; color:#fff; font-size:0.875rem; transition:all 0.2s; outline:none; }
.modal-input:focus { border-color:rgba(220,38,38,0.5); background:rgba(255,255,255,0.05); }
.modal-input::placeholder { color:rgba(255,255,255,0.3); }
.modal-input.error { border-color:#ef4444; }
.modal-error { color:#ef4444; font-size:0.75rem; margin-top:0.25rem; }
.modal-divider { height:1px; background:rgba(255,255,255,0.06); margin:1.5rem 0; }
.btn-mp { background:linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border:none; border-radius:14px; color:#fff; font-weight:700; font-size:0.875rem; padding:1rem 1.5rem; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; }
.btn-mp:hover:not(:disabled) { box-shadow:0 10px 25px rgba(220,38,38,0.4); transform:translateY(-1px); }
.btn-mp:disabled { opacity:0.5; cursor:not-allowed; }
.btn-mp-full { width:100%; margin-top:1rem; }
.product-summary { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1rem; margin-bottom:1.5rem; }
.product-summary-item { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.product-summary-item:last-child { border-bottom:none; }
.product-summary-name { color:rgba(255,255,255,0.7); font-size:0.875rem; }
.product-summary-qty { color:rgba(255,255,255,0.5); font-size:0.75rem; margin-left:0.5rem; }
.product-summary-price { color:#fff; font-weight:600; font-size:0.875rem; }
.product-summary-total { display:flex; justify-content:space-between; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.1); margin-top:0.75rem; }
.product-summary-total-label { color:rgba(255,255,255,0.7); font-weight:600; }
.product-summary-total-value { color:#fff; font-size:1.25rem; font-weight:700; }
`

const CSS_EXCLUSIVE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; }

:root {
  --ex-bone: #f7f5f0; --ex-bone-mid: #ede9e1; --ex-bone-border: #e0dbd0;
  --ex-ink: #2c3028; --ex-ink-mid: #4a5246; --ex-ink-soft: #7a8275;
  --ex-sage: #3d4f3a; --ex-sage-mid: #5a7055; --ex-white: #ffffff;
}

.modal-back { position:fixed; inset:0; background:rgba(44,48,40,0.55); backdrop-filter:blur(6px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:1rem; animation:exFadeIn 0.15s ease; }
@keyframes exFadeIn { from { opacity:0; } to { opacity:1; } }
.modal-box { background:var(--ex-white); width:100%; max-width:580px; box-shadow:0 32px 60px -16px rgba(44,48,40,0.18); border:1px solid var(--ex-bone-border); animation:exSlideUp 0.2s ease; max-height:92vh; overflow-y:auto; border-radius:0; font-family:'Inter', sans-serif; }
@keyframes exSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.modal-header { display:flex; justify-content:space-between; align-items:flex-start; padding:1.5rem 1.75rem 1.25rem; border-bottom:1px solid var(--ex-bone-border); }
.modal-title { font-family:'Playfair Display', serif; font-size:1.3rem; font-weight:400; color:var(--ex-ink); margin:0; }
.modal-sub { font-size:0.8rem; color:var(--ex-ink-soft); margin:0.2rem 0 0; letter-spacing:0.02em; }
.modal-close { background:none; border:1px solid var(--ex-bone-border); padding:7px; cursor:pointer; color:var(--ex-ink-soft); transition:all 0.18s; display:flex; align-items:center; justify-content:center; border-radius:0; }
.modal-close:hover { border-color:var(--ex-ink-mid); color:var(--ex-ink); }

.modal-form { padding:1.5rem 1.75rem; }
.modal-section { font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--ex-ink-soft); margin:0 0 0.9rem; }
.modal-row { display:flex; gap:0.6rem; margin-bottom:0.6rem; }
.modal-input { flex:1; background:var(--ex-bone); border:1px solid var(--ex-bone-border); border-radius:0; padding:0.8rem 1rem; color:var(--ex-ink); font-size:0.875rem; font-family:'Inter', sans-serif; transition:border-color 0.18s; outline:none; }
.modal-input:focus { border-color:var(--ex-sage); background:var(--ex-white); }
.modal-input::placeholder { color:var(--ex-ink-soft); font-size:0.82rem; }
.modal-input.error { border-color:#c0392b; }
.modal-error { color:#c0392b; font-size:0.72rem; margin-top:0.2rem; }
.modal-divider { height:1px; background:var(--ex-bone-border); margin:1.4rem 0; }

.btn-mp { background:var(--ex-sage); border:none; color:#fff; font-family:'Inter', sans-serif; font-weight:700; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; padding:1rem 1.5rem; cursor:pointer; transition:background 0.18s; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; border-radius:0; }
.btn-mp:hover:not(:disabled) { background:var(--ex-sage-mid); }
.btn-mp:disabled { opacity:0.5; cursor:not-allowed; }
.btn-mp-full { width:100%; margin-top:1.2rem; }

.product-summary { background:var(--ex-bone); border:1px solid var(--ex-bone-border); padding:1rem 1.1rem; margin-bottom:1.4rem; }
.product-summary-item { display:flex; justify-content:space-between; align-items:center; padding:0.45rem 0; border-bottom:1px solid var(--ex-bone-border); }
.product-summary-item:last-child { border-bottom:none; }
.product-summary-name { color:var(--ex-ink-mid); font-size:0.85rem; }
.product-summary-qty { color:var(--ex-ink-soft); font-size:0.75rem; margin-left:0.4rem; }
.product-summary-price { color:var(--ex-ink); font-weight:500; font-size:0.85rem; }
.product-summary-total { display:flex; justify-content:space-between; align-items:baseline; padding-top:0.75rem; border-top:1px solid var(--ex-bone-border); margin-top:0.5rem; }
.product-summary-total-label { color:var(--ex-ink); font-weight:600; font-size:0.85rem; letter-spacing:0.04em; }
.product-summary-total-value { font-family:'Playfair Display', serif; font-size:1.3rem; font-weight:400; color:var(--ex-ink); }
`

// ─── INPUT ────────────────────────────────────────────────────────────────────

function ModalInput({ name, type = 'text', placeholder, half = false, value, error, onChange }) {
  return (
    <div style={{ flex: half ? 1 : undefined, minWidth: half ? 0 : undefined }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`modal-input ${error ? 'error' : ''}`}
      />
      {error && <div className="modal-error">{error}</div>}
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

export default function CheckoutModal({ producto, cantidad: cantidadSimple, productos, onClose, plantilla }) {
  const { alertError } = useNotifications()
  const { clearCart } = useCart()
  const [datos, setDatos] = useState({
    clienteNombre: '', clienteCelular: '', clienteEmail: '', clienteCedula: '',
    envioDireccion: '', envioBarrio: '', envioUnidad: '', envioTorre: '', envioApto: '',
  })
  const [errs, setErrs] = useState({})
  const [loading, setLoading] = useState(false)

  const isMultiple = !!productos
  const items = isMultiple
    ? productos
    : [{ productoId: producto._id || producto.id, cantidad: cantidadSimple, nombre: producto.nombre, precio: Number(producto.precio), tipo: producto.tipo }]

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const tieneProductosFisicos = items.some((item) => item.tipo === 'producto')

  const set = (k, v) => { setDatos((d) => ({ ...d, [k]: v })); setErrs((e) => ({ ...e, [k]: undefined })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrs = {}
    if (!datos.clienteNombre.trim()) newErrs.clienteNombre = 'Requerido'
    if (!datos.clienteCelular.trim()) newErrs.clienteCelular = 'Requerido'
    if (!datos.clienteEmail.trim()) newErrs.clienteEmail = 'Requerido'
    if (tieneProductosFisicos) {
      if (!datos.envioDireccion.trim()) newErrs.envioDireccion = 'Requerido'
      if (!datos.envioBarrio.trim()) newErrs.envioBarrio = 'Requerido'
    }
    if (Object.keys(newErrs).length > 0) { setErrs(newErrs); return }

    setLoading(true)
    try {
      let init_point
      if (isMultiple) {
        const payload = { productos: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })), ...datos }
        const response = await pagosApi.crearPreferencia(payload)
        init_point = response.init_point
      } else {
        const payload = { productoId: producto._id || producto.id, cantidad: cantidadSimple, ...datos }
        const response = await pagosApi.crearPreferencia(payload)
        init_point = response.init_point
      }
      if (isMultiple) sessionStorage.setItem('miracle_pending_cart_clear', 'true')
      window.location.href = init_point
    } catch (error) {
      alertError(error.message || 'Error al procesar el pago')
      setLoading(false)
    }
  }

  const inp = (name, props = {}) => <ModalInput name={name} value={datos[name]} error={errs[name]} onChange={set} {...props} />

  return (
    <div className="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{plantilla === 'exclusive' ? CSS_EXCLUSIVE : CSS_DARK}</style>
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
          <div className="product-summary">
            {items.map((item, idx) => (
              <div key={idx} className="product-summary-item">
                <div>
                  <span className="product-summary-name">{item.nombre}</span>
                  <span className="product-summary-qty">x{item.cantidad}</span>
                </div>
                <span className="product-summary-price">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div className="product-summary-total">
              <span className="product-summary-total-label">Total</span>
              <span className="product-summary-total-value">${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <p className="modal-section">Datos personales</p>
          <div className="modal-row">{inp('clienteNombre', { placeholder: 'Nombre completo *' })}</div>
          <div className="modal-row">
            {inp('clienteCelular', { type: 'tel', placeholder: 'Celular / WhatsApp *', half: true })}
            {inp('clienteEmail', { type: 'email', placeholder: 'Correo electrónico *', half: true })}
          </div>
          <div className="modal-row">{inp('clienteCedula', { placeholder: 'Cédula / NIT (opcional)' })}</div>

          {tieneProductosFisicos && (
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
