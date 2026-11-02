export class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR', details) {
    super(message); this.name = this.constructor.name; this.code = code; this.details = details
  }
}
export class ValidationError extends DomainError { constructor(m, details) { super(m, 'VALIDATION_ERROR', details) } }
export class NotFoundError extends DomainError { constructor(m) { super(m, 'NOT_FOUND') } }
export class TransicionInvalidaError extends DomainError { constructor(a, n) { super(`No se puede pasar de "${a}" a "${n}"`, 'TRANSICION_INVALIDA') } }
export class SinStockError extends DomainError { constructor(n) { super(`${n} no cuenta con stock disponible`, 'SIN_STOCK') } }
export class AuthError extends DomainError { constructor(m = 'No autenticado', code = 'AUTH_ERROR') { super(m, code) } }
export class ForbiddenError extends DomainError { constructor(m = 'Sin permisos') { super(m, 'FORBIDDEN') } }
