import { DomainError } from '../../domain/ventas/errors.js'

const STATUS = { VALIDATION_ERROR: 400, NOT_FOUND: 404, TRANSICION_INVALIDA: 409, SIN_STOCK: 409 }

export function errorHandler(err, _req, res, _next) {
  if (err instanceof DomainError) return res.status(STATUS[err.code] ?? 400).json({ code: err.code, message: err.message })
  console.error(err)
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Error interno' })
}
