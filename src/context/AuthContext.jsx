import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'miracle_auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        if (data?.token) {
          setToken(data.token)
          setUser(data.user ?? null)
        }
      }
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (data) => {
    const { token: t, user: u } = data
    setToken(t)
    setUser(u ?? null)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const data = JSON.parse(raw)
          if (data?.token) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, user: next }))
        }
      } catch (_) {}
      return next
    })
  }

  const value = { user, token, login, logout, updateUser, loading, isAuthenticated: !!token }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
