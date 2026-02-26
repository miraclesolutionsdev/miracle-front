import { useState, useEffect, useMemo } from 'react'
import { usersApi } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Trash2, UserCheck, UserX, Shield, Eye, EyeOff, Pencil } from 'lucide-react'

export default function VistaAdministradores() {
  const { user } = useAuth()
  const [lista, setLista] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formAbierto, setFormAbierto] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', nombre: '' })
  const [guardando, setGuardando] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formEditar, setFormEditar] = useState(null)
  const [formEditarDatos, setFormEditarDatos] = useState({
    email: '',
    nombre: '',
    contraseñaActual: '',
    nuevaContraseña: '',
    repetirNueva: '',
  })
  const [showEditarPassActual, setShowEditarPassActual] = useState(false)
  const [showEditarPassNueva, setShowEditarPassNueva] = useState(false)
  const [showEditarPassRepetir, setShowEditarPassRepetir] = useState(false)
  const [guardandoEditar, setGuardandoEditar] = useState(false)

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

  const handleEditar = (u) => {
    setError(null)
    setFormEditar(u)
    setFormEditarDatos({
      email: u.email ?? '',
      nombre: (u.nombre ?? '').trim(),
      contraseñaActual: '',
      nuevaContraseña: '',
      repetirNueva: '',
    })
  }

  const handleGuardarEditar = async (e) => {
    e.preventDefault()
    if (!formEditar) return
    setError(null)
    if (!formEditarDatos.email?.trim()) {
      setError('El email es obligatorio')
      return
    }
    const body = {
      email: formEditarDatos.email.trim(),
      nombre: formEditarDatos.nombre.trim() || undefined,
    }
    if (formEditarDatos.contraseñaActual || formEditarDatos.nuevaContraseña) {
      if (!formEditarDatos.contraseñaActual || !formEditarDatos.nuevaContraseña) {
        setError('Para cambiar la contraseña indica la actual y la nueva.')
        return
      }
      if (formEditarDatos.nuevaContraseña.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres.')
        return
      }
      if (formEditarDatos.nuevaContraseña !== formEditarDatos.repetirNueva) {
        setError('La nueva contraseña y la repetición no coinciden.')
        return
      }
      body.contraseñaActual = formEditarDatos.contraseñaActual
      body.nuevaContraseña = formEditarDatos.nuevaContraseña
    }
    setGuardandoEditar(true)
    usersApi
      .actualizar(formEditar.id, body)
      .then(() => {
        setFormEditar(null)
        cargar()
      })
      .catch((err) => setError(err.message))
      .finally(() => setGuardandoEditar(false))
  }

  const listaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return lista
    return lista.filter(
      (u) =>
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.nombre ?? '').toLowerCase().includes(q)
    )
  }, [lista, busqueda])

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Administradores de esta tienda. Solo pueden acceder a los datos de <strong>{user?.tenantNombre || 'tu tienda'}</strong>.
        </p>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por email o nombre..."
          className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
        />
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
            {listaFiltrada.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  {lista.length === 0 ? 'No hay administradores. Crea el primero.' : 'No hay resultados para la búsqueda.'}
                </td>
              </tr>
            ) : (
              listaFiltrada.map((u) => (
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
                    <button
                      type="button"
                      onClick={() => handleEditar(u)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                    {!u.isOriginalAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleActivo(u)}
                          className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-muted"
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
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg">
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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

      {formEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-lg max-h-[90vh] overflow-auto">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Editar administrador</h2>
            <form onSubmit={handleGuardarEditar} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={formEditarDatos.email}
                  onChange={(e) => setFormEditarDatos((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="admin@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">Nombre (opcional)</label>
                <input
                  type="text"
                  value={formEditarDatos.nombre}
                  onChange={(e) => setFormEditarDatos((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  placeholder="Nombre del admin"
                />
              </div>
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-sm font-medium text-muted-foreground">Cambiar contraseña (opcional)</p>
                <p className="mb-3 text-xs text-muted-foreground">Indica la contraseña actual de este usuario y la nueva para cambiarla.</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Contraseña actual</label>
                    <div className="relative">
                      <input
                        type={showEditarPassActual ? 'text' : 'password'}
                        value={formEditarDatos.contraseñaActual}
                        onChange={(e) => setFormEditarDatos((f) => ({ ...f, contraseñaActual: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditarPassActual((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label={showEditarPassActual ? 'Ocultar' : 'Ver'}
                      >
                        {showEditarPassActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showEditarPassNueva ? 'text' : 'password'}
                        value={formEditarDatos.nuevaContraseña}
                        onChange={(e) => setFormEditarDatos((f) => ({ ...f, nuevaContraseña: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground text-sm"
                        placeholder="••••••••"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditarPassNueva((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label={showEditarPassNueva ? 'Ocultar' : 'Ver'}
                      >
                        {showEditarPassNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Repetir nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showEditarPassRepetir ? 'text' : 'password'}
                        value={formEditarDatos.repetirNueva}
                        onChange={(e) => setFormEditarDatos((f) => ({ ...f, repetirNueva: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground text-sm"
                        placeholder="••••••••"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditarPassRepetir((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label={showEditarPassRepetir ? 'Ocultar' : 'Ver'}
                      >
                        {showEditarPassRepetir ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setFormEditar(null); setError(null); }}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoEditar}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {guardandoEditar ? 'Guardando…' : 'Guardar'}
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
