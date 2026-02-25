import { useState, useEffect } from 'react'
import { authApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function VistaConfiguracion() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [perfil, setPerfil] = useState({
    email: '',
    nombre: '',
    tenantNombre: '',
  })
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  const [password, setPassword] = useState({
    contraseñaActual: '',
    nuevaContraseña: '',
    repetirNueva: '',
  })
  const [showPassActual, setShowPassActual] = useState(false)
  const [showPassNueva, setShowPassNueva] = useState(false)
  const [showPassRepetir, setShowPassRepetir] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(null)
    authApi
      .obtenerPerfil()
      .then((data) => {
        if (cancelled) return
        setPerfil({
          email: data?.user?.email ?? '',
          nombre: data?.user?.nombre ?? '',
          tenantNombre: data?.tenant?.nombre ?? data?.user?.tenantNombre ?? '',
        })
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleGuardarPerfil = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setGuardandoPerfil(true)
    try {
      await authApi.actualizarPerfil({
        email: perfil.email.trim() || undefined,
        nombre: perfil.nombre.trim() || undefined,
      })
      if (perfil.tenantNombre.trim()) {
        await authApi.actualizarTenant(perfil.tenantNombre.trim())
      }
      updateUser({
        email: perfil.email.trim() || user?.email,
        nombre: perfil.nombre.trim() || user?.nombre,
        tenantNombre: perfil.tenantNombre.trim() || user?.tenantNombre,
      })
      setSuccess('Datos guardados correctamente.')
    } catch (err) {
      setError(err.message || 'No se pudo guardar.')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (password.nuevaContraseña !== password.repetirNueva) {
      setError('La nueva contraseña y la repetición no coinciden.')
      return
    }
    if (password.nuevaContraseña.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    setGuardandoPassword(true)
    try {
      await authApi.cambiarPassword(password.contraseñaActual, password.nuevaContraseña)
      setSuccess('Contraseña actualizada correctamente.')
      setPassword({ contraseñaActual: '', nuevaContraseña: '', repetirNueva: '' })
    } catch (err) {
      setError(err.message || 'No se pudo cambiar la contraseña.')
    } finally {
      setGuardandoPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Cargando…
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-400">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Información personal y de la tienda</h2>
        <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={perfil.email}
              onChange={(e) => setPerfil((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Tu nombre</label>
            <input
              type="text"
              value={perfil.nombre}
              onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Nombre de la tienda</label>
            <input
              type="text"
              value={perfil.tenantNombre}
              onChange={(e) => setPerfil((p) => ({ ...p, tenantNombre: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              placeholder="Ej. Miracle Solutions"
            />
          </div>
          <button
            type="submit"
            disabled={guardandoPerfil}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {guardandoPerfil ? 'Guardando…' : 'Guardar datos'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Cambiar contraseña</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Introduce tu contraseña actual y la nueva. Debe tener al menos 6 caracteres.
        </p>
        <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Contraseña actual</label>
            <div className="relative">
              <input
                type={showPassActual ? 'text' : 'password'}
                value={password.contraseñaActual}
                onChange={(e) => setPassword((p) => ({ ...p, contraseñaActual: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassActual((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassActual ? 'Ocultar' : 'Ver'}
              >
                {showPassActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showPassNueva ? 'text' : 'password'}
                value={password.nuevaContraseña}
                onChange={(e) => setPassword((p) => ({ ...p, nuevaContraseña: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassNueva((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassNueva ? 'Ocultar' : 'Ver'}
              >
                {showPassNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Repetir nueva contraseña</label>
            <div className="relative">
              <input
                type={showPassRepetir ? 'text' : 'password'}
                value={password.repetirNueva}
                onChange={(e) => setPassword((p) => ({ ...p, repetirNueva: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassRepetir((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                aria-label={showPassRepetir ? 'Ocultar' : 'Ver'}
              >
                {showPassRepetir ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={guardandoPassword || !password.contraseñaActual || !password.nuevaContraseña || !password.repetirNueva}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {guardandoPassword ? 'Cambiando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </section>
    </div>
  )
}
