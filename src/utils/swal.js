import Swal from 'sweetalert2'

const base = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

export const swalSuccess = (msg) =>
  base.fire({ icon: 'success', title: msg })

export const swalError = (msg) =>
  base.fire({ icon: 'error', title: msg, timer: 4500 })

export const swalWarning = (msg) =>
  base.fire({ icon: 'warning', title: msg })

export const swalInfo = (msg) =>
  base.fire({ icon: 'info', title: msg })

export const swalConfirm = (opts = {}) =>
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'Sí, continuar',
    cancelButtonText: opts.cancelText || 'Cancelar',
    confirmButtonColor: 'hsl(258 84% 60%)',
    cancelButtonColor: 'hsl(220 12% 48%)',
    title: opts.title || '¿Estás seguro?',
    text: opts.text || '',
    ...opts,
  })
