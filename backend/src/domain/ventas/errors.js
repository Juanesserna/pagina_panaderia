export class DomainError extends Error {
  constructor(message, code = 'DOMAIN_ERROR') {
    super(message)
    this.name = this.constructor.name
    this.code = code
  }
}
export class ValidationError extends DomainError {
  constructor(message) { super(message, 'VALIDATION_ERROR') }
}
export class NotFoundError extends DomainError {
  constructor(message) { super(message, 'NOT_FOUND') }
}
export class TransicionInvalidaError extends DomainError {
  constructor(actual, nuevo) { super(`No se puede pasar de "${actual}" a "${nuevo}"`, 'TRANSICION_INVALIDA') }
}
export class SinStockError extends DomainError {
  constructor(nombre) { super(`${nombre} no cuenta con stock disponible`, 'SIN_STOCK') }
}
