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

  const inputCls = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors'
  const passInputCls = `${inputCls} pr-10`
  const labelCls = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground/70'

  const getInitials = (u) => {
    const n = (u.nombre || u.email || '').trim()
    return n.slice(0, 2).toUpperCase() || '??'
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Cargando administradores...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3">
          <Shield className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground">
          Acceso restringido a <span className="font-semibold text-foreground">{user?.tenantNombre || 'tu tienda'}</span>.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="w-52 rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
          />
          <button
            type="button"
            onClick={() => { setFormAbierto(true); setError(null); setForm({ email: '', password: '', nombre: '' }) }}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            <UserPlus className="h-4 w-4" /> Crear administrador
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Usuario</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Email</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {lista.length === 0 ? 'No hay administradores. Creá el primero.' : 'Sin resultados para la búsqueda.'}
                </td>
              </tr>
            ) : (
              listaFiltrada.map((u) => (
                <tr key={u.id} className="border-b border-border/60 hover:bg-muted/25 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                        {getInitials(u)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground truncate">
                          {(u.nombre || '').trim() || '—'}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate sm:hidden">{u.email}</p>
                        {u.isOriginalAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                            <Shield className="h-2.5 w-2.5" /> Original
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.activo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(!u.isOriginalAdmin || user?.isOriginalAdmin) && (
                        <button type="button" onClick={() => handleEditar(u)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted transition-colors" title="Editar">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </button>
                      )}
                      {!u.isOriginalAdmin && (
                        <>
                          <button type="button" onClick={() => handleActivo(u)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-muted transition-colors" title={u.activo ? 'Deshabilitar' : 'Habilitar'}>
                            {u.activo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                            <span className="hidden sm:inline">{u.activo ? 'Deshabilitar' : 'Habilitar'}</span>
                          </button>
                          <button type="button" onClick={() => handleEliminar(u)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-destructive hover:bg-destructive/8 transition-colors" title="Eliminar">
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal crear */}
      {formAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="p-6">
              <h2 className="mb-5 text-base font-bold text-foreground">Crear administrador</h2>
              <form onSubmit={handleCrear} className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="admin@ejemplo.com" required />
                </div>
                <div>
                  <label className={labelCls}>Contraseña</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={passInputCls} placeholder="••••••••" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Nombre <span className="normal-case font-normal">(opcional)</span></label>
                  <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Nombre del admin" />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => { setFormAbierto(false); setError(null) }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</button>
                  <button type="submit" disabled={guardando} className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {guardando ? 'Creando...' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {formEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl max-h-[90vh] overflow-auto">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="p-6">
              <h2 className="mb-5 text-base font-bold text-foreground">Editar administrador</h2>
              <form onSubmit={handleGuardarEditar} className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={formEditarDatos.email} onChange={(e) => setFormEditarDatos((f) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="admin@ejemplo.com" required />
                </div>
                <div>
                  <label className={labelCls}>Nombre <span className="normal-case font-normal">(opcional)</span></label>
                  <input type="text" value={formEditarDatos.nombre} onChange={(e) => setFormEditarDatos((f) => ({ ...f, nombre: e.target.value }))} className={inputCls} placeholder="Nombre del admin" />
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Cambiar contraseña</p>
                    <p className="text-[11px] text-muted-foreground">Dejá en blanco para no modificarla.</p>
                  </div>
                  {[
                    { key: 'contraseñaActual', label: 'Contraseña actual', show: showEditarPassActual, toggle: setShowEditarPassActual },
                    { key: 'nuevaContraseña', label: 'Nueva contraseña', show: showEditarPassNueva, toggle: setShowEditarPassNueva },
                    { key: 'repetirNueva', label: 'Repetir nueva', show: showEditarPassRepetir, toggle: setShowEditarPassRepetir },
                  ].map(({ key, label, show, toggle }) => (
                    <div key={key}>
                      <label className={labelCls}>{label}</label>
                      <div className="relative">
                        <input type={show ? 'text' : 'password'} value={formEditarDatos[key]} onChange={(e) => setFormEditarDatos((f) => ({ ...f, [key]: e.target.value }))} className={passInputCls} placeholder="••••••••" minLength={key !== 'contraseñaActual' ? 6 : undefined} />
                        <button type="button" onClick={() => toggle((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => { setFormEditar(null); setError(null) }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</button>
                  <button type="submit" disabled={guardandoEditar} className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {guardandoEditar ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-destructive/20 bg-card shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent" />
            <div className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
                <Trash2 className="h-5 w-5 text-destructive" strokeWidth={1.8} />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">¿Eliminar administrador?</p>
              <p className="text-[13px] text-muted-foreground mb-5">
                Se eliminará <span className="font-semibold text-foreground">{confirmarEliminar.email}</span>. Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setConfirmarEliminar(null)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancelar</button>
                <button type="button" onClick={confirmarEliminarOk} className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
