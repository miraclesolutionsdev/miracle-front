import { getProductoImagenSrc } from '../utils/api'

const MAIN_DOMAIN = import.meta.env.VITE_MAIN_DOMAIN || 'miraclesolutions.com.co'

export function isCustomDomain() {
  const h = window.location.hostname
  return h !== 'localhost' && h !== MAIN_DOMAIN && h !== `www.${MAIN_DOMAIN}`
}

export const fmt = (v) => `$${(Number(v) || 0).toLocaleString('es-CO')}`

export function getInitials(name = '') {
  return String(name).trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'MS'
}

/**
 * Builds the URL to navigate to a product page.
 * On custom domains or root store (no /tienda in path), use /{id}
 * On slug-based stores, use /{slug}/tienda/{id}
 */
export function buildProductUrl(productId, slug) {
  const isRootStore = !window.location.pathname.includes('/tienda')
  if (isCustomDomain() || isRootStore) {
    return `${window.location.origin}/${productId}`
  }
  return `${window.location.origin}/${slug}/tienda/${productId}`
}

export function navigateToProduct(productId, slug) {
  window.open(buildProductUrl(productId, slug), '_blank', 'noopener,noreferrer')
}

export { getProductoImagenSrc }
