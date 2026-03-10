import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const LABEL_TO_PATH = {
  'Dashboard': '/',
  'Clientes': '/clientes',
  'Productos': '/productos',
  'Tienda': '/configurar-tienda',
  'Configura tus redes': '/configura-redes',
  'Información del negocio': '/informacion-negocio',
  'Campañas': '/campanas',
  'Audiovisual': '/audiovisual',
  'Métricas Ads': '/metricas-ads',
  'Ventas': '/ventas',
}

function Sidebar({ seleccionado }) {
  const navigate = useNavigate()
  const [configuraAbierto, setConfiguraAbierto] = useState(false)
  const isConfiguraActive = CONFIGURA_SUB.some((s) => s.label === seleccionado)

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-20 flex w-56 flex-col border-r border-sidebar-border bg-sidebar-background">
      {/* Línea decorativa superior */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/40">
          Navegación
        </p>
        <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Menu principal">
          {NAV_ITEMS.map((item) => {
            if (item.sub) {
              const abierto = configuraAbierto || isConfiguraActive
              return (
                <div key={item.label} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setConfiguraAbierto(!abierto)}
                    className={`relative flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                      isConfiguraActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                    }`}
                  >
                    {isConfiguraActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
                    )}
                    <span className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 shrink-0 ${isConfiguraActive ? 'opacity-100' : 'opacity-60'}`} />
                      {item.label}
                    </span>
                    {abierto ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    )}
                  </button>
                  {abierto && (
                    <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                      {item.sub.map((sub) => {
                        const isActive = seleccionado === sub.label
                        return (
                          <button
                            key={sub.label}
                            type="button"
                            onClick={() => navigate(LABEL_TO_PATH[sub.label])}
                            className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-150 ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-primary" />
                            )}
                            <sub.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-55'}`} />
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
                onClick={() => navigate(LABEL_TO_PATH[item.label])}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
                )}
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer del sidebar */}
      <div className="px-4 pb-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-sidebar-border to-transparent mb-3" />
        <p className="text-[10px] text-sidebar-foreground/30 text-center tracking-wide">
          MIRACLE · Advertising Platform
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
