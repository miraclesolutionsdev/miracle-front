import Swal from 'sweetalert2'

const base = Swal.mixin({
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (popup) => {
    popup.onmouseenter = Swal.stopTimer
    popup.onmouseleave = Swal.resumeTimer
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
    title: opts.title || '¿Estás seguro?',
    text: opts.text || '',
    ...opts,
  })
