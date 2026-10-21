import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTIF_DURATION } from '../constants/compras.constants'

// Notificaciones (toasts) apiladas que se cierran solas.
// tipo: 'exito' | 'advertencia' | 'error'
export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const timersRef = useRef({})

  useEffect(() => {
    const timers = timersRef.current
    return () => Object.values(timers).forEach(clearTimeout)
  }, [])

  const notificar = useCallback((tipo, titulo, mensaje) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotificaciones((prev) => [...prev, { id, tipo, titulo, mensaje }])
    timersRef.current[id] = setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
      delete timersRef.current[id]
    }, NOTIF_DURATION)
  }, [])

  return { notificaciones, notificar }
}
