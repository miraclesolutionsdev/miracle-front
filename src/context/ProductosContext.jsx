import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productosApi } from '../utils/api'

const ProductosContext = createContext(null)

function formatProductoFromApi(p) {
  return {
    ...p,
    precio:
      typeof p.precio === 'number'
        ? `$${p.precio.toLocaleString('es-CO')}`
        : p.precio ?? '',
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
    for (const p of nuevos) {
      const body = {
        nombre: p.nombre || 'Sin nombre',
        descripcion: p.descripcion ?? '',
        precio: p.precio ?? '',
        tipo: p.tipo === 'producto' ? 'producto' : 'servicio',
        estado: p.estado === 'inactivo' ? 'inactivo' : 'activo',
        imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
        stock: p.stock ?? 0,
        usos: Array.isArray(p.usos) ? p.usos : [],
        caracteristicas: Array.isArray(p.caracteristicas) ? p.caracteristicas : [],
      }
      try {
        await productosApi.crear(body)
      } catch (err) {
        // ignorar errores por fila (duplicados, etc.)
        console.error('Error al crear producto importado:', err)
      }
    }
    await loadProductos()
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

