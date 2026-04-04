import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { registerApi } from '../utils/api'

export default function CrearTienda() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombreTienda: '', email: '', password: '', nombre: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    )
  }
  if (isAuthenticated) return <Navigate to="/plataforma" replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSubmitting(true)
    try {
      const data = await registerApi.registrar({
        nombreTienda: form.nombreTienda.trim(),
        email: form.email.trim(),
        password: form.password,
        nombre: form.nombre.trim() || undefined,
      })
      login(data)
      navigate('/plataforma', { replace: true })
    } catch (err) {
      setError(err.message || 'Error al crear la empresa')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/30 mb-4">
            <Sparkles className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">MIRACLE</h1>
          <p className="text-sm text-muted-foreground mt-1">Advertising Platform</p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-border bg-card shadow-xl shadow-black/5 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Building2 className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              </div>
              <h2 className="text-base font-semibold text-foreground">Crear empresa</h2>
            </div>
            <p className="text-[13px] text-muted-foreground mb-6">
              Registra tu negocio y accede a tu panel de gestión.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                  <p className="text-[13px] text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  autoComplete="organization"
                  value={form.nombreTienda}
                  onChange={set('nombreTienda')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors"
                  placeholder="Ej. Tienda de Zapatos 123"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Tu nombre <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.nombre}
                  onChange={set('nombre')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set('password')}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creando empresa...
                  </span>
                ) : 'Crear mi empresa'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
