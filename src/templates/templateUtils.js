import { getProductoImagenSrc, isCustomDomain } from '../utils/api'

export { isCustomDomain }

export const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`

export function getInitials(name = '') {
  return String(name).trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'MS'
}

/**
 * Base path for the store. On custom domains the tenant is implicit in the
 * hostname, so all routes are rooted at '/'. On the main domain they live
 * under '/{slug}/tienda'.
 */
export function buildStoreBase(slug) {
  if (isCustomDomain() || !slug) return '/'
  return `/${slug}/tienda`
}

export function buildCartUrl(slug) {
  if (isCustomDomain() || !slug) return '/carrito'
  return `/${slug}/carrito`
}

export function buildProductUrl(productId, slug) {
  const base = buildStoreBase(slug)
  return base === '/' ? `/${productId}` : `${base}/${productId}`
}

export function navigateToProduct(productId, slug) {
  window.location.href = buildProductUrl(productId, slug)
}

export { getProductoImagenSrc }
