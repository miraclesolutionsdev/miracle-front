import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Package,
  Megaphone,
  Film,
  BarChart3,
  ShoppingCart,
  ShoppingBag,
  Settings,
  ChevronDown,
  ChevronRight,
  Wifi,
  Info,
} from 'lucide-react'

const CONFIGURA_SUB = [
  { label: 'Configura tus redes', icon: Wifi },
  { label: 'Información del negocio', icon: Info },
]

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Clientes', icon: Users },
  { label: 'Productos', icon: Package },
  { label: 'Tienda', icon: ShoppingBag },
  { label: 'Configura Tu Negocio', icon: Settings, sub: CONFIGURA_SUB },
  { label: 'Campañas', icon: Megaphone },
  { label: 'Audiovisual', icon: Film },
  { label: 'Métricas Ads', icon: BarChart3 },
  { label: 'Ventas', icon: ShoppingCart },
]

function Sidebar({ seleccionado, onSeleccionar }) {
  const [configuraAbierto, setConfiguraAbierto] = useState(false)
  const isConfiguraActive = CONFIGURA_SUB.some((s) => s.label === seleccionado)

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-20 flex w-56 flex-col gap-1 border-r border-sidebar-border bg-sidebar-background p-3">
      <nav className="flex flex-col gap-1" role="navigation" aria-label="Menu principal">
        {NAV_ITEMS.map((item) => {
          if (item.sub) {
            const abierto = configuraAbierto || isConfiguraActive
            return (
              <div key={item.label} className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => setConfiguraAbierto(!abierto)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isConfiguraActive
                      ? 'bg-sidebar-accent/80 text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </span>
                  {abierto ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </button>
                {abierto && (
                  <div className="ml-4 flex flex-col gap-0.5 border-l border-sidebar-border pl-2">
                    {item.sub.map((sub) => {
                      const isActive = seleccionado === sub.label
                      return (
                        <button
                          key={sub.label}
                          type="button"
                          onClick={() => onSeleccionar(sub.label)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                            isActive
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                          }`}
                        >
                          <sub.icon className="h-3.5 w-3.5 shrink-0" />
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          const isActive = seleccionado === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSeleccionar(item.label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
