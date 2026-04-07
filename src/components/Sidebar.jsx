import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Package, Megaphone,
  Film, BarChart3, ShoppingCart, ShoppingBag, MessageCircle,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '' },
  { label: 'Clientes',       icon: Users,           path: '/clientes' },
  { label: 'Productos',      icon: Package,         path: '/productos' },
  { label: 'Tienda',         icon: ShoppingBag,     path: '/configurar-tienda' },
  { label: 'Campañas',       icon: Megaphone,       path: '/campanas' },
  { label: 'Audiovisual',    icon: Film,            path: '/audiovisual' },
  { label: 'Métricas Ads',   icon: BarChart3,       path: '/metricas-ads' },
  { label: 'Ventas',         icon: ShoppingCart,    path: '/ventas' },
  { label: 'Leads WhatsApp', icon: MessageCircle,   path: '/leads-whatsapp' },
]

function Sidebar({ seleccionado, slug }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-20 flex w-56 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/40">
          Navegación
        </p>
        <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Menu principal">
          {NAV_ITEMS.map((item) => {
            const isActive = seleccionado === item.label
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(`/${slug}/plataforma${item.path}`)}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[22px] rounded-r-full bg-primary" />
                )}
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="px-4 pb-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sidebar-border to-transparent mb-3" />
        <p className="text-[10px] text-sidebar-foreground/30 text-center tracking-widest uppercase font-medium">
          {user?.tenantNombre || 'Plataforma'}
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
