// Catálogos del dominio "ventas" (reglas, no presentación: colores/labels viven en el frontend).
export const ESTADOS = Object.freeze({
  PENDIENTE: 'pendiente',
  PAGO_PARCIAL: 'pago parcial',
  EN_PROCESO: 'en proceso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
})
export const METODOS = Object.freeze({ EFECTIVO: 'efectivo', TARJETA: 'tarjeta', TRANSFERENCIA: 'transferencia' })
export const CANALES = Object.freeze({ PAGINA: 'pagina', ENCARGO: 'encargo', PRESENCIAL: 'presencial' })
