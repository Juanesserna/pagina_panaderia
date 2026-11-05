import { useCallback, useEffect, useRef, useState } from 'react'

const DURACION_MS = 4000

const defaultTitulos = {
  exito: 'Operación exitosa',
  advertencia: 'Atención',
  error: 'Error en la operación',
  info: 'Información',
}

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([])
  const timersRef = useRef({})

  const mostrarNotificacion = useCallback((tipoOrObj, titulo, mensaje) => {
    let rawTipo = 'exito'
    let rawTitulo = ''
    let rawMensaje = ''

    if (typeof tipoOrObj === 'object' && tipoOrObj !== null) {
      rawTipo = tipoOrObj.tipo || tipoOrObj.severity || 'exito'
      rawTitulo = tipoOrObj.titulo || tipoOrObj.title || ''
      rawMensaje = tipoOrObj.mensaje || tipoOrObj.message || tipoOrObj.texto || ''
    } else if (mensaje === undefined) {
      // Llamado con 2 argumentos: mostrarNotificacion(tipo, mensaje)
      rawTipo = tipoOrObj || 'exito'
      rawTitulo = ''
      rawMensaje = titulo || ''
    } else {
      // Llamado con 3 argumentos: mostrarNotificacion(tipo, titulo, mensaje)
      rawTipo = tipoOrObj || 'exito'
      rawTitulo = titulo || ''
      rawMensaje = mensaje || ''
    }

    const mapaTipo = {
      success: 'exito',
      exito: 'exito',
      warning: 'advertencia',
      advertencia: 'advertencia',
      error: 'error',
      danger: 'error',
      info: 'info',
    }
    const tipo = mapaTipo[rawTipo] || 'exito'

    // Si no se proporcionó título explícito pero sí mensaje, asignar título predeterminado según el tipo
    const finalTitulo = rawTitulo || defaultTitulos[tipo] || 'Notificación'
    const finalMensaje = rawMensaje

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setNotificaciones((prev) => [...prev, { id, tipo, titulo: finalTitulo, mensaje: finalMensaje }])

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
