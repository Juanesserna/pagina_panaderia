// Entidad/agregado Venta. Contiene las reglas de negocio que antes estaban en
// utils/ventasHelpers.js, utils/ventasPagos.js y hooks/useVentas.js del frontend.
import { ESTADOS, METODOS, CANALES } from './constants.js'
import { TransicionInvalidaError, ValidationError } from './errors.js'

export class Venta {
  constructor({ id, usuario, cliente = null, nit, origen, canal, pagoUnico = true, items = [], productos, total, estado = ESTADOS.PENDIENTE, metodo, fechaHora, abonos = [] }) {
    Object.assign(this, { id, usuario, cliente, nit, origen, canal, pagoUnico, items, productos, total, estado, metodo, fechaHora, abonos })
  }

  // Venta presencial registrada a mano (antes: confirmar() en useNuevaVenta).
  static crear({ id, usuario, cliente, nit, items, metodo, pagoDividido = false, fechaHora }) {
    if (!Array.isArray(items) || items.length === 0) throw new ValidationError('La venta debe tener al menos un producto')
    if (!Object.values(METODOS).includes(metodo)) throw new ValidationError('Método de pago inválido')
    for (const i of items) {
      if (!Number.isInteger(i.cantidad) || i.cantidad <= 0) throw new ValidationError(`Cantidad inválida para ${i.nombre}`)
    }
    return new Venta({
      id, usuario, cliente: cliente || 'Cliente no especificado', nit,
      origen: 'manual', canal: CANALES.PRESENCIAL, pagoUnico: !pagoDividido,
      items,
      productos: items.reduce((s, i) => s + i.cantidad, 0),
      total: items.reduce((s, i) => s + i.cantidad * i.precio, 0),
      estado: ESTADOS.PENDIENTE, metodo, fechaHora,
    })
  }

  // ---- Estados ----
  static esTransicionValida(actual, nuevo) {
    if (actual === nuevo) return true
    if (actual === ESTADOS.CANCELADO) return false
    if (actual === ESTADOS.COMPLETADO) return nuevo === ESTADOS.CANCELADO
    return true
  }

  cambiarEstado(nuevo) {
    if (!Object.values(ESTADOS).includes(nuevo)) throw new ValidationError(`Estado inválido: ${nuevo}`)
    if (!Venta.esTransicionValida(this.estado, nuevo)) throw new TransicionInvalidaError(this.estado, nuevo)
    this.estado = nuevo
  }

  // ---- Pagos: 1 comprobante (100%) o 2 (50% c/u) ----
  get pagosPermitidos() { return this.pagoUnico === false ? 2 : 1 }
  get montoPorPago() { return this.total / this.pagosPermitidos }

  registrarAbono({ slot, urlComprobante, fecha = new Date() }) {
    if (!Number.isInteger(slot) || slot < 1 || slot > this.pagosPermitidos) throw new ValidationError('Slot de pago inválido')
    if (!urlComprobante) throw new ValidationError('Falta el comprobante')
    const existente = this.abonos.find((a) => a.slot === slot)
    if (existente) Object.assign(existente, { urlComprobante, fecha })
    else this.abonos.push({ id: `AB-${this.id.replace('#', '')}-${slot}`, idVenta: this.id, slot, fecha, urlComprobante })

    // Mientras quede saldo, la venta queda en "pago parcial" (si la transición es válida)
    if (this.abonos.length < this.pagosPermitidos && Venta.esTransicionValida(this.estado, ESTADOS.PAGO_PARCIAL)) {
      this.estado = ESTADOS.PAGO_PARCIAL
    }
  }

  resumenPagos() {
    const cantidadPagos = this.pagosPermitidos
    const abonados = this.abonos.filter((a) => a.slot <= cantidadPagos).length
    const totalAbonado = abonados * this.montoPorPago
    return {
      cantidadPagos,
      slots: Array.from({ length: cantidadPagos }, (_, i) => i + 1),
      montoPorPago: this.montoPorPago,
      totalAbonado,
      saldoPendiente: Math.max(this.total - totalAbonado, 0),
    }
  }

  // ---- Visibilidad ----
  get puedeVerComprobante() { return this.estado === ESTADOS.COMPLETADO || this.estado === ESTADOS.CANCELADO }
  get nombreCliente() { return this.origen === 'manual' ? (this.cliente?.trim() || 'Cliente no especificado') : this.usuario }
}
