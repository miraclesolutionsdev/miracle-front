import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productosApi } from '../utils/api'

const ProductosContext = createContext(null)

function formatProductoFromApi(p) {
  return {
    ...p,
    // Mantener el precio como número crudo; se formatea solo en las vistas
    precio: typeof p.precio === 'number' ? p.precio : Number(String(p.precio || '0').replace(/\D/g, '')) || 0,
  }
}

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([])

  const loadProductos = useCallback(async () => {
    try {
      const data = await productosApi.listar()
      setProductos((data || []).map(formatProductoFromApi))
    } catch (err) {
      console.error('Error al cargar productos:', err)
      setProductos([])
    }
  }, [])

  useEffect(() => {
    loadProductos()
  }, [loadProductos])

  const guardarProducto = async (payload) => {
    if (payload.formData instanceof FormData) {
      if (payload.id) {
        await productosApi.actualizarConArchivos(payload.id, payload.formData)
      } else {
        await productosApi.crearConArchivos(payload.formData)
      }
      await loadProductos()
      return
    }

    const body = {
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? '',
      precio: payload.precio ?? '',
      tipo: payload.tipo ?? 'servicio',
      estado: payload.estado ?? 'activo',
      imagenes: Array.isArray(payload.imagenes) ? payload.imagenes : [],
      stock: payload.stock ?? 0,
      usos: Array.isArray(payload.usos) ? payload.usos : [],
      caracteristicas: Array.isArray(payload.caracteristicas) ? payload.caracteristicas : [],
    }

    if (payload.id) {
      await productosApi.actualizar(payload.id, body)
    } else {
      await productosApi.crear(body)
    }
    await loadProductos()
  }

  const toggleEstadoProducto = async (producto) => {
    const nuevoEstado = producto.estado === 'activo' ? 'inactivo' : 'activo'
    await productosApi.actualizar(producto.id, { estado: nuevoEstado })
    await loadProductos()
  }

  const importarProductos = async (nuevos) => {
    let importadosOk = 0
    let duplicados = 0
    for (const p of nuevos) {
      const body = {
        nombre: (p.nombre || '').trim() || 'Sin nombre',
        descripcion: (p.descripcion ?? '').trim(),
        precio: typeof p.precio === 'number' ? p.precio : parseFloat(String(p.precio || '0').replace(/[^0-9.]/g, '')) || 0,
        tipo: p.tipo === 'producto' ? 'producto' : 'servicio',
        estado: p.estado === 'inactivo' ? 'inactivo' : 'activo',
        imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
        stock: Math.max(0, parseInt(String(p.stock ?? '0').replace(/\D/g, ''), 10) || 0),
        usos: Array.isArray(p.usos) ? p.usos : [],
        caracteristicas: Array.isArray(p.caracteristicas) ? p.caracteristicas : [],
      }
      try {
        await productosApi.crear(body)
        importadosOk += 1
      } catch (err) {
        if (err.message && err.message.includes('Ya existe un producto o servicio con ese nombre')) {
          duplicados += 1
        }
      }
    }
    await loadProductos()
    return { importadosOk, duplicados, total: nuevos.length }
  }

  const findProductoById = (id) =>
    productos.find((p) => String(p.id) === String(id)) || null

  return (
    <ProductosContext.Provider
      value={{ productos, guardarProducto, toggleEstadoProducto, importarProductos, findProductoById }}
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

