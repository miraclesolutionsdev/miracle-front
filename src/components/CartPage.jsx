import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNotifications } from '../context/NotificationsContext'
import { getTenantSlug } from '../utils/api'
import CheckoutModal from './CheckoutModal'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { alertSuccess, alertError } = useNotifications()
  const navigate = useNavigate()
  const slug = getTenantSlug()
  const [showCheckout, setShowCheckout] = useState(false)

  const handleVolverTienda = () => {
    const hostname = window.location.hostname
    if (hostname !== 'localhost' && !hostname.includes('miraclesolutions.com.co')) {
      navigate('/')
    } else {
      navigate(`/${slug || 'miraclesolutions'}/tienda`)
    }
  }

  const handleRemove = (productoId, nombre) => {
    removeFromCart(productoId)
    alertSuccess(`${nombre} eliminado del carrito`)
  }

  const handleIncrement = (item) => {
    if (item.cantidad < item.maxCantidad) {
      updateQuantity(item.productoId, item.cantidad + 1)
    } else {
      alertError(`Stock máximo disponible: ${item.maxCantidad}`)
    }
  }

  const handleDecrement = (item) => {
    if (item.cantidad > 1) {
      updateQuantity(item.productoId, item.cantidad - 1)
    }
  }

  if (cart.itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#09090e] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-white/20" strokeWidth={1} />
          <h1 className="mt-6 text-3xl font-bold text-white">Tu carrito está vacío</h1>
          <p className="mt-2 text-white/50">Agrega productos para comenzar tu compra</p>
          <button
            onClick={handleVolverTienda}
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
    <>
      <div className="min-h-screen bg-[#09090e] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={handleVolverTienda}
              className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuar comprando
            </button>
            <h1 className="text-2xl font-bold text-white">
              Carrito de compras ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productoId}
                    className="flex gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05]"
                  >
                    {/* Imagen */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/5">
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-white/20" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{item.nombre}</h3>
                        <p className="mt-1 text-sm text-white/50">
                          ${item.precio.toLocaleString('es-CO')} c/u
                        </p>
                        {item.tipo === 'producto' && (
                          <p className="mt-1 text-xs text-white/40">
                            Stock disponible: {item.stock}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={item.cantidad <= 1}
                            className="text-white/60 transition-colors hover:text-white disabled:opacity-30"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2rem] text-center font-semibold text-white">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            disabled={item.cantidad >= item.maxCantidad}
                            className="text-white/60 transition-colors hover:text-white disabled:opacity-30"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="font-bold text-white">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </p>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => handleRemove(item.productoId, item.nombre)}
                          className="ml-auto text-white/40 transition-colors hover:text-red-500"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen */}
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
                  <span className="text-2xl font-bold text-white">
                    ${cart.total.toLocaleString('es-CO')}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 py-4 font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/50"
                >
                  Proceder al pago
                </button>

                <div className="mt-6 space-y-2 text-xs text-white/40">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Pago seguro con MercadoPago
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    Envío a todo el país
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
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
        />
      )}
    </>
  )
}
