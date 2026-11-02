import { ValidationError } from '../../domain/shared/errors.js'

export const validar = (schema, origen = 'body') => (req, _res, next) => {
  const r = schema.safeParse(req[origen])
  if (!r.success) {
    return next(new ValidationError('Datos inválidos', r.error.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message }))))
  }
  req[origen] = r.data
  next()
}