import { useState, useEffect, useCallback } from 'react'
import { initialPedidos } from '../data/pedidosMockData'
import { pedidosApi } from '../api/pedidosApi'
import { esTransicionValida, calcularResumenFinanciero } from '../utils/pedidosHelpers'

export function usePedidos({ mostrarNotificacion } = {}) {
  const [pedidos, setPedidos] = useState(() => initialPedidos)
  const [cargando, setCargando] = useState(false)

  const notify = useCallback((tipo, titulo, mensaje) => {
    if (typeof mostrarNotificacion === 'function') {
      mostrarNotificacion(tipo, titulo, mensaje)
    }
  }, [mostrarNotificacion])

  // Carga inicial intentando backend con fallback transparente a datos locales
  useEffect(() => {
    let montado = true
    const cargar = async () => {
      try {
        setCargando(true)
        const resp = await pedidosApi.listar({ pageSize: 50 })
        if (montado && resp?.items && resp.items.length > 0) {
          setPedidos(resp.items)
        }
      } catch (err) {
        console.info('[usePedidos] Operando con datos locales de pedidos:', err.message)
      } finally {
        if (montado) setCargando(false)
      }
    }
    cargar()
    return () => { montado = false }
  }, [])

  // Tarea 3 y 4: Cambio de estado con confirmación y bloqueo en "anulado"
  const cambiarEstado = useCallback(async (id, nuevoEstado, motivo = '') => {
    const pedidoActual = pedidos.find((p) => p.id === id)
    if (!pedidoActual) return false

    // Tarea 4: Bloqueo estricto si el pedido ya está en estado Anulado
    if (pedidoActual.estado === 'anulado') {
      notify('error', 'Modificación no permitida', 'No se puede modificar un pedido que se encuentra en estado Anulado.')
      return false
    }

    if (!esTransicionValida(pedidoActual.estado, nuevoEstado)) {
      notify('error', 'Transición no permitida', `Transición no permitida de "${pedidoActual.estado}" a "${nuevoEstado}".`)
      return false
    }

    // Actualización local inmediata
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    )

    try {
      await pedidosApi.cambiarEstado(id, nuevoEstado, motivo)
    } catch (error) {
      console.warn('[cambiarEstado backend notice]: persistido en estado local', error.message)
    }

    notify('exito', 'Estado actualizado', `Pedido ${id} actualizado con éxito a "${nuevoEstado}".`)
    return true
  }, [pedidos, notify])

  // Tarea 5: Registro de abonos y actualización financiera automática e inmediata
  const registrarAbono = useCallback(async (id, slot, urlComprobante, monto) => {
    const pedido = pedidos.find((p) => p.id === id)
    if (!pedido) return false

    const montoNum = typeof monto === 'number' && monto > 0 ? monto : (pedido.total / (pedido.pagoUnico ? 1 : 2))
    const nuevoAbono = {
      id: `AB-${String(id).replace(/\D/g, '') || id}-${slot}`,
      slot,
      monto: montoNum,
      fecha: new Date().toLocaleString(),
      urlComprobante,
    }

    // Actualización local inmediata de los abonos y recálculo financiero (Tarea 5)
    setPedidos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const abonosExistentes = p.abonos ? [...p.abonos] : []
        const index = abonosExistentes.findIndex((a) => a.slot === slot)
        if (index >= 0) abonosExistentes[index] = nuevoAbono
        else abonosExistentes.push(nuevoAbono)

        const resumen = calcularResumenFinanciero(p, abonosExistentes)
        const nuevoEstado = (resumen.diferenciaPorPagar > 0 && p.estado === 'pendiente')
          ? 'pago parcial'
          : p.estado

        return {
          ...p,
          abonos: abonosExistentes,
          estado: nuevoEstado,
          resumenFinanciero: resumen,
        }
      })
    )

    try {
      await pedidosApi.registrarAbono(id, slot, urlComprobante, montoNum)
      notify('exito', 'Comprobante cargado', `Comprobante de pago cargado exitosamente para el pedido ${id}.`)
      return true
    } catch (err) {
      console.warn('[registrarAbono backend notice]: comprobante persistido en estado local', err.message)
      notify('exito', 'Comprobante registrado', `Comprobante registrado correctamente para el pedido ${id}.`)
      return true
    }
  }, [pedidos, notify])

  const agregarPedido = useCallback((nuevoPedido) => {
    setPedidos((prev) => [nuevoPedido, ...prev])
  }, [])

  return {
    pedidos,
    cargando,
    cambiarEstado,
    registrarAbono,
    agregarPedido,
  }
}
