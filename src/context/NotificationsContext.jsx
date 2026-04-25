import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { BASE_URL } from '../utils/api'

const TOKEN_KEY = 'miracle_auth_token'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const esRef = useRef(null)
  const reconnectRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.leida).length

  // ─── Carga inicial desde REST ────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/notificaciones`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch { /* noop */ }
  }, [])

  // ─── SSE ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      esRef.current?.close()
      esRef.current = null
      setNotifications([])
      return
    }

    fetchNotifications()

    function connect() {
      const token = sessionStorage.getItem(TOKEN_KEY)
      const url = `${BASE_URL.replace(/\/$/, '')}/notificaciones/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`

      const es = new EventSource(url, { withCredentials: true })
      esRef.current = es

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data)
          if (payload.evento === 'notificacion') {
            setNotifications((prev) => [payload.data, ...prev].slice(0, 50))
          }
        } catch { /* noop */ }
      }

      es.onerror = () => {
        es.close()
        esRef.current = null
        // Reconectar tras 5 segundos
        reconnectRef.current = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectRef.current)
      esRef.current?.close()
      esRef.current = null
    }
  }, [isAuthenticated, fetchNotifications])

  // ─── Acciones ────────────────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      await fetch(`${BASE_URL.replace(/\/$/, '')}/notificaciones/leer-todas`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
    } catch { /* noop */ }
  }, [])

  const markOneRead = useCallback(async (id) => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY)
      await fetch(`${BASE_URL.replace(/\/$/, '')}/notificaciones/${id}/leer`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
    } catch { /* noop */ }
  }, [])

  // ─── Alerts simples (toast-style) ───────────────────────────────────────────
  const alertSuccess = useCallback((message) => {
    // Simple console log por ahora, se puede mejorar con un toast real
    console.log('[Success]', message)
  }, [])

  const alertError = useCallback((message) => {
    console.error('[Error]', message)
  }, [])

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markOneRead, alertSuccess, alertError }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  return ctx
}
