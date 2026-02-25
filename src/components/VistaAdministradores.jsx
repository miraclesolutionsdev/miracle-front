import { useState, useEffect } from 'react'
import { usersApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Trash2, UserCheck, UserX, Shield } from 'lucide-react'

export default function VistaAdministradores() {
  const { user } = useAuth()
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', nombre: '' })
  const [guardando, setGuardando] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const cargar = () => {
    setError(null)
    usersApi
      .listar()
      .then((data) => setLista(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.tenantId) {
      setLista([])
      setLoading(false)
      return
    }
    setLoading(true)
    cargar()
  }, [user?.tenantId])

  const handleCrear = (e) => {
    e.preventDefault()
    if (!form.email?.trim() || !form.password) {
      setError('Email y contraseña son obligatorios')
      return
    }
    setGuardando(true)
    setError(null)
    usersApi
      .crear({
        email: form.email.trim(),
        password: form.password,
        nombre: (form.nombre || '').trim(),
      })
      .then(() => {
        setFormAbierto(false)
        setForm({ email: '', password: '', nombre: '' })
        cargar()
      })
      .catch((err) => setError(err.message))
      .finally(() => setGuardando(false))
  }

  const handleActivo = (u) => {
    if (u.isOriginalAdmin) return
    setError(null)
    usersApi
      .actualizar(u.id, { activo: !u.activo })
      .then(() => cargar())
      .catch((err) => setError(err.message))
  }

  const handleEliminar = (u) => {
    if (u.isOriginalAdmin) return
    setConfirmarEliminar(u)
  }

  const confirmarEliminarOk = () => {
    if (!confirmarEliminar) return
    const id = confirmarEliminar.id
    setConfirmarEliminar(null)
    setError(null)
    usersApi
      .eliminar(id)
      .then(() => cargar())
      .catch((err) => setError(err.message))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Cargando administradores…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Administradores de esta tienda. Solo pueden acceder a los datos de <strong>{user?.tenantNombre || 'tu tienda'}</strong>.
        </p>
        <button
          type="button"
          onClick={() => { setFormAbierto(true); setError(null); setForm({ email: '', password: '', nombre: '' }); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Crear administrador
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-foreground">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay administradores. Crea el primero.
                </td>
              </tr>
            ) : (
              lista.map((u) => (
                <tr key={u.id} className="border-b border-border/80 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-foreground">
                    {(u.nombre || '').trim() || '—'}
                    {u.isOriginalAdmin && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-700 dark:text-amber-400">
                        <Shield className="h-3 w-3" /> Original
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.activo ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Activo</span>
                    ) : (
                      <span className="text-muted-foreground">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!u.isOriginalAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleActivo(u)}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
                          title={u.activo ? 'Deshabilitar' : 'Habilitar'}
                        >
                          {u.activo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          {u.activo ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEliminar(u)}
                          className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Crear administrador</h2>
            <form onSubmit={handleCrear} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Nombre (opcional)</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Nombre del admin"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setFormAbierto(false); setError(null); }}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {guardando ? 'Creando…' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <p className="text-sm text-foreground">
              ¿Eliminar a <strong>{confirmarEliminar.email}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmarEliminar(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminarOk}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
