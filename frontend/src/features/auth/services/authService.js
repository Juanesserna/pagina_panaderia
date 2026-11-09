const SESSION_KEY = 'alhorno-session'

export function iniciarSesionSimulada() {
  sessionStorage.setItem(SESSION_KEY, 'authenticated')
  window.dispatchEvent(new Event('alhorno-auth-change'))
}

export function cerrarSesion() {
  sessionStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('alhorno-auth-change'))
}

export function estaAutenticado() {
  return sessionStorage.getItem(SESSION_KEY) === 'authenticated'
}

export function suscribirAuth(callback) {
  window.addEventListener('alhorno-auth-change', callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener('alhorno-auth-change', callback)
    window.removeEventListener('storage', callback)
  }
}
