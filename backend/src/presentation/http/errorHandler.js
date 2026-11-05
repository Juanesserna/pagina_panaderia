import { DomainError } from '../../domain/shared/errors.js'

const STATUS = {
  VALIDATION_ERROR: 400, AUTH_ERROR: 401, TOKEN_EXPIRED: 401, TOKEN_INVALID: 401,
  FORBIDDEN: 403, NOT_FOUND: 404, TRANSICION_INVALIDA: 409, SIN_STOCK: 409,
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof DomainError) {
    return res.status(STATUS[err.code] ?? 400).json({ code: err.code, message: err.message, ...(err.details && { details: err.details }) })
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ code: 'JSON_INVALIDO', message: 'JSON mal formado' })
  if (err.type === 'entity.too.large') return res.status(413).json({ code: 'PAYLOAD_TOO_LARGE', message: 'Cuerpo demasiado grande' })
  console.error(err)
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Error interno' })
}