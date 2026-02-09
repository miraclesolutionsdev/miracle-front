const Section = ({ title, children, className = '' }) => (
  <section className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </section>
)

const productos = [
  { id: 1, nombre: 'Producto A', precio: 29.99, stock: 120 },
  { id: 2, nombre: 'Producto B', precio: 49.50, stock: 85 },
  { id: 3, nombre: 'Producto C', precio: 19.00, stock: 200 },
]

const rendimientoData = [40, 70, 55, 90, 65]

const fracias = [75, 60, 90]

const campañasPorProducto = [
  { producto: 'Producto A', campaña: 'Verano 2024', estado: 'Activa' },
  { producto: 'Producto B', campaña: 'Otoño 2024', estado: 'Pendiente' },
]

const requerimientos = [
  'Brief de marca',
  'Presupuesto aprobado',
  'Creative assets',
  'Segmentación de audiencia',
]

const videosYoutube = ['dQw4w9WgXcQ', 'jNQXAC9IVRw']

const planes = [
  { nombre: 'Básico', precio: '$99/mes', features: ['Hasta 5 campañas', 'Reportes básicos', 'Soporte email'] },
  { nombre: 'Pro', precio: '$249/mes', features: ['Campañas ilimitadas', 'Métricas en tiempo real', 'Soporte prioritario', 'Integración Ads'] },
  { nombre: 'Enterprise', precio: 'Personalizado', features: ['Todo en Pro', 'Gestor dedicado', 'API', 'SLA 99.9%'] },
]

export default function VistaClientes() {
  return (
    <div className="space-y-6">
      <Section title="Productos">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => (
            <div key={p.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="font-medium text-gray-800">{p.nombre}</p>
              <p className="text-sm text-gray-600">${p.precio} · Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rendimiento de campaña">
        <div className="flex items-end gap-2 h-32">
          {rendimientoData.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-indigo-500 rounded-t min-h-[4px] transition-all"
              style={{ height: `${val}%` }}
              title={`${val}%`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Ejemplo de barras (datos ficticios)</p>
      </Section>

      <Section title="Fracias">
        <div className="flex flex-wrap gap-6">
          {fracias.map((pct, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700"
                style={{ background: `conic-gradient(#6366f1 0% ${pct}%, #e5e7eb ${pct}% 100%)` }}
              >
                <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center">{pct}%</span>
              </div>
              <span className="mt-1 text-xs text-gray-500">Meta {i + 1}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Campañas por producto">
          <ul className="space-y-2">
            {campañasPorProducto.map((c, i) => (
              <li key={i} className="flex justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-800">{c.producto} · {c.campaña}</span>
                <span className="text-gray-500">{c.estado}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Requerimientos de campañas">
          <ul className="space-y-2">
            {requerimientos.map((r, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Métricas Ads">
        <div className="grid gap-4 sm:grid-cols-2">
          {videosYoutube.map((id) => (
            <div key={id} className="aspect-video rounded-lg overflow-hidden bg-gray-200">
              <iframe
                title="YouTube"
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${id}`}
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Agentes disponibles">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planes.map((plan, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="font-semibold text-gray-800">{plan.nombre}</p>
              <p className="text-indigo-600 font-medium mt-1">{plan.precio}</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {plan.features.map((f, j) => (
                  <li key={j}>· {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
