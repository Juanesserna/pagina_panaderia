// Catálogos del dominio "pedidos"
export const ESTADOS_PEDIDO = Object.freeze({
  PENDIENTE: 'pendiente',
  PAGO_PARCIAL: 'pago parcial',
  EN_PROCESO: 'en proceso',
  COMPLETADO: 'completado',
  ANULADO: 'anulado', // Renombrado de Cancelado a Anulado según requerimiento
})

export const METODOS_PAGO = Object.freeze({
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  TRANSFERENCIA: 'transferencia',
})

export const CANALES_PEDIDO = Object.freeze({
  PAGINA: 'pagina',
  ENCARGO: 'encargo',
  PRESENCIAL: 'presencial',
})

