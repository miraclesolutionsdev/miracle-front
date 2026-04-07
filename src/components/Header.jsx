import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, LayoutDashboard, Users, Package, Megaphone, Film, BarChart3, ShoppingCart, ShoppingBag, Settings, LogOut, ShieldCheck, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'

// ─── Helpers para notificaciones ────────────────────────────────────────────
const NOTIF_CONFIG = {
  cliente_creado:      { icon: Users,        color: 'text-blue-500',   bg: 'bg-blue-500/10',    ruta: '/plataforma/clientes' },
  producto_creado:     { icon: Package,      color: 'text-emerald-500',bg: 'bg-emerald-500/10', ruta: '/plataforma/productos' },
  producto_inactivado: { icon: Package,      color: 'text-orange-500', bg: 'bg-orange-500/10',  ruta: '/plataforma/productos' },
  campana_creada:      { icon: Megaphone,    color: 'text-violet-500', bg: 'bg-violet-500/10',  ruta: '/plataforma/campanas' },
  campana_estado:      { icon: Megaphone,    color: 'text-indigo-500', bg: 'bg-indigo-500/10',  ruta: '/plataforma/campanas' },
  audiovisual_subido:  { icon: Film,         color: 'text-cyan-500',   bg: 'bg-cyan-500/10',    ruta: '/plataforma/audiovisual' },
  audiovisual_estado:  { icon: Film,         color: 'text-cyan-400',   bg: 'bg-cyan-400/10',    ruta: '/plataforma/audiovisual' },
  orden_creada:        { icon: ShoppingCart, color: 'text-green-500',  bg: 'bg-green-500/10',   ruta: '/plataforma/ventas' },
  orden_estado:        { icon: ShoppingCart, color: 'text-yellow-500', bg: 'bg-yellow-500/10',  ruta: '/plataforma/ventas' },
  orden_pago:          { icon: ShoppingCart, color: 'text-green-400',  bg: 'bg-green-400/10',   ruta: '/plataforma/ventas' },
  ticket_creado:       { icon: ShoppingCart, color: 'text-blue-400',   bg: 'bg-blue-400/10',    ruta: '/plataforma/ventas' },
  orden_cancelada:     { icon: ShoppingCart, color: 'text-red-500',    bg: 'bg-red-500/10',     ruta: '/plataforma/ventas' },
}

function tiempoRelativo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`
  if (diff < 172800) return 'Ayer'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

const SEARCH_ITEMS = [
  { label: 'Dashboard', path: '/plataforma', icon: LayoutDashboard },
  { label: 'Clientes', path: '/plataforma/clientes', icon: Users },
  { label: 'Productos', path: '/plataforma/productos', icon: Package },
  { label: 'Tienda', path: '/plataforma/configurar-tienda', icon: ShoppingBag },
  { label: 'Campañas', path: '/plataforma/campanas', icon: Megaphone },
  { label: 'Audiovisual', path: '/plataforma/audiovisual', icon: Film },
  { label: 'Métricas Ads', path: '/plataforma/metricas-ads', icon: BarChart3 },
  { label: 'Ventas', path: '/plataforma/ventas', icon: ShoppingCart },
  { label: 'Administradores', path: '/plataforma/administradores', icon: ShieldCheck },
  { label: 'Configuración', path: '/plataforma/configuracion', icon: Settings },
]

function TenantMonogram({ name, size = 'md' }) {
  const initials = name
    ? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
    : 'M'

  const hue = name
    ? Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    : 260

  const sizeClass = size === 'lg' ? 'h-9 w-9 rounded-xl text-[12px]' : 'h-8 w-8 rounded-lg text-[11px]'

  return (
    <div
      className={`flex shrink-0 items-center justify-center text-white font-bold tracking-wide shadow-md select-none ${sizeClass}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 65%, 52%), hsl(${(hue + 30) % 360}, 70%, 45%))`,
        boxShadow: `0 4px 12px hsl(${hue}deg 55% 45% / 0.30)`,
      }}
    >
      {initials}
    </div>
  )
}

export function Header({ slug }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  const tenantName = user?.tenantNombre || 'Plataforma'
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications()

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return SEARCH_ITEMS
    return SEARCH_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
        return
      }
      const tag = e.target.tagName
      if (e.key === '/' && !searchOpen && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  const handleSearchSelect = (path) => {
    navigate(path)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const userInitials = user?.nombre
    ? user.nombre.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const userName = user?.nombre?.split(' ')[0] || null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 backdrop-blur-xl px-4 sm:px-6 gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <TenantMonogram name={tenantName} size="lg" />
          <span className="text-base font-semibold text-foreground tracking-tight truncate max-w-[180px] sm:max-w-sm">
            {tenantName}
          </span>
        </div>

        {/* Search — ocupa el espacio central */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 max-w-md h-9 items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3.5 text-[13px] text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:border-border/80"
          aria-label="Buscar"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Buscar secciones...</span>
          <kbd className="flex h-5 select-none items-center rounded border border-border bg-background/80 px-1.5 font-mono text-[10px] text-muted-foreground/70">
            /
          </kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Notificaciones"
              aria-expanded={notifOpen}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-1 ring-card">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden">
                {/* Header del panel */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Notificaciones</span>
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1.5 text-[11px] font-semibold text-red-500">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Marcar todas leídas
                    </button>
                  )}
                </div>

                {/* Lista */}
                <ul className="max-h-[420px] overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <li className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                        <Bell className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                    </li>
                  ) : (
                    notifications.map((notif) => {
                      const cfg = NOTIF_CONFIG[notif.tipo] ?? { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', ruta: '/plataforma' }
                      const Icon = cfg.icon
                      return (
                        <li key={notif.id}>
                          <button
                            type="button"
                            onClick={() => {
                              markOneRead(notif.id)
                              setNotifOpen(false)
                              navigate(cfg.ruta)
                            }}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${!notif.leida ? 'bg-primary/[0.03]' : ''}`}
                          >
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                              <Icon className={`h-4 w-4 ${cfg.color}`} strokeWidth={1.8} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-[12.5px] font-medium leading-tight ${!notif.leida ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notif.titulo}
                                </p>
                                <span className="shrink-0 text-[10px] text-muted-foreground/60 mt-0.5">
                                  {tiempoRelativo(notif.createdAt)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[11.5px] text-muted-foreground leading-snug line-clamp-2">
                                {notif.mensaje}
                              </p>
                            </div>
                            {!notif.leida && (
                              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                          </button>
                        </li>
                      )
                    })
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-0.5 h-5 w-px bg-border" />

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex h-8 items-center gap-2 rounded-lg px-1.5 transition-colors hover:bg-accent"
              aria-label="Menú de usuario"
              aria-expanded={userMenuOpen}
            >
              {userName && (
                <span className="hidden sm:block text-[12px] text-muted-foreground font-medium">
                  {userName}
                </span>
              )}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/25">
                {userInitials}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  {user?.nombre && (
                    <p className="text-[13px] font-semibold text-foreground truncate">{user.nombre}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => { setUserMenuOpen(false); navigate('/plataforma/configuracion') }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    Configuración
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUserMenuOpen(false); navigate('/plataforma/administradores') }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-foreground hover:bg-accent transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    Administradores
                  </button>
                  <div className="my-1 h-px bg-border mx-3" />
                  <button
                    type="button"
                    onClick={() => { logout(); setUserMenuOpen(false); navigate('/login') }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal búsqueda global */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
          onClick={() => setSearchOpen(false)}
        >
          <div
            ref={searchRef}
            className="w-full max-w-xl rounded-2xl border border-border bg-popover shadow-2xl shadow-black/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar secciones..."
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <kbd className="flex h-5 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-2">
              {filteredItems.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Sin resultados para &quot;{searchQuery}&quot;
                </li>
              ) : (
                filteredItems.map((item) => (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => handleSearchSelect(item.path)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-foreground transition-colors hover:bg-accent"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      {item.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-border px-4 py-2 flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">Navegar</span>
              <div className="flex gap-1">
                <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">↑</kbd>
                <kbd className="flex h-5 items-center rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground">↓</kbd>
              </div>
              <span className="text-[11px] text-muted-foreground">· Enter para abrir</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
