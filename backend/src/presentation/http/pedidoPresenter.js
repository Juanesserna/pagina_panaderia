const pad = (n) => String(n).padStart(2, '0')

export function formatearFecha(date) {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return { fecha: '', hora: '' }
  const dia = pad(d.getDate())
  const mes = pad(d.getMonth() + 1)
  const anio = d.getFullYear()
  const horas = pad(d.getHours())
  const minutos = pad(d.getMinutes())
  return {
    fecha: `${dia}/${mes}/${anio}`,
    hora: `${horas}:${minutos}`,
  }
}

export function presentarPedido(pedido, { detalle = false } = {}) {
  const { fecha, hora } = formatearFecha(pedido.fechaHora)
  const resumen = pedido.resumenFinanciero()

  const base = {
    id: pedido.id,
    usuario: pedido.usuario,
    cliente: pedido.nombreCliente,
    nit: pedido.nit,
    origen: pedido.origen,
    canal: pedido.canal,
    pagoUnico: pedido.pagoUnico,
    productos: pedido.productos,
    total: Number(pedido.total),
    estado: pedido.estado,
    metodo: pedido.metodo,
    fecha,
    hora,
    fechaHora: pedido.fechaHora,
    notas: pedido.notas,
    resumenFinanciero: {
      totalPedido: resumen.totalPedido,
      totalPagado: resumen.totalPagado,
      diferenciaPorPagar: resumen.diferenciaPorPagar,
      cantidadAbonos: resumen.cantidadAbonos,
      porcentajePagado: resumen.porcentajePagado,
      estaPagadoTotalmente: resumen.estaPagadoTotalmente,
      cantidadPagosPermitidos: resumen.cantidadPagosPermitidos,
      montoPorPago: resumen.montoPorPago,
    },
    abonos: (pedido.abonos || []).map((a) => ({
      id: a.id,
      slot: a.slot,
      monto: a.monto,
      fecha: a.fecha,
      urlComprobante: a.urlComprobante,
    })),
  }

  if (detalle) {
    base.items = pedido.items || []
    base.historialEstados = pedido.historialEstados || []
  }

  return base
}

