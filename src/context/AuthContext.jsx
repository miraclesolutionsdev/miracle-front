import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, storeToken, clearToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al montar, verifica si la cookie de sesión sigue vigente
  useEffect(() => {
    authApi.obtenerPerfil()
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = (data) => {
    if (data.token) storeToken(data.token)
    setUser(data.user ?? null)
  }

  const logout = async () => {
    clearToken()
    setUser(null)
    await authApi.logout().catch(() => {})
  }

  const updateUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  const value = { user, login, logout, updateUser, loading, isAuthenticated: !!user }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
