import { createContext, useContext, useState } from 'react'

const ProductosContext = createContext(null)

const PRODUCTOS_INICIALES = [
  {
    id: 'PROD-001',
    nombre: 'Pack Social Media',
    descripcion:
      'Gestión mensual de contenidos para Facebook e Instagram, incluye calendario y diseño básico.',
    precio: '$1,200',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    ],
    stock: 14,
  },
  {
    id: 'PROD-002',
    nombre: 'Video Corporativo',
    descripcion:
      'Producción de video corporativo de 60 segundos en formato full HD, guion y edición incluidos.',
    precio: '$3,500',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/6898859/pexels-photo-6898859.jpeg',
    ],
    stock: 5,
  },
  {
    id: 'PROD-003',
    nombre: 'Campaña Google Ads',
    descripcion:
      'Gestión y optimización de campañas de búsqueda y display en Google Ads durante 30 días.',
    precio: '$800',
    tipo: 'servicio',
    estado: 'inactivo',
    imagenes: [
      'https://images.pexels.com/photos/6476255/pexels-photo-6476255.jpeg',
    ],
    stock: 22,
  },
  {
    id: 'PROD-004',
    nombre: 'Diseño de Marca',
    descripcion:
      'Creación de logo, paleta de color y tipografía para tu marca.',
    precio: '$2,000',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/4348403/pexels-photo-4348403.jpeg',
    ],
    stock: 10,
  },
  {
    id: 'PROD-005',
    nombre: 'Landing Page de Captura',
    descripcion:
      'Landing optimizada para captación de leads con formulario y seguimiento de conversiones.',
    precio: '$1,500',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    ],
    stock: 8,
  },
  {
    id: 'PROD-006',
    nombre: 'Pack Fotografía de Producto',
    descripcion:
      'Sesión de fotografía profesional para hasta 15 productos.',
    precio: '$900',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/7561962/pexels-photo-7561962.jpeg',
    ],
    stock: 12,
  },
  {
    id: 'PROD-007',
    nombre: 'Plantilla de Tienda Online',
    descripcion:
      'Plantilla base para e-commerce con diseño responsive lista para personalizar.',
    precio: '$600',
    tipo: 'producto',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg',
    ],
    stock: 40,
  },
  {
    id: 'PROD-008',
    nombre: 'Consultoría Estrategia Digital',
    descripcion:
      'Sesión de 2 horas para definir objetivos, canales y plan de acción digital.',
    precio: '$350',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/3184160/pexels-photo-3184160.jpeg',
    ],
    stock: 25,
  },
  {
    id: 'PROD-009',
    nombre: 'Pack Anuncios Meta Ads',
    descripcion:
      'Diseño y copy de 5 anuncios optimizados para Facebook e Instagram Ads.',
    precio: '$700',
    tipo: 'servicio',
    estado: 'inactivo',
    imagenes: [
      'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    ],
    stock: 9,
  },
  {
    id: 'PROD-010',
    nombre: 'Bundle Contenido Mensual',
    descripcion:
      'Paquete de 20 piezas de contenido entre imágenes, reels cortos y copies.',
    precio: '$1,800',
    tipo: 'servicio',
    estado: 'activo',
    imagenes: [
      'https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg',
    ],
    stock: 18,
  },
]

function generarId(productos) {
  const nums = productos
    .map((p) => parseInt(p.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `PROD-${String(next).padStart(3, '0')}`
}

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES)

  const guardarProducto = (payload) => {
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
  }

  const toggleEstadoProducto = (producto) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === producto.id
          ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' }
          : p,
      ),
    )
  }

  const findProductoById = (id) =>
    productos.find((p) => String(p.id) === String(id)) || null

  return (
    <ProductosContext.Provider
      value={{ productos, guardarProducto, toggleEstadoProducto, findProductoById }}
    >
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  const ctx = useContext(ProductosContext)
  if (!ctx) {
    throw new Error('useProductos debe usarse dentro de ProductosProvider')
  }
  return ctx
}

