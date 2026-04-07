import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, storeToken, clearToken, getTenantSlug } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Solo restaurar sesión si estamos en una ruta con slug (plataforma, tienda, etc.)
    // En /login o /crear-tienda no hay slug, no intentamos restaurar ninguna sesión.
    if (!getTenantSlug()) {
      setLoading(false)
      return
    }
    authApi.obtenerPerfil()
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    if (data.token) storeToken(data.token, data.user?.tenantSlug)
    setUser(data.user ?? null)
  }

  const logout = async () => {
    clearToken(user?.tenantSlug)
    setUser(null)
    await authApi.logout().catch(() => {})
  }

  const updateUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
