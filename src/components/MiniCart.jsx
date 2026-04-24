import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getTenantSlug } from '../utils/api'

export default function MiniCart({ position = 'floating' }) {
  const { cart } = useCart()
  const navigate = useNavigate()
  const slug = getTenantSlug()

  const handleClick = () => {
    const hostname = window.location.hostname
    // Si es dominio custom, ir a /carrito. Si no, ir a /:slug/carrito
    if (hostname !== 'localhost' && !hostname.includes('miraclesolutions.com.co')) {
      navigate('/carrito')
    } else {
      navigate(`/${slug || 'miraclesolutions'}/carrito`)
    }
  }

  if (cart.itemCount === 0) return null

  return (
    <button
      onClick={handleClick}
      className={`
        group relative flex items-center gap-2 transition-all duration-300
        ${position === 'floating'
          ? 'fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 shadow-2xl hover:shadow-red-500/50 hover:scale-105'
          : 'rounded-xl bg-white/5 px-4 py-2 hover:bg-white/10'
        }
      `}
      aria-label="Ver carrito"
    >
      <div className="relative">
        <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2} />
        <span
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-red-600"
        >
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      </div>
      {position === 'floating' && (
        <span className="text-sm font-bold text-white">
          ${cart.total.toLocaleString('es-CO')}
        </span>
      )}
    </button>
  )
}
