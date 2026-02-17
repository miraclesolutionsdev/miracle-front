import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'miracle-tienda-estilo'

export const ESTILOS = {
  CLASICO: 'clasico',
  MODERNO: 'moderno',
}

const TiendaEstiloContext = createContext(null)

export function TiendaEstiloProvider({ children }) {
  const [estilo, setEstiloState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === ESTILOS.MODERNO ? ESTILOS.MODERNO : ESTILOS.CLASICO
    } catch {
      return ESTILOS.CLASICO
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, estilo)
    } catch {
      /* ignore */
    }
  }, [estilo])

  const setEstilo = useCallback((value) => {
    setEstiloState(value === ESTILOS.MODERNO ? ESTILOS.MODERNO : ESTILOS.CLASICO)
  }, [])

  return (
    <TiendaEstiloContext.Provider value={{ estilo, setEstilo }}>
      {children}
    </TiendaEstiloContext.Provider>
  )
}

export function useTiendaEstilo() {
  const ctx = useContext(TiendaEstiloContext)
  if (!ctx) throw new Error('useTiendaEstilo debe usarse dentro de TiendaEstiloProvider')
  return ctx
}
