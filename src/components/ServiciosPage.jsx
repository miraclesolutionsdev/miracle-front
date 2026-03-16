import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, Megaphone, BarChart3, Film, ShoppingBag, Users, Zap,
  ArrowRight, CheckCircle2, Star, Play, TrendingUp, Target, Globe,
  Shield, Clock, ChevronDown, MousePointer, LineChart, Layers,
  Cpu, Instagram, Youtube, Facebook, Twitter, Menu, X,
} from 'lucide-react'

/* ─── DATA ─────────────────────────────────────────── */

const SERVICIOS = [
  {
    icon: Megaphone,
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-500/20',
    tag: 'Core',
    titulo: 'Campañas Publicitarias',
    descripcion:
      'Gestiona campañas en múltiples canales desde un único panel. Crea, optimiza y escala tus anuncios con inteligencia de datos en tiempo real.',
    items: [
      'Facebook & Instagram Ads',
      'Google Search y Display',
      'YouTube Pre-roll',
      'TikTok Ads',
      'Segmentación avanzada por audiencia',
      'Optimización automática de presupuesto',
    ],
  },
  {
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
    tag: 'Analytics',
    titulo: 'Métricas & Analítica',
    descripcion:
      'Dashboard en tiempo real con todos tus KPIs. Visualiza el rendimiento de cada campaña, canal y período con gráficas interactivas.',
    items: [
      'Dashboard unificado en tiempo real',
      'Métricas de conversión y retención',
      'Análisis de rendimiento por canal',
      'Comparativas de períodos',
      'Reportes exportables a Excel/PDF',
      'Alertas personalizadas de KPIs',
    ],
  },
  {
    icon: Film,
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/20',
    tag: 'Contenido',
    titulo: 'Producción Audiovisual',
    descripcion:
      'Biblioteca centralizada de piezas audiovisuales. Sube, organiza y distribuye tu contenido multimedia directamente a las campañas activas.',
    items: [
      'Biblioteca multimedia organizada',
      'Gestión de piezas por campaña',
      'Formatos para todas las plataformas',
      'Reels, stories y videos largos',
      'Control de versiones de creativos',
      'Vinculación directa a campañas',
    ],
  },
  {
    icon: ShoppingBag,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    tag: 'Ecommerce',
    titulo: 'Tienda Online',
    descripcion:
      'Tu catálogo de productos conectado a tus campañas. Vende directamente desde la plataforma con tu tienda personalizada y pasarela de pagos integrada.',
    items: [
      'Tienda personalizable con estilos',
      'Catálogo de productos con variantes',
      'Pasarela de pagos integrada',
      'Landing pages de productos',
      'Seguimiento de ventas en tiempo real',
      'Integración con campañas activas',
    ],
  },
  {
    icon: Users,
    gradient: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-500/20',
    tag: 'CRM',
    titulo: 'Gestión de Clientes',
    descripcion:
      'CRM integrado para centralizar tu base de clientes. Historial completo de interacciones, compras y campañas asociadas a cada contacto.',
    items: [
      'Base de clientes centralizada',
      'Historial de compras e interacciones',
      'Segmentación por comportamiento',
      'Notas y seguimiento por cliente',
      'Exportación de datos',
      'Vinculación con campañas',
    ],
  },
  {
    icon: Cpu,
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/20',
    tag: 'IA',
    titulo: 'IA & Automatización',
    descripcion:
      'Inteligencia artificial para generar copy publicitario, resúmenes de rendimiento y recomendaciones de optimización para tus campañas.',
    items: [
      'Generación de copy con IA',
      'Resúmenes automáticos de campañas',
      'Sugerencias de optimización',
      'Análisis predictivo de resultados',
      'Automatización de reportes',
      'Asistente de estrategia publicitaria',
    ],
  },
]

const STATS = [
  { valor: '85%', label: 'Tasa de conversión', icon: TrendingUp, color: 'text-violet-400' },
  { valor: '3x', label: 'Retorno promedio', icon: Target, color: 'text-emerald-400' },
  { valor: '60+', label: 'Marcas activas', icon: Globe, color: 'text-sky-400' },
  { valor: '99.9%', label: 'Uptime garantizado', icon: Shield, color: 'text-pink-400' },
]

const PASOS = [
  {
    num: '01',
    titulo: 'Crea tu cuenta',
    desc: 'Registrá tu empresa en minutos. Sin tarjeta de crédito, sin compromisos. Tu workspace queda listo de inmediato.',
  },
  {
    num: '02',
    titulo: 'Configura tu tienda',
    desc: 'Cargá tu catálogo de productos y personaliza tu tienda online. Conectá tu pasarela de pagos y empezá a vender.',
  },
  {
    num: '03',
    titulo: 'Lanzá tus campañas',
    desc: 'Creá campañas en múltiples plataformas desde un solo lugar. Definí audiencias, presupuesto y creativos publicitarios.',
  },
  {
    num: '04',
    titulo: 'Medí y optimizá',
    desc: 'Seguí el rendimiento en tiempo real desde el dashboard. La IA te sugiere ajustes para maximizar tus resultados.',
  },
]

const FAQS = [
  {
    q: '¿Miracle Solutions es solo para agencias publicitarias?',
    a: 'No. La plataforma está diseñada tanto para agencias como para marcas que gestionan sus propias campañas. Cualquier negocio que quiera centralizar su marketing digital puede usarla.',
  },
  {
    q: '¿Qué plataformas de ads están integradas?',
    a: 'Actualmente soportamos Facebook Ads, Instagram Ads, Google Search, Google Display, YouTube Pre-roll y TikTok Ads. Próximamente se sumarán más integraciones.',
  },
  {
    q: '¿Cómo funciona la pasarela de pagos de la tienda?',
    a: 'La tienda online tiene pasarela de pagos integrada. Cada tenant tiene su propia configuración de métodos de pago, con seguimiento de ventas y estado de transacciones en tiempo real.',
  },
  {
    q: '¿Mis datos están seguros en la plataforma?',
    a: 'Sí. Cada empresa opera en un entorno aislado (multi-tenant). Tus clientes, campañas y datos nunca son visibles para otras organizaciones dentro de la plataforma.',
  },
  {
    q: '¿La IA puede generar copy en español?',
    a: 'Sí, el asistente de IA genera textos publicitarios, resúmenes de campaña y recomendaciones completamente en español, adaptados al tono de tu marca.',
  },
]

const PLATAFORMAS = [
  { icon: Facebook, label: 'Facebook Ads', color: 'text-blue-400' },
  { icon: Instagram, label: 'Instagram', color: 'text-pink-400' },
  { icon: Youtube, label: 'YouTube', color: 'text-red-400' },
  { icon: Twitter, label: 'TikTok', color: 'text-cyan-400' },
  { icon: Globe, label: 'Google Ads', color: 'text-amber-400' },
]

const NAV_LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Plataformas', href: '#plataformas' },
  { label: 'FAQ', href: '#faq' },
]

/* ─── COMPONENTES ───────────────────────────────────── */

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-[13px] sm:text-sm font-semibold text-white/90 leading-snug">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-violet-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 sm:px-6 sm:pb-5">
          <p className="text-[13px] sm:text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────── */

export default function ServiciosPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  /* Bloquear scroll cuando el menú mobile está abierto */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Cerrar menú al hacer resize a desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white overflow-x-hidden">

      {/* ── NAVBAR ────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#08080f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-base tracking-tight">MIRACLE</span>
            <span className="hidden sm:inline text-xs text-white/30 font-medium">Solutions</span>
          </div>

          {/* Nav links — solo desktop */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/40">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-[13px] font-medium text-white/50 hover:text-white transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/crear-tienda')}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 transition-opacity"
            >
              Empezar gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Acciones mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigate('/crear-tienda')}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25"
            >
              Empezar
              <ArrowRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white transition-colors"
              aria-label="Abrir menú"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Menú mobile desplegable */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#08080f]/98 backdrop-blur-xl">
            <nav className="flex flex-col px-4 py-4 gap-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => handleNavClick(l.href)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/6 hover:text-white transition-colors text-left"
                >
                  {l.label}
                </button>
              ))}
              <div className="my-2 h-px bg-white/5" />
              <button
                onClick={() => { setMenuOpen(false); navigate('/login') }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/6 hover:text-white transition-colors text-left"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/crear-tienda') }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white mt-1"
              >
                <Sparkles className="h-4 w-4" />
                Crear cuenta gratis
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-28 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] rounded-full bg-violet-600/10 blur-[100px] sm:blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-indigo-600/8 blur-[60px] sm:blur-[80px]" />
          <div className="absolute top-40 right-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-pink-600/8 blur-[60px] sm:blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative w-full max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 sm:px-4 py-1.5 text-xs font-semibold text-violet-300 mb-6 sm:mb-8">
            <Star className="h-3 w-3 fill-violet-400 text-violet-400 shrink-0" />
            <span>Plataforma todo-en-uno para tu negocio digital</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-5 sm:mb-7">
            Publicidad que
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              convierte de verdad
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/45 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
            Miracle Solutions centraliza tus campañas, clientes, productos y métricas en una sola plataforma.
            Más control, mejores decisiones y resultados medibles desde el primer día.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/crear-tienda')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-2xl shadow-violet-500/30 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              Empezar gratis ahora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Ver plataforma en vivo
            </button>
          </div>

          {/* Plataformas badges */}
          <div className="mt-10 sm:mt-14 flex items-center justify-center gap-2 flex-wrap px-2">
            <span className="text-xs text-white/25 w-full sm:w-auto text-center mb-1 sm:mb-0 sm:mr-1">Integrado con</span>
            {PLATAFORMAS.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40"
              >
                <p.icon className={`h-3 w-3 ${p.color}`} />
                <span className="hidden xs:inline">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`flex justify-center mb-2 ${s.color}`}>
                <s.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{s.valor}</p>
              <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-widest leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────── */}
      <section id="servicios" className="py-16 sm:py-24 md:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-3 sm:mb-4">Servicios</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-5">
              Todo lo que necesita
              <br />
              <span className="text-white/30">tu negocio digital</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
              Una suite completa de módulos interconectados. Cada parte de tu negocio
              trabajando en sincronía desde una sola plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICIOS.map((s) => (
              <div
                key={s.titulo}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-7 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 active:scale-[0.99]"
              >
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                    {s.tag}
                  </span>
                </div>

                <div className={`inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-xl ${s.glow} mb-4 sm:mb-5`}>
                  <s.icon className="h-5 w-5 text-white" strokeWidth={1.8} />
                </div>

                <h3 className="text-[15px] sm:text-base font-bold text-white mb-2">{s.titulo}</h3>
                <p className="text-[12px] sm:text-[13px] text-white/40 leading-relaxed mb-4 sm:mb-5">{s.descripcion}</p>

                <ul className="flex flex-col gap-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[11px] sm:text-[12px] text-white/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────── */}
      <section id="como-funciona" className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 relative">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-600/6 blur-[100px] sm:blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3 sm:mb-4">Proceso</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-5">
              De cero a resultados
              <br />
              <span className="text-white/30">en 4 pasos</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto px-2">
              Configurá tu workspace completo en menos de una hora. Sin necesidad de conocimientos técnicos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {PASOS.map((p) => (
              <div
                key={p.num}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8 hover:border-white/15 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 text-4xl sm:text-5xl font-extrabold text-white/5 leading-none select-none">
                    {p.num}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2">{p.titulo}</h3>
                    <p className="text-[12px] sm:text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHT ────────────────────────── */}
      <section id="plataformas" className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Texto */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3 sm:mb-4">Dashboard</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4 sm:mb-6">
                Todo tu negocio,
                <br />
                <span className="text-white/30">una sola pantalla</span>
              </h2>
              <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8">
                El dashboard de Miracle Solutions unifica en tiempo real el estado de tus
                campañas, tus ventas, tus clientes y tus métricas clave. Tomá decisiones
                basadas en datos, no en suposiciones.
              </p>
              <ul className="flex flex-col gap-3 sm:gap-4">
                {[
                  { icon: LineChart, label: 'Rendimiento de campañas por canal y período' },
                  { icon: MousePointer, label: 'Métricas clave: conversión, retención y satisfacción' },
                  { icon: Layers, label: 'Productos destacados con precio y estado' },
                  { icon: Clock, label: 'Actualizaciones en tiempo real sin recargar' },
                ].map((f) => (
                  <li key={f.label} className="flex items-start gap-3">
                    <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <f.icon className="h-3.5 w-3.5 text-emerald-400" strokeWidth={1.8} />
                    </div>
                    <span className="text-[12px] sm:text-[13px] text-white/60 leading-relaxed">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup */}
            <div className="relative mt-4 md:mt-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/8">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-500/50" />
                    <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="flex-1 h-5 rounded bg-white/5 text-[10px] text-white/20 flex items-center px-2">
                    miracle.app/plataforma
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
                  {[
                    { label: 'Clientes', val: '0', color: 'text-violet-300' },
                    { label: 'Productos', val: '6', color: 'text-indigo-300' },
                    { label: 'Campañas', val: '0', color: 'text-emerald-300' },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl bg-white/4 border border-white/8 p-2 sm:p-3 text-center">
                      <p className={`text-base sm:text-lg font-extrabold ${c.color}`}>{c.val}</p>
                      <p className="text-[9px] sm:text-[10px] text-white/30 mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-white/4 border border-white/8 p-3 sm:p-4 mb-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-white/50 mb-2 sm:mb-3">Rendimiento de campaña</p>
                  {[
                    { label: 'Facebook Ads', pct: 85, color: 'bg-violet-500' },
                    { label: 'Google Search', pct: 72, color: 'bg-indigo-500' },
                    { label: 'Instagram', pct: 64, color: 'bg-pink-500' },
                    { label: 'TikTok Ads', pct: 38, color: 'bg-cyan-500' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="w-16 sm:w-20 text-[9px] sm:text-[10px] text-white/30 shrink-0">{b.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/8">
                        <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-white/40 w-6 sm:w-7 text-right">{b.pct}%</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Conversión', val: '75%', color: 'text-violet-400' },
                    { label: 'Retención', val: '60%', color: 'text-teal-400' },
                    { label: 'Satisfacción', val: '90%', color: 'text-amber-400' },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl bg-white/4 border border-white/8 p-2 sm:p-3 text-center">
                      <p className={`text-sm sm:text-base font-extrabold ${m.color}`}>{m.val}</p>
                      <p className="text-[9px] sm:text-[10px] text-white/30 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-600/15 to-indigo-600/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section id="faq" className="py-16 sm:py-24 md:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400 mb-3 sm:mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 sm:mb-4">Preguntas frecuentes</h2>
            <p className="text-white/40 text-sm">Todo lo que necesitás saber antes de empezar.</p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────── */}
      <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-violet-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-indigo-900/60 to-[#08080f]" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] rounded-full bg-violet-500/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>

            <div className="relative text-center py-12 sm:py-16 md:py-20 px-5 sm:px-8">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40 mx-auto mb-6 sm:mb-7">
                <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" strokeWidth={1.8} />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-5">
                Tu marca merece
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  mejores resultados
                </span>
              </h2>

              <p className="text-white/40 text-sm sm:text-base max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed">
                Unite a las marcas que ya crecen con Miracle Solutions.
                Creá tu cuenta en minutos, sin costo inicial y sin tarjeta de crédito.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/crear-tienda')}
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 sm:px-10 py-3.5 sm:py-4 text-sm font-bold text-white shadow-2xl shadow-violet-500/30 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-4 w-4" />
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-white/40 hover:text-white transition-colors py-2"
                >
                  Ya tengo cuenta →
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-white/20">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Configuración en minutos</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Cancelá cuando quieras</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="pt-12 sm:pt-14 pb-7 sm:pb-8 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 pb-8 sm:pb-10 border-b border-white/5">

            {/* Marca */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white/80">MIRACLE Solutions</span>
              </div>
              <p className="text-[13px] text-white/30 leading-relaxed">
                Plataforma todo-en-uno para gestionar campañas, clientes, productos y métricas de tu negocio digital.
              </p>
            </div>

            {/* Nav rápida */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3 sm:mb-4">Plataforma</p>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {['Servicios', 'Cómo funciona', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s/g, '-').replace('ó', 'o')}`}
                      className="text-[13px] text-white/35 hover:text-white/70 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Acceder a la plataforma →
                  </button>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3 sm:mb-4">Contacto</p>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <a
                    href="mailto:direcciongeneral@miraclesolutions.com.co"
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors break-all"
                  >
                    direcciongeneral@miraclesolutions.com.co
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <span className="text-[13px] text-white/40">Calle 12 39 40</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <span className="text-[13px] text-white/40">Cali — Colombia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                  <a
                    href="tel:+573243524983"
                    className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
                  >
                    324 352 4983
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-center sm:text-left">
            <p className="text-xs text-white/15">
              © {new Date().getFullYear()} Miracle Solutions. Todos los derechos reservados.
            </p>
            <p className="text-xs text-white/10">Cali, Colombia</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
