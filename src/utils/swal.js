import Swal from 'sweetalert2'

// Toast ligero — sin backdrop, fluido en mobile
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (popup) => {
    popup.onmouseenter = Swal.stopTimer
    popup.onmouseleave = Swal.resumeTimer
  },
})

// Modal completo — solo para errores y confirmaciones
const modal = Swal.mixin({
  showConfirmButton: false,
  timer: 4500,
  timerProgressBar: true,
})

export const swalSuccess = (msg) => toast.fire({ icon: 'success', title: msg })
export const swalError   = (msg) => modal.fire({ icon: 'error',   title: msg })
export const swalWarning = (msg) => toast.fire({ icon: 'warning', title: msg })
export const swalInfo    = (msg) => toast.fire({ icon: 'info',    title: msg })

export const swalConfirm = (opts = {}) =>
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Sí, continuar',
    cancelButtonText:  opts.cancelText  || 'Cancelar',
    title: opts.title || '¿Estás seguro?',
    text:  opts.text  || '',
    ...opts,
  })
