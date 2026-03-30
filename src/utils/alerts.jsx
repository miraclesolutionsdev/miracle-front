import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// ─── Toasts (react-toastify) ─────────────────────────────────────────────────

export const alertSuccess = (message) =>
  toast.success(message, { position: 'top-right', autoClose: 3000 })

export const alertError = (message) =>
  toast.error(message, { position: 'top-right', autoClose: 4000 })

export const alertWarning = (message) =>
  toast.warning(message, { position: 'top-right', autoClose: 3500 })

export const alertInfo = (message) =>
  toast.info(message, { position: 'top-right', autoClose: 3000 })

// ─── Confirmación (SweetAlert2) ──────────────────────────────────────────────

/**
 * alertConfirm({ title, text, confirmText, cancelText, confirmButtonColor })
 * Retorna true si el usuario confirmó, false si canceló.
 */
export const alertConfirm = async (opts = {}) => {
  const result = await MySwal.fire({
    icon: 'warning',
    title: opts.title || '¿Estás seguro?',
    text: opts.text || '',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Sí, continuar',
    cancelButtonText: opts.cancelText || 'Cancelar',
    confirmButtonColor: opts.confirmButtonColor || undefined,
    reverseButtons: true,
    focusCancel: true,
  })
  return result.isConfirmed
}

// ─── Formulario modal (SweetAlert2 + React) ──────────────────────────────────

/**
 * alertForm({ title, fields })
 * fields: [{ name, label, type, placeholder, required, defaultValue }]
 * Retorna un objeto con los valores { [name]: value } o null si canceló.
 */
export const alertForm = async ({ title = 'Formulario', fields = [] } = {}) => {
  const result = await MySwal.fire({
    title,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    focusCancel: true,
    html: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        {fields.map((f) => (
          <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {f.label && (
              <label
                htmlFor={`swal-field-${f.name}`}
                style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
              >
                {f.label}{f.required && ' *'}
              </label>
            )}
            <input
              id={`swal-field-${f.name}`}
              type={f.type || 'text'}
              placeholder={f.placeholder || ''}
              defaultValue={f.defaultValue || ''}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
      </div>
    ),
    preConfirm: () => {
      const values = {}
      let valid = true
      fields.forEach((f) => {
        const el = document.getElementById(`swal-field-${f.name}`)
        const val = el ? el.value.trim() : ''
        if (f.required && !val) {
          MySwal.showValidationMessage(`"${f.label || f.name}" es requerido`)
          valid = false
        }
        values[f.name] = val
      })
      return valid ? values : false
    },
  })
  return result.isConfirmed ? result.value : null
}
