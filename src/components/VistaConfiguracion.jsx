import { useState, useEffect } from 'react'
import { authApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

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

  const inputCls = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors'
  const passInputCls = `${inputCls} pr-10`

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Alertas */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-600">{success}</p>
        </div>
      )}

      {/* Información personal */}
      <section className="relative rounded-xl border border-border bg-card overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <User className="h-4 w-4 text-primary" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground">Información personal</h2>
              <p className="text-[12px] text-muted-foreground">Datos de tu cuenta y tienda</p>
            </div>
          </div>
          <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <input type="email" value={perfil.email} onChange={(e) => setPerfil((p) => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Tu nombre</label>
              <input type="text" value={perfil.nombre} onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))} className={inputCls} placeholder="Nombre" />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Nombre de la tienda</label>
              <input type="text" value={perfil.tenantNombre} onChange={(e) => setPerfil((p) => ({ ...p, tenantNombre: e.target.value }))} className={inputCls} placeholder="Ej. Miracle Solutions" />
            </div>
            <div className="pt-1">
              <button type="submit" disabled={guardandoPerfil} className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-primary/20">
                {guardandoPerfil ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Guardando...
                  </span>
                ) : 'Guardar datos'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Cambiar contraseña */}
      <section className="relative rounded-xl border border-border bg-card overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
              <Lock className="h-4 w-4 text-violet-500" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground">Cambiar contraseña</h2>
              <p className="text-[12px] text-muted-foreground">Mínimo 6 caracteres</p>
            </div>
          </div>
          <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4 mt-5">
            {[
              { key: 'contraseñaActual', label: 'Contraseña actual', show: showPassActual, toggle: setShowPassActual },
              { key: 'nuevaContraseña', label: 'Nueva contraseña', show: showPassNueva, toggle: setShowPassNueva },
              { key: 'repetirNueva', label: 'Repetir nueva contraseña', show: showPassRepetir, toggle: setShowPassRepetir },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password[key]}
                    onChange={(e) => setPassword((p) => ({ ...p, [key]: e.target.value }))}
                    className={passInputCls}
                    placeholder="••••••••"
                    required={key === 'contraseñaActual'}
                    minLength={key !== 'contraseñaActual' ? 6 : undefined}
                  />
                  <button type="button" onClick={() => toggle((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label={show ? 'Ocultar' : 'Ver'}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-1">
              <button type="submit" disabled={guardandoPassword || !password.contraseñaActual || !password.nuevaContraseña || !password.repetirNueva} className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-primary/20">
                {guardandoPassword ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Cambiando...
                  </span>
                ) : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
