import { ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getTenantSlug, BASE_URL } from '../utils/api'
import { useState, useEffect } from 'react'

const THEME_STYLES = {
  fitness: {
    floating: 'fixed bottom-6 right-6 z-50 rounded-sm bg-[#39FF14] px-5 py-3 shadow-2xl hover:shadow-[#39FF14]/30 hover:scale-105 border-2 border-[#39FF14]',
    header: 'rounded-sm bg-[#39FF14] px-4 py-2.5 hover:bg-[#2ee610] transition-all shadow-lg shadow-[#39FF14]/20',
    textColor: 'text-[#0A0A0A]',
    badgeBg: 'bg-[#0A0A0A]',
    badgeText: 'text-[#39FF14]',
    iconColor: 'text-[#0A0A0A]',
  },
  luxury: {
    floating: 'fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 shadow-2xl hover:shadow-red-500/50 hover:scale-105',
    header: 'rounded-xl bg-white/5 px-4 py-2 hover:bg-white/10',
    textColor: 'text-white',
    badgeBg: 'bg-white',
    badgeText: 'text-red-600',
    iconColor: 'text-white',
  },
}

export default function MiniCart({ position = 'floating', theme }) {
  const [autoTheme, setAutoTheme] = useState('luxury')
  const { cart } = useCart()
  const navigate = useNavigate()
  const slug = getTenantSlug()

  // Auto-detectar theme si no se proporciona
  useEffect(() => {
    if (theme) return

    const detectTheme = async () => {
      try {
        const hostname = window.location.hostname
        const isCustom = hostname !== 'localhost' && !hostname.includes('miraclesolutions.com.co')

        if (isCustom) {
          const res = await fetch(`${BASE_URL}/store-config/dominio?hostname=${encodeURIComponent(hostname)}`)
          const data = await res.json()
          setAutoTheme(data.plantilla || 'luxury')
        } else if (slug) {
          const res = await fetch(`${BASE_URL}/store-config/info?slug=${slug}`)
          const data = await res.json()
          setAutoTheme(data.plantilla || 'luxury')
        }
      } catch {
        setAutoTheme('luxury')
      }
    }

    detectTheme()
  }, [theme, slug])

  const handleClick = () => {
    const hostname = window.location.hostname
    if (hostname !== 'localhost' && !hostname.includes('miraclesolutions.com.co')) {
      navigate('/carrito')
    } else {
      navigate(`/${slug || 'miraclesolutions'}/carrito`)
    }
  }

  if (cart.itemCount === 0) return null

  const activeTheme = theme || autoTheme
  const styles = THEME_STYLES[activeTheme] || THEME_STYLES.luxury
  const positionClass = position === 'floating' ? styles.floating : styles.header

  return (
    <button
      onClick={handleClick}
      className={`group relative flex items-center gap-2 transition-all duration-300 ${positionClass}`}
      aria-label="Ver carrito"
    >
      <div className="relative">
        <ShoppingBag className={`h-5 w-5 ${styles.iconColor}`} strokeWidth={2.5} />
        <span
          className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full ${styles.badgeBg} text-[10px] font-bold ${styles.badgeText}`}
        >
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      </div>
      {position === 'floating' && (
        <span className={`text-sm font-bold ${styles.textColor}`}>
          ${cart.total.toLocaleString('es-CO')}
        </span>
      )}
    </button>
  )
}
