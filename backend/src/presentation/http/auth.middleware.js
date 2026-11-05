import { AuthError, ForbiddenError } from '../../domain/shared/errors.js'

export const requireAuth = (tokenService) => (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')
  if (scheme !== 'Bearer' || !token) return next(new AuthError('Token requerido'))
  try {
    const p = tokenService.verificar(token)
    req.usuario = { id: p.sub, nombre: p.nombre, rol: p.rol }
    next()
  } catch (e) {
    next(e.name === 'TokenExpiredError' ? new AuthError('Token expirado', 'TOKEN_EXPIRED') : new AuthError('Token inválido', 'TOKEN_INVALID'))
  }
}

export const requireRol = (...roles) => (req, _res, next) =>
  roles.includes(req.usuario?.rol) ? next() : next(new ForbiddenError())