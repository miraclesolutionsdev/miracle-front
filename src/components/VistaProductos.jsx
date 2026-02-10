import { useState } from 'react'
import ProductosList from './ProductosList'
import ProductoForm from './ProductoForm'

const PRODUCTOS_INICIALES = [
  {
    id: 'PROD-001',
    clienteId: 'CO-1001',
    clienteNombre: 'Acme Corp',
    nombre: 'Pack Social Media',
    descripcion: 'Gestión mensual de contenidos para redes sociales (Facebook e Instagram).',
    precio: '$1,200',
    tipo: 'servicio',
    landing: 'https://ejemplo.com/pack-social-media',
    vistaTienda: 'https://tienda.ejemplo.com/pack-social-media',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    ],
  },
  {
    id: 'PROD-002',
    clienteId: 'CO-1002',
    clienteNombre: 'Startup XYZ',
    nombre: 'Video Corporativo',
    descripcion: 'Producción de video corporativo de 60 segundos en formato full HD.',
    precio: '$3,500',
    tipo: 'servicio',
    landing: 'https://ejemplo.com/video-corporativo',
    vistaTienda: 'https://tienda.ejemplo.com/video-corporativo',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg',
    ],
  },
  {
    id: 'PROD-003',
    clienteId: 'CO-1003',
    clienteNombre: 'Tienda Digital',
    nombre: 'Campaña Google Ads',
    descripcion: 'Gestión y optimización de campañas de búsqueda en Google Ads.',
    precio: '$800',
    tipo: 'servicio',
    landing: 'https://ejemplo.com/campana-google-ads',
    vistaTienda: 'https://tienda.ejemplo.com/campana-google-ads',
    estado: 'inactivo',
    imagenes: [
      'https://images.pexels.com/photos/6476255/pexels-photo-6476255.jpeg',
    ],
  },
]

function generarId(productos) {
  const nums = productos
    .map((p) => parseInt(p.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `PROD-${String(next).padStart(3, '0')}`
}

export default function VistaProductos() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES)
  const [formAbierto, setFormAbierto] = useState(null)

  const handleCrear = () => setFormAbierto('crear')
  const handleEditar = (producto) => setFormAbierto(producto)
  const cerrarForm = () => setFormAbierto(null)

  const handleGuardarProducto = (payload) => {
    if (payload.id) {
      setProductos((prev) =>
        prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p)),
      )
    } else {
      setProductos((prev) => [
        ...prev,
        {
          ...payload,
          id: generarId(prev),
        },
      ])
    }
    cerrarForm()
  }

  const handleToggleEstado = (producto) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === producto.id
          ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' }
          : p,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <ProductosList
        productos={productos}
        onCrear={handleCrear}
        onEditar={handleEditar}
        onToggleEstado={handleToggleEstado}
      />

      {formAbierto && (
        <ProductoForm
          producto={formAbierto === 'crear' ? null : formAbierto}
          onGuardar={handleGuardarProducto}
          onCancelar={cerrarForm}
        />
      )}
    </div>
  )
}

