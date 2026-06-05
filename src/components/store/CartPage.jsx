import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useNotifications } from '../../context/NotificationsContext'
import { getTenantSlug, BASE_URL } from '../../utils/api'
import { buildStoreBase } from '../../templates/templateUtils'
import CheckoutModal from './CheckoutModal'

function getCached(slug) {
  try { return sessionStorage.getItem(`miracle_plantilla_${slug}`) || null } catch { return null }
}

function useTemplateSlug() {
  const slug = getTenantSlug()
  const [plantilla, setPlantilla] = useState(() => slug ? getCached(slug) : null)

  useEffect(() => {
    if (!slug || plantilla) return
    fetch(`${BASE_URL}/store-config/info?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.plantilla || 'luxury'
        setPlantilla(p)
        try { sessionStorage.setItem(`miracle_plantilla_${slug}`, p) } catch {}
      })
      .catch(() => setPlantilla('luxury'))
  }, [slug, plantilla])

  return { slug, plantilla }
}

// ─── CARRITO EXCLUSIVE ────────────────────────────────────────────────────────

function CartExclusive({ cart, onBack, onRemove, onIncrement, onDecrement, onCheckout }) {
  return (
    <>
      <style>{CSS_EXCLUSIVE}</style>
      <div className="cx-wrapper">
        <nav className="cx-nav">
          <button className="cx-back" onClick={onBack}>← Continuar comprando</button>
          <span className="cx-nav-title">
            Carrito ({cart.itemCount} {cart.itemCount === 1 ? 'artículo' : 'artículos'})
          </span>
        </nav>

        {cart.itemCount === 0 ? (
          <div className="cx-empty">
            <ShoppingBag className="cx-empty-icon" strokeWidth={1} />
            <h1 className="cx-empty-title">Tu carrito está vacío</h1>
            <p className="cx-empty-sub">Agrega productos para comenzar tu compra</p>
            <button className="cx-btn-store" onClick={onBack}>Ir a la tienda</button>
          </div>
        ) : (
          <div className="cx-layout">
            <div className="cx-items">
              {cart.items.map((item) => (
                <div key={item.productoId} className="cx-item">
                  <div className="cx-item-img">
                    {item.imagen
                      ? <img src={item.imagen} alt={item.nombre} />
                      : <ShoppingBag className="cx-item-img-ph" strokeWidth={1} />
                    }
                  </div>
                  <div className="cx-item-info">
                    <p className="cx-item-name">{item.nombre}</p>
                    <p className="cx-item-price">${item.precio.toLocaleString('es-CO')} c/u</p>
                    {item.tipo === 'producto' && (
                      <p className="cx-item-stock">Stock: {item.stock}</p>
                    )}
                    <div className="cx-item-row">
                      <div className="cx-qty">
                        <button className="cx-qty-btn" onClick={() => onDecrement(item)} disabled={item.cantidad <= 1}>
                          <Minus size={12} />
                        </button>
                        <span className="cx-qty-num">{item.cantidad}</span>
                        <button className="cx-qty-btn" onClick={() => onIncrement(item)} disabled={item.cantidad >= item.maxCantidad}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="cx-item-subtotal">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                      <button className="cx-item-del" onClick={() => onRemove(item.productoId, item.nombre)} aria-label="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cx-summary">
              <div className="cx-summary-inner">
                <p className="cx-summary-title">Resumen de compra</p>
                <div className="cx-summary-rows">
                  <div className="cx-summary-row">
                    <span>Subtotal</span>
                    <span>${cart.total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="cx-summary-row">
                    <span>Envío</span>
                    <span className="cx-summary-muted">Calculado en checkout</span>
                  </div>
                </div>
                <div className="cx-summary-total">
                  <span>Total</span>
                  <span>${cart.total.toLocaleString('es-CO')}</span>
                </div>
                <button className="cx-btn-checkout" onClick={onCheckout}>Proceder al pago</button>
                <div className="cx-trust">
                  <p><span className="cx-trust-dot" />Pago seguro con MercadoPago</p>
                  <p><span className="cx-trust-dot" />Envío a todo el país</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── CARRITO GENÉRICO (oscuro) ─────────────────────────────────────────────

function CartGeneric({ cart, onBack, onRemove, onIncrement, onDecrement, onCheckout }) {
  if (cart.itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#09090e] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-white/20" strokeWidth={1} />
          <h1 className="mt-6 text-3xl font-bold text-white">Tu carrito está vacío</h1>
          <p className="mt-2 text-white/50">Agrega productos para comenzar tu compra</p>
          <button
            onClick={onBack}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/50"
          >
            <ArrowLeft className="h-5 w-5" />
            Ir a la tienda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090e] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </button>
          <h1 className="text-2xl font-bold text-white">
            Carrito de compras ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productoId} className="flex gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5">
                  {item.imagen
                    ? <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover" />
                    : <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-white/20" /></div>
                  }
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{item.nombre}</h3>
                    <p className="mt-1 text-sm text-white/50">${item.precio.toLocaleString('es-CO')} c/u</p>
                    {item.tipo === 'producto' && <p className="mt-1 text-xs text-white/40">Stock disponible: {item.stock}</p>}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
                      <button onClick={() => onDecrement(item)} disabled={item.cantidad <= 1} className="text-white/60 hover:text-white disabled:opacity-30"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-[2rem] text-center font-semibold text-white">{item.cantidad}</span>
                      <button onClick={() => onIncrement(item)} disabled={item.cantidad >= item.maxCantidad} className="text-white/60 hover:text-white disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                    </div>
                    <p className="font-bold text-white">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                    <button onClick={() => onRemove(item.productoId, item.nombre)} className="ml-auto text-white/40 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/[0.06]">
              <h2 className="mb-6 text-xl font-bold text-white">Resumen de compra</h2>
              <div className="space-y-3 border-b border-white/10 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">${cart.total.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Envío</span>
                  <span className="text-white/50">Calculado en checkout</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-white">${cart.total.toLocaleString('es-CO')}</span>
              </div>
              <button onClick={onCheckout} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 py-4 font-bold text-white">
                Proceder al pago
              </button>
              <div className="mt-6 space-y-2 text-xs text-white/40">
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Pago seguro con MercadoPago</p>
                <p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Envío a todo el país</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { alertSuccess, alertError } = useNotifications()
  const navigate = useNavigate()
  const { slug, plantilla } = useTemplateSlug()
  const [showCheckout, setShowCheckout] = useState(false)

  const handleBack = () => navigate(buildStoreBase(slug))
  const handleRemove = (productoId, nombre) => { removeFromCart(productoId); alertSuccess(`${nombre} eliminado del carrito`) }
  const handleIncrement = (item) => {
    if (item.cantidad < item.maxCantidad) updateQuantity(item.productoId, item.cantidad + 1)
    else alertError(`Stock máximo disponible: ${item.maxCantidad}`)
  }
  const handleDecrement = (item) => { if (item.cantidad > 1) updateQuantity(item.productoId, item.cantidad - 1) }

  const handlers = { cart, onBack: handleBack, onRemove: handleRemove, onIncrement: handleIncrement, onDecrement: handleDecrement, onCheckout: () => setShowCheckout(true) }

  if (!plantilla) {
    return <div style={{ minHeight: '100vh', background: '#f7f5f0' }} />
  }

  return (
    <>
      {plantilla === 'exclusive'
        ? <CartExclusive {...handlers} />
        : <CartGeneric {...handlers} />
      }

      {showCheckout && (
        <CheckoutModal
          productos={cart.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            nombre: item.nombre,
            precio: item.precio,
            tipo: item.tipo,
          }))}
          onClose={() => setShowCheckout(false)}
          plantilla={plantilla}
        />
      )}
    </>
  )
}

// ─── CSS EXCLUSIVE ────────────────────────────────────────────────────────────

const CSS_EXCLUSIVE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ex-bone: #f7f5f0;
    --ex-bone-mid: #ede9e1;
    --ex-bone-border: #e0dbd0;
    --ex-ink: #2c3028;
    --ex-ink-mid: #4a5246;
    --ex-ink-soft: #7a8275;
    --ex-sage: #3d4f3a;
    --ex-sage-mid: #5a7055;
    --ex-sage-mist: #c8d5c2;
    --ex-gold: #b89a5a;
    --ex-white: #ffffff;
  }

  .cx-wrapper { min-height: 100vh; background: var(--ex-bone); font-family: 'Inter', sans-serif; color: var(--ex-ink); -webkit-font-smoothing: antialiased; }

  /* NAV */
  .cx-nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid var(--ex-bone-border); padding: 0 2rem; height: 52px; display: flex; align-items: center; justify-content: space-between; }
  .cx-back { background: none; border: none; color: var(--ex-ink-mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; padding: 0; transition: color 0.15s; }
  .cx-back:hover { color: var(--ex-ink); }
  .cx-nav-title { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ex-ink-soft); }

  /* EMPTY */
  .cx-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 4rem 2rem; text-align: center; }
  .cx-empty-icon { width: 64px; height: 64px; color: var(--ex-bone-border); margin-bottom: 1.5rem; }
  .cx-empty-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 400; color: var(--ex-ink); margin-bottom: 0.5rem; }
  .cx-empty-sub { font-size: 0.88rem; color: var(--ex-ink-soft); margin-bottom: 2rem; }
  .cx-btn-store { background: var(--ex-sage); color: #fff; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.85rem 2.2rem; cursor: pointer; transition: background 0.18s; }
  .cx-btn-store:hover { background: var(--ex-sage-mid); }

  /* LAYOUT */
  .cx-layout { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 5rem; display: grid; grid-template-columns: 1fr 340px; gap: 3rem; align-items: start; }

  /* ITEMS */
  .cx-items { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--ex-bone-border); }
  .cx-item { display: flex; gap: 1.25rem; padding: 1.4rem; background: var(--ex-white); border-bottom: 1px solid var(--ex-bone-border); transition: background 0.15s; }
  .cx-item:last-child { border-bottom: none; }
  .cx-item:hover { background: var(--ex-bone); }

  .cx-item-img { width: 88px; height: 88px; flex-shrink: 0; overflow: hidden; background: var(--ex-bone-mid); display: flex; align-items: center; justify-content: center; }
  .cx-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .cx-item-img-ph { width: 32px; height: 32px; color: var(--ex-bone-border); }

  .cx-item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .cx-item-name { font-size: 14px; font-weight: 500; color: var(--ex-ink); line-height: 1.35; }
  .cx-item-price { font-size: 12px; color: var(--ex-ink-soft); }
  .cx-item-stock { font-size: 11px; color: var(--ex-ink-soft); opacity: 0.7; }
  .cx-item-row { display: flex; align-items: center; gap: 1rem; margin-top: 0.6rem; }

  .cx-qty { display: flex; align-items: center; gap: 0; border: 1px solid var(--ex-bone-border); }
  .cx-qty-btn { background: none; border: none; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ex-ink-mid); transition: background 0.15s; }
  .cx-qty-btn:hover:not(:disabled) { background: var(--ex-bone-mid); }
  .cx-qty-btn:disabled { opacity: 0.3; cursor: default; }
  .cx-qty-num { min-width: 32px; text-align: center; font-size: 13px; font-weight: 600; color: var(--ex-ink); }

  .cx-item-subtotal { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 400; color: var(--ex-ink); }
  .cx-item-del { margin-left: auto; background: none; border: none; color: var(--ex-ink-soft); cursor: pointer; padding: 4px; transition: color 0.15s; }
  .cx-item-del:hover { color: #c0392b; }

  /* SUMMARY */
  .cx-summary { position: sticky; top: 68px; }
  .cx-summary-inner { border: 1px solid var(--ex-bone-border); background: var(--ex-white); padding: 1.8rem; }
  .cx-summary-title { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ex-ink-soft); margin-bottom: 1.4rem; }
  .cx-summary-rows { display: flex; flex-direction: column; gap: 0.75rem; padding-bottom: 1.2rem; border-bottom: 1px solid var(--ex-bone-border); margin-bottom: 1.2rem; }
  .cx-summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--ex-ink-mid); }
  .cx-summary-muted { color: var(--ex-ink-soft); font-style: italic; }
  .cx-summary-total { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; }
  .cx-summary-total span:first-child { font-size: 13px; font-weight: 600; color: var(--ex-ink); letter-spacing: 0.04em; }
  .cx-summary-total span:last-child { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 400; color: var(--ex-ink); }

  .cx-btn-checkout { width: 100%; background: var(--ex-sage); color: #fff; border: none; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 1rem; cursor: pointer; transition: background 0.18s; margin-bottom: 1.2rem; }
  .cx-btn-checkout:hover { background: var(--ex-sage-mid); }

  .cx-trust { display: flex; flex-direction: column; gap: 0.5rem; }
  .cx-trust p { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--ex-ink-soft); }
  .cx-trust-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #4caf7d; flex-shrink: 0; }

  @media (max-width: 768px) {
    .cx-layout { grid-template-columns: 1fr; padding: 1.5rem 1.2rem 4rem; gap: 2rem; }
    .cx-summary { position: static; }
    .cx-nav { padding: 0 1.2rem; }
    .cx-nav-title { display: none; }
  }
`
