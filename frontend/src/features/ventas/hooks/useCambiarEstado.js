import { useState } from 'react'

// Modal "Cambiar estado" de una venta con validación de seguridad para anulación.
export function useCambiarEstado({ cambiarEstado, mostrarNotificacion } = {}) {
  const [abierto, setAbierto] = useState(false)
  const [venta, setVenta] = useState(null)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
  const [paso, setPaso] = useState('seleccion') // 'seleccion' | 'confirmacion_anulacion'
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState(null)
  const [procesando, setProcesando] = useState(false)

  const abrir = (v) => {
    setVenta(v)
    setEstadoSeleccionado(v.estado)
    setPaso('seleccion')
    setPassword('')
    setErrorPassword(null)
    setProcesando(false)
    setAbierto(true)
  }

  const cerrar = () => {
    setAbierto(false)
    setVenta(null)
    setEstadoSeleccionado(null)
    setPaso('seleccion')
    setPassword('')
    setErrorPassword(null)
    setProcesando(false)
  }

  const regresarASeleccion = () => {
    setPaso('seleccion')
    setPassword('')
    setErrorPassword(null)
  }

  const confirmar = async () => {
    if (!venta || !estadoSeleccionado) return

    // Si seleccionó 'anulado' y aún está en el paso de selección, avanzar a seguridad
    if (estadoSeleccionado === 'anulado' && paso === 'seleccion') {
      setPaso('confirmacion_anulacion')
      return
    }

    // Si está en el paso de confirmación de anulación
    if (estadoSeleccionado === 'anulado' && paso === 'confirmacion_anulacion') {
      if (!password.trim()) {
        setErrorPassword('Ingrese su contraseña de administrador')
        return
      }
      setProcesando(true)
      setErrorPassword(null)
      try {
        const res = await cambiarEstado(venta.id, 'anulado', { password })
        if (!res?.ok) {
          setErrorPassword(res?.error || 'No se pudo anular la venta. Verifique sus credenciales.')
          setProcesando(false)
          return
        }
        if (mostrarNotificacion) {
          mostrarNotificacion('exito', 'Venta anulada', `La venta ${venta.id} fue anulada correctamente`)
        }
        cerrar()
      } catch (err) {
        setErrorPassword(err.message || 'Error al procesar la anulación')
        setProcesando(false)
      }
      return
    }

    // Cambio de estado estándar
    const res = await cambiarEstado(venta.id, estadoSeleccionado)
    if (res?.ok !== false) {
      if (mostrarNotificacion) {
        mostrarNotificacion('exito', 'Estado actualizado', `La venta ${venta.id} ahora está ${estadoSeleccionado}`)
      }
      cerrar()
    } else {
      if (mostrarNotificacion) {
        mostrarNotificacion('error', 'Error al cambiar estado', res?.error || 'Transición inválida')
      }
    }
  }

  return {
    abierto,
    venta,
    estadoSeleccionado,
    setEstadoSeleccionado,
    paso,
    password,
    setPassword,
    errorPassword,
    procesando,
    regresarASeleccion,
    abrir,
    cerrar,
    confirmar,
  }
}
