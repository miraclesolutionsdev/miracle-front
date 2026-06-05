import { useState, useEffect } from 'react'
import { authApi, storeConfigApi } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import { TEMPLATE_LIST } from '../../templates'
import {
  Eye, EyeOff, User, Lock, CheckCircle2, AlertCircle,
  Palette, Store, Globe, Phone, Mail, MapPin,
  Instagram, MessageCircle, Facebook, Truck,
} from 'lucide-react'

const inputCls = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors'
const passInputCls = `${inputCls} pr-10`
const labelCls = 'mb-1.5 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide'

function SectionCard({ color = 'primary', icon: Icon, title, subtitle, children }) {
  const gradients = {
    primary: 'via-primary/40',
    violet: 'via-violet-500/30',
    amber: 'via-amber-500/30',
    teal: 'via-teal-500/30',
  }
  const iconBg = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-500',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-500',
  }
  return (
    <section className="relative rounded-xl border border-border bg-card overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${gradients[color]} to-transparent`} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${iconBg[color]}`}>
            <Icon className="h-4 w-4" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-foreground">{title}</h2>
            <p className="text-[12px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

function SaveButton({ loading, label = 'Guardar', loadingLabel = 'Guardando...', disabled = false }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-primary/20"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          {loadingLabel}
        </span>
      ) : label}
    </button>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 rounded-lg border border-border overflow-hidden cursor-pointer">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className="h-full w-full" style={{ backgroundColor: value || '#cccccc' }} />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB"
          maxLength={7}
          className={inputCls}
        />
      </div>
    </div>
  )
}

export default function VistaConfiguracion() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [perfil, setPerfil] = useState({ email: '', nombre: '' })
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  const [password, setPassword] = useState({ contraseñaActual: '', nuevaContraseña: '', repetirNueva: '' })
  const [showPassActual, setShowPassActual] = useState(false)
  const [showPassNueva, setShowPassNueva] = useState(false)
  const [showPassRepetir, setShowPassRepetir] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)

  const [plantillaActual, setPlantillaActual] = useState('luxury')
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('luxury')
  const [guardandoPlantilla, setGuardandoPlantilla] = useState(false)

  const [tienda, setTienda] = useState({
    nombre: '', tagline: '', descripcion: '', logoUrl: '',
    colorPrimario: '', colorSecundario: '', colorTexto: '',
    telefono: '', email: '', direccion: '',
    instagram: '', whatsapp: '', facebook: '', tiktok: '',
    envioGratis: false, montoEnvioGratis: '',
  })
  const [guardandoTienda, setGuardandoTienda] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(null)
    Promise.all([
      authApi.obtenerPerfil(),
      storeConfigApi.obtenerInfo().catch(() => null),
    ])
      .then(([perfilData, infoData]) => {
        if (cancelled) return
        setPerfil({ email: perfilData?.user?.email ?? '', nombre: perfilData?.user?.nombre ?? '' })
        if (infoData) {
          if (infoData.plantilla) {
            setPlantillaActual(infoData.plantilla)
            setPlantillaSeleccionada(infoData.plantilla)
          }
          setTienda({
            nombre:           infoData.nombre || '',
            tagline:          infoData.tagline || '',
            descripcion:      infoData.descripcion || '',
            logoUrl:          infoData.logoUrl || '',
            colorPrimario:    infoData.colorPrimario || '',
            colorSecundario:  infoData.colorSecundario || '',
            colorTexto:       infoData.colorTexto || '',
            telefono:         infoData.telefono || '',
            email:            infoData.email || '',
            direccion:        infoData.direccion || '',
            instagram:        infoData.instagram || '',
            whatsapp:         infoData.whatsapp || '',
            facebook:         infoData.facebook || '',
            tiktok:           infoData.tiktok || '',
            envioGratis:      infoData.envioGratis ?? false,
            montoEnvioGratis: infoData.montoEnvioGratis != null ? String(infoData.montoEnvioGratis) : '',
          })
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(null) }
    else { setSuccess(msg); setError(null) }
  }

  const handleGuardarPerfil = async (e) => {
    e.preventDefault()
    setGuardandoPerfil(true)
    try {
      await authApi.actualizarPerfil({
        email: perfil.email.trim() || undefined,
        nombre: perfil.nombre.trim() || undefined,
      })
      updateUser({ email: perfil.email.trim() || user?.email, nombre: perfil.nombre.trim() || user?.nombre })
      notify('Datos guardados correctamente.')
    } catch (err) {
      notify(err.message || 'No se pudo guardar.', true)
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const handleCambiarPassword = async (e) => {
    e.preventDefault()
    if (password.nuevaContraseña !== password.repetirNueva) return notify('La nueva contraseña y la repetición no coinciden.', true)
    if (password.nuevaContraseña.length < 6) return notify('La nueva contraseña debe tener al menos 6 caracteres.', true)
    setGuardandoPassword(true)
    try {
      await authApi.cambiarPassword(password.contraseñaActual, password.nuevaContraseña)
      notify('Contraseña actualizada correctamente.')
      setPassword({ contraseñaActual: '', nuevaContraseña: '', repetirNueva: '' })
    } catch (err) {
      notify(err.message || 'No se pudo cambiar la contraseña.', true)
    } finally {
      setGuardandoPassword(false)
    }
  }

  const handleGuardarPlantilla = async () => {
    setGuardandoPlantilla(true)
    try {
      await storeConfigApi.guardarPlantilla(plantillaSeleccionada)
      setPlantillaActual(plantillaSeleccionada)
      notify('Plantilla actualizada correctamente.')
    } catch (err) {
      notify(err.message || 'No se pudo guardar la plantilla.', true)
    } finally {
      setGuardandoPlantilla(false)
    }
  }

  const handleGuardarTienda = async (e) => {
    e.preventDefault()
    setGuardandoTienda(true)
    try {
      const body = {
        nombre:           tienda.nombre.trim() || undefined,
        tagline:          tienda.tagline.trim() || undefined,
        descripcion:      tienda.descripcion.trim() || undefined,
        logoUrl:          tienda.logoUrl.trim() || undefined,
        colorPrimario:    tienda.colorPrimario.trim() || undefined,
        colorSecundario:  tienda.colorSecundario.trim() || undefined,
        colorTexto:       tienda.colorTexto.trim() || undefined,
        telefono:         tienda.telefono.trim() || undefined,
        email:            tienda.email.trim() || undefined,
        direccion:        tienda.direccion.trim() || undefined,
        instagram:        tienda.instagram.trim() || undefined,
        whatsapp:         tienda.whatsapp.trim() || undefined,
        facebook:         tienda.facebook.trim() || undefined,
        tiktok:           tienda.tiktok.trim() || undefined,
        envioGratis:      tienda.envioGratis,
        montoEnvioGratis: tienda.montoEnvioGratis ? Number(tienda.montoEnvioGratis) : undefined,
      }
      Object.keys(body).forEach((k) => body[k] === undefined && delete body[k])
      await storeConfigApi.guardarInfo(body)
      notify('Información de tienda guardada correctamente.')
    } catch (err) {
      notify(err.message || 'No se pudo guardar.', true)
    } finally {
      setGuardandoTienda(false)
    }
  }

  const setT = (field) => (val) => setTienda((prev) => ({ ...prev, [field]: val }))
  const setTe = (field) => (e) => setTienda((prev) => ({ ...prev, [field]: e.target.value }))

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
      <SectionCard icon={User} title="Información personal" subtitle="Datos de tu cuenta" color="primary">
        <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={perfil.email} onChange={(e) => setPerfil((p) => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="tu@email.com" required />
          </div>
          <div>
            <label className={labelCls}>Tu nombre</label>
            <input type="text" value={perfil.nombre} onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))} className={inputCls} placeholder="Nombre" />
          </div>
          <div className="pt-1">
            <SaveButton loading={guardandoPerfil} />
          </div>
        </form>
      </SectionCard>

      {/* Cambiar contraseña */}
      <SectionCard icon={Lock} title="Cambiar contraseña" subtitle="Mínimo 6 caracteres" color="violet">
        <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
          {[
            { key: 'contraseñaActual', label: 'Contraseña actual', show: showPassActual, toggle: setShowPassActual },
            { key: 'nuevaContraseña', label: 'Nueva contraseña', show: showPassNueva, toggle: setShowPassNueva },
            { key: 'repetirNueva', label: 'Repetir nueva contraseña', show: showPassRepetir, toggle: setShowPassRepetir },
          ].map(({ key, label, show, toggle }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
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
                <button type="button" onClick={() => toggle((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="pt-1">
            <SaveButton
              loading={guardandoPassword}
              disabled={!password.contraseñaActual || !password.nuevaContraseña || !password.repetirNueva}
              label="Cambiar contraseña"
              loadingLabel="Cambiando..."
            />
          </div>
        </form>
      </SectionCard>

      {/* Personalización de tienda */}
      <SectionCard icon={Store} title="Personalización de tienda" subtitle="Identidad visual y datos públicos de tu tienda" color="teal">
        <form onSubmit={handleGuardarTienda} className="flex flex-col gap-6">

          {/* Identidad */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Identidad</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Nombre de la tienda</label>
                <input type="text" value={tienda.nombre} onChange={setTe('nombre')} className={inputCls} placeholder="Mi tienda increíble" />
              </div>
              <div>
                <label className={labelCls}>Tagline / Slogan</label>
                <input type="text" value={tienda.tagline} onChange={setTe('tagline')} className={inputCls} placeholder="Frase corta que aparece en el hero" maxLength={80} />
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea value={tienda.descripcion} onChange={setTe('descripcion')} className={inputCls} placeholder="Describe tu tienda en 2-3 oraciones" rows={3} maxLength={300} />
              </div>
              <div>
                <label className={labelCls}>URL del logo</label>
                <input type="url" value={tienda.logoUrl} onChange={setTe('logoUrl')} className={inputCls} placeholder="https://..." />
                {tienda.logoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={tienda.logoUrl} alt="Logo" className="h-10 w-auto rounded border border-border object-contain bg-background" onError={(e) => { e.target.style.display = 'none' }} />
                    <span className="text-[11px] text-muted-foreground">Vista previa</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colores */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Palette className="h-3 w-3" /> Colores
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ColorField label="Color primario" value={tienda.colorPrimario} onChange={setT('colorPrimario')} />
              <ColorField label="Color secundario" value={tienda.colorSecundario} onChange={setT('colorSecundario')} />
              <ColorField label="Color de texto" value={tienda.colorTexto} onChange={setT('colorTexto')} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Los templates de tienda usan estos colores para botones, fondos y textos.</p>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Contacto</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono</span></label>
                <input type="text" value={tienda.telefono} onChange={setTe('telefono')} className={inputCls} placeholder="+57 300 000 0000" />
              </div>
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email de contacto</span></label>
                <input type="email" value={tienda.email} onChange={setTe('email')} className={inputCls} placeholder="contacto@tienda.com" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}><span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Dirección</span></label>
                <input type="text" value={tienda.direccion} onChange={setTe('direccion')} className={inputCls} placeholder="Calle 123 # 45-67, Bogotá" />
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Redes sociales</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input type="text" value={tienda.instagram} onChange={setTe('instagram')} className={`${inputCls} pl-7`} placeholder="mitienda" />
                </div>
              </div>
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> WhatsApp</span></label>
                <input type="text" value={tienda.whatsapp} onChange={setTe('whatsapp')} className={inputCls} placeholder="573001234567" />
              </div>
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><Facebook className="h-3 w-3" /> Facebook</span></label>
                <input type="text" value={tienda.facebook} onChange={setTe('facebook')} className={inputCls} placeholder="mitienda" />
              </div>
              <div>
                <label className={labelCls}><span className="flex items-center gap-1"><Globe className="h-3 w-3" /> TikTok</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <input type="text" value={tienda.tiktok} onChange={setTe('tiktok')} className={`${inputCls} pl-7`} placeholder="mitienda" />
                </div>
              </div>
            </div>
          </div>

          {/* Envíos */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Truck className="h-3 w-3" /> Envíos
            </p>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setTienda((prev) => ({ ...prev, envioGratis: !prev.envioGratis }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${tienda.envioGratis ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${tienda.envioGratis ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-foreground">Ofrecer envío gratis</span>
              </label>
              {tienda.envioGratis && (
                <div>
                  <label className={labelCls}>Monto mínimo para envío gratis</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <input type="number" min="0" value={tienda.montoEnvioGratis} onChange={setTe('montoEnvioGratis')} className={`${inputCls} pl-7`} placeholder="50000" />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Deja en 0 o vacío para que siempre sea gratis.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-1">
            <SaveButton loading={guardandoTienda} label="Guardar información de tienda" loadingLabel="Guardando..." />
          </div>
        </form>
      </SectionCard>

      {/* Plantilla de tienda */}
      <SectionCard icon={Palette} title="Plantilla de tienda" subtitle="Elige el diseño visual de tu tienda" color="amber">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_LIST.map((t) => {
            const isSelected = plantillaSeleccionada === t.id
            const isCurrent = plantillaActual === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setPlantillaSeleccionada(t.id)}
                className={`relative text-left rounded-xl border-2 p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-muted-foreground/30 bg-background'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{t.preview}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{t.nombre}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded">Actual</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{t.descripcion}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {plantillaSeleccionada !== plantillaActual && (
          <div className="pt-4">
            <button
              type="button"
              onClick={handleGuardarPlantilla}
              disabled={guardandoPlantilla}
              className="rounded-lg bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-primary/20"
            >
              {guardandoPlantilla ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Guardando...
                </span>
              ) : 'Aplicar plantilla'}
            </button>
          </div>
        )}
      </SectionCard>

    </div>
  )
}
