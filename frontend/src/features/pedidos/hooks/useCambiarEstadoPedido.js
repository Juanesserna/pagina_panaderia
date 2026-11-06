import { useState } from 'react'

export function useCambiarEstadoPedido(cambiarEstadoFn) {
  const [pedido, setPedido] = useState(null)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null)
  const [pasoConfirmacion, setPasoConfirmacion] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [motivo, setMotivo] = useState('')

  const abrir = (item) => {
    setPedido(item)
    setEstadoSeleccionado(item?.estado ?? null)
    setPasoConfirmacion(false)
    setMotivo('')
  }

  const cerrar = () => {
    setPedido(null)
    setEstadoSeleccionado(null)
    setPasoConfirmacion(false)
    setMotivo('')
  }

  // Paso 1: Solicitar confirmación visual
  const solicitarConfirmacion = () => {
    if (estadoSeleccionado && estadoSeleccionado !== pedido?.estado) {
      setPasoConfirmacion(true)
    }
  }

  const regresarASeleccion = () => {
    setPasoConfirmacion(false)
  }

  // Paso 2: Ejecutar confirmación con manejo de error
  const confirmar = async () => {
    if (!pedido || !estadoSeleccionado || estadoSeleccionado === pedido.estado) return

    setProcesando(true)
    try {
      const exito = await cambiarEstadoFn(pedido.id, estadoSeleccionado, motivo)
      if (exito) {
        cerrar()
      } else {
        // En caso de fallo, se regresa el estado al previo y se cierra confirmación
        setPasoConfirmacion(false)
      }
    } finally {
      setProcesando(false)
    }
  }

  return {
    abierto: Boolean(pedido),
    pedido,
    estadoSeleccionado,
    setEstadoSeleccionado,
    pasoConfirmacion,
    solicitarConfirmacion,
    regresarASeleccion,
    motivo,
    setMotivo,
    procesando,
    abrir,
    cerrar,
    confirmar,
  }
}

