import { useCallback, useEffect, useRef, useState } from 'react'

const DURACION_MS = 4000

// tipo: 'exito' | 'advertencia' | 'error'
export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const timersRef = useRef({})

  const mostrarNotificacion = useCallback((tipo, titulo, mensaje) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotificaciones((prev) => [...prev, { id, tipo, titulo, mensaje }])
    timersRef.current[id] = setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
      delete timersRef.current[id]
    }, DURACION_MS)
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      Object.values(timers).forEach(clearTimeout)
    }
  }, [])

  return { notificaciones, mostrarNotificacion }
}
