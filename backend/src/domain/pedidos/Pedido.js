import { ESTADOS_PEDIDO, METODOS_PAGO, CANALES_PEDIDO } from './constants.js'
import { TransicionInvalidaError, ValidationError } from '../shared/errors.js'

export class Pedido {
  constructor({
    id,
    usuario,
    cliente = null,
    nit = null,
    origen = 'manual',
    canal = CANALES_PEDIDO.ENCARGO,
    pagoUnico = false,
    items = [],
    productos = 0,
    total = 0,
    estado = ESTADOS_PEDIDO.PENDIENTE,
    metodo = METODOS_PAGO.TRANSFERENCIA,
    fechaHora = new Date(),
    abonos = [],
    historialEstados = [],
    notas = '',
  }) {
    Object.assign(this, {
      id,
      usuario,
      cliente,
      nit,
      origen,
      canal,
      pagoUnico,
      items,
      productos: productos || items.reduce((s, i) => s + (i.cantidad || 0), 0),
      total: total || items.reduce((s, i) => s + (i.cantidad || 0) * (i.precio || 0), 0),
      estado,
      metodo,
      fechaHora,
      abonos,
      historialEstados: historialEstados.length > 0 ? historialEstados : [{
        estado,
        fecha: fechaHora,
        usuario: usuario || 'Sistema',
        motivo: 'Creación del pedido',
      }],
      notas,
    })
  }

  // Creación controlada con estado inicial predeterminado: "pendiente"
  static crear({ id, usuario, cliente, nit, items, metodo = METODOS_PAGO.TRANSFERENCIA, pagoUnico = false, canal = CANALES_PEDIDO.ENCARGO, fechaHora = new Date(), notas = '' }) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('El pedido debe tener al menos un producto')
    }
    if (!Object.values(METODOS_PAGO).includes(metodo)) {
      throw new ValidationError(`Método de pago inválido: ${metodo}`)
    }
    for (const i of items) {
      if (!Number.isInteger(i.cantidad) || i.cantidad <= 0) {
        throw new ValidationError(`Cantidad inválida para el producto: ${i.nombre}`)
      }
    }

    const total = items.reduce((s, i) => s + i.cantidad * i.precio, 0)
    const productos = items.reduce((s, i) => s + i.cantidad, 0)

    return new Pedido({
      id,
      usuario,
      cliente: cliente || 'Cliente general',
      nit: nit || 'NN',
      origen: 'manual',
      canal,
      pagoUnico,
      items,
      productos,
      total,
      estado: ESTADOS_PEDIDO.PENDIENTE, // Estado inicial automático
      metodo,
      fechaHora,
      abonos: [],
      notas,
      historialEstados: [{
        estado: ESTADOS_PEDIDO.PENDIENTE,
        fecha: fechaHora,
        usuario: usuario || 'Sistema',
        motivo: 'Creación inicial del pedido',
      }],
    })
  }

  // ---- Control de transiciones de estado ----
  static esTransicionValida(actual, nuevo) {
    if (actual === nuevo) return true
    // Bloqueo estricto: Una vez anulado, NO se permite ningún cambio de estado
    if (actual === ESTADOS_PEDIDO.ANULADO) return false
    // Si ya fue completado, únicamente puede transicionar a Anulado si hay eventualidad
    if (actual === ESTADOS_PEDIDO.COMPLETADO) return nuevo === ESTADOS_PEDIDO.ANULADO
    return true
  }

  cambiarEstado(nuevo, { usuario = 'Sistema', motivo = '' } = {}) {
    if (!Object.values(ESTADOS_PEDIDO).includes(nuevo)) {
      throw new ValidationError(`Estado inválido: ${nuevo}`)
    }

    if (this.estado === ESTADOS_PEDIDO.ANULADO) {
      throw new TransicionInvalidaError(this.estado, nuevo, 'Un pedido en estado Anulado no permite modificaciones.')
    }

    if (!Pedido.esTransicionValida(this.estado, nuevo)) {
      throw new TransicionInvalidaError(this.estado, nuevo)
    }

    const estadoAnterior = this.estado
    this.estado = nuevo

    // Registro de trazabilidad
    this.historialEstados.push({
      estadoAnterior,
      estado: nuevo,
      fecha: new Date(),
      usuario,
      motivo: motivo || `Transición de ${estadoAnterior} a ${nuevo}`,
    })
  }

  // ---- Gestión de Pagos y Abonos ----
  get pagosPermitidos() {
    return this.pagoUnico ? 1 : 2
  }

  get montoPorPago() {
    return this.pagosPermitidos > 0 ? this.total / this.pagosPermitidos : this.total
  }

  registrarAbono({ slot = 1, urlComprobante, monto, fecha = new Date() }) {
    if (!Number.isInteger(slot) || slot < 1 || slot > this.pagosPermitidos) {
      throw new ValidationError(`Slot de pago inválido. Permitidos: 1 a ${this.pagosPermitidos}`)
    }
    if (!urlComprobante) {
      throw new ValidationError('El comprobante de pago es obligatorio')
    }

    const montoFinal = typeof monto === 'number' && monto > 0 ? monto : this.montoPorPago
    const existenteIndex = this.abonos.findIndex((a) => a.slot === slot)

    const nuevoAbono = {
      id: `AB-${this.id.replace('#', '')}-${slot}`,
      idPedido: this.id,
      slot,
      monto: montoFinal,
      urlComprobante,
      fecha,
    }

    if (existenteIndex >= 0) {
      this.abonos[existenteIndex] = nuevoAbono
    } else {
      this.abonos.push(nuevoAbono)
    }

    // Actualización de estado financiero:
    // Si aún tiene saldo pendiente y está en pendiente, pasa a 'pago parcial'
    const resumen = this.resumenFinanciero()
    if (resumen.diferenciaPorPagar > 0 && this.estado === ESTADOS_PEDIDO.PENDIENTE) {
      this.cambiarEstado(ESTADOS_PEDIDO.PAGO_PARCIAL, { motivo: 'Registro de abono parcial' })
    }
  }

  // Resumen financiero dinámico (Tarea 5)
  resumenFinanciero() {
    const totalPedido = Number(this.total) || 0
    if (!this.abonos || this.abonos.length === 0) {
      return {
        totalPedido,
        totalPagado: 0,
        diferenciaPorPagar: totalPedido,
        cantidadAbonos: 0,
        cantidadPagosPermitidos: this.pagosPermitidos,
        montoPorPago: this.montoPorPago,
        porcentajePagado: 0,
        estaPagadoTotalmente: false,
      }
    }

    const totalPagado = this.abonos.reduce((sum, a) => {
      const val = typeof a.monto === 'number' && a.monto > 0 ? a.monto : this.montoPorPago
      return sum + val
    }, 0)

    const diferenciaPorPagar = Math.max(totalPedido - totalPagado, 0)
    const porcentajePagado = totalPedido > 0 ? Math.min(Math.round((totalPagado / totalPedido) * 100), 100) : 0

    return {
      totalPedido,
      totalPagado,
      diferenciaPorPagar,
      cantidadAbonos: this.abonos.length,
      cantidadPagosPermitidos: this.pagosPermitidos,
      montoPorPago: this.montoPorPago,
      porcentajePagado,
      estaPagadoTotalmente: diferenciaPorPagar <= 0,
    }
  }

  get nombreCliente() {
    return this.origen === 'manual' ? (this.cliente?.trim() || 'Cliente general') : this.usuario
  }

  get puedeVerComprobante() {
    return this.abonos.length > 0
  }
}

