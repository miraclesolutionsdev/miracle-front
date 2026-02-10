import { LayoutDashboard, Users, Package, Megaphone, Film, BarChart3, ShoppingCart, ShoppingBag, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Clientes', icon: Users },
  { label: 'Productos', icon: Package },
  { label: 'Tienda', icon: ShoppingBag },
  { label: 'Configura Tu Negocio', icon: Settings },
  { label: 'Campañas', icon: Megaphone },
  { label: 'Audiovisual', icon: Film },
  { label: 'Métricas Ads', icon: BarChart3 },
  { label: 'Ventas', icon: ShoppingCart },
]

function Sidebar({ seleccionado, onSeleccionar }) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 z-20 flex w-56 flex-col gap-1 border-r border-sidebar-border bg-sidebar-background p-3">
      <nav className="flex flex-col gap-1" role="navigation" aria-label="Menu principal">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = seleccionado === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSeleccionar(label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
