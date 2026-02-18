import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Sun, Moon, LayoutDashboard, Users, Package, Megaphone, Film, BarChart3, ShoppingCart, ShoppingBag, Settings, Wifi, Info } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const SEARCH_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Clientes', path: '/clientes', icon: Users },
  { label: 'Productos', path: '/productos', icon: Package },
  { label: 'Tienda', path: '/configurar-tienda', icon: ShoppingBag },
  { label: 'Configura tus redes', path: '/configura-redes', icon: Wifi },
  { label: 'Información del negocio', path: '/informacion-negocio', icon: Info },
  { label: 'Campañas', path: '/campanas', icon: Megaphone },
  { label: 'Audiovisual', path: '/audiovisual', icon: Film },
  { label: 'Métricas Ads', path: '/metricas-ads', icon: BarChart3 },
  { label: 'Ventas', path: '/ventas', icon: ShoppingCart },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export function Header() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef(null)
  const notifRef = useRef(null)

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return SEARCH_ITEMS
    return SEARCH_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  const handleSearchSelect = (path) => {
    navigate(path)
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Miracle Solutions
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Notificaciones"
              aria-expanded={notifOpen}
            >
              <Bell className="h-4 w-4" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-popover py-2 shadow-lg">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notificaciones
                </div>
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
                  <Bell className="h-8 w-8 opacity-40" />
                  <p>No tienes notificaciones nuevas.</p>
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
            MS
          </div>
        </div>
      </header>

      {/* Modal búsqueda global */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[15vh]" onClick={() => setSearchOpen(false)}>
          <div
            ref={searchRef}
            className="w-full max-w-xl rounded-xl border border-border bg-popover shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar secciones (Dashboard, Clientes, Productos…)"
                className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
            <ul className="max-h-72 overflow-y-auto py-2">
              {filteredItems.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No hay resultados para &quot;{searchQuery}&quot;
                </li>
              ) : (
                filteredItems.map((item) => (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => handleSearchSelect(item.path)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {item.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
