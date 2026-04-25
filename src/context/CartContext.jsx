import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTenantSlug, getProductoImagenSrc } from '../utils/api'

const CartContext = createContext(null)

function getCartKey(slug) {
  return `miracle_cart_${slug || 'default'}`
}

function loadCartFromStorage(slug) {
  if (!slug) return { items: [], total: 0, itemCount: 0 }
  try {
    const stored = localStorage.getItem(getCartKey(slug))
    if (!stored) return { items: [], total: 0, itemCount: 0 }
    const parsed = JSON.parse(stored)
    return {
      items: parsed.items || [],
      total: parsed.total || 0,
      itemCount: parsed.itemCount || 0,
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    return { items: [], total: 0, itemCount: 0 }
  }
}

function saveCartToStorage(cart, slug) {
  if (!slug) return
  try {
    localStorage.setItem(getCartKey(slug), JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
}

function calculateItemCount(items) {
  return items.reduce((sum, item) => sum + item.cantidad, 0)
}

export function CartProvider({ children }) {
  const [currentSlug, setCurrentSlug] = useState(getTenantSlug())
  const [cart, setCart] = useState(() => loadCartFromStorage(currentSlug))

  // Detectar cambio de tenant y cargar su carrito
  useEffect(() => {
    const slug = getTenantSlug()
    if (slug !== currentSlug) {
      setCurrentSlug(slug)
      setCart(loadCartFromStorage(slug))
    }
  }, [currentSlug])

  // Persistir en localStorage cuando cambie el carrito
  useEffect(() => {
    saveCartToStorage(cart, currentSlug)
  }, [cart, currentSlug])

  const addToCart = useCallback((producto, cantidad = 1) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.productoId === producto.id)
      let newItems

      if (existingIndex >= 0) {
        // Actualizar cantidad del producto existente
        newItems = [...prev.items]
        const newCantidad = newItems[existingIndex].cantidad + cantidad
        const maxCantidad = producto.tipo === 'producto' ? producto.stock : 999
        newItems[existingIndex].cantidad = Math.min(newCantidad, maxCantidad)
      } else {
        // Agregar nuevo producto
        const maxCantidad = producto.tipo === 'producto' ? producto.stock : 999
        const imagenUrl = getProductoImagenSrc(producto, 0)
        console.log('[CartContext] Agregando producto:', {
          id: producto.id,
          nombre: producto.nombre,
          imagenes: producto.imagenes,
          imagenUrl
        })
        newItems = [
          ...prev.items,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: Math.min(cantidad, maxCantidad),
            imagen: imagenUrl,
            tipo: producto.tipo,
            stock: producto.stock || 0,
            maxCantidad,
          },
        ]
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    })
  }, [])

  const removeFromCart = useCallback((productoId) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.productoId !== productoId)
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    })
  }, [])

  const updateQuantity = useCallback((productoId, cantidad) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.productoId === productoId) {
          const validCantidad = Math.max(1, Math.min(cantidad, item.maxCantidad))
          return { ...item, cantidad: validCantidad }
        }
        return item
      })
      return {
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0, itemCount: 0 })
  }, [])

  const getCartItem = useCallback(
    (productoId) => {
      return cart.items.find((item) => item.productoId === productoId)
    },
    [cart.items]
  )

  const isInCart = useCallback(
    (productoId) => {
      return cart.items.some((item) => item.productoId === productoId)
    },
    [cart.items]
  )

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
