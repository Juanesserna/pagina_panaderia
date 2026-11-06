import jwt from 'jsonwebtoken'

export class JwtTokenService {
  constructor({ secret, expiresIn = '15m', issuer = 'al-horno', audience = 'al-horno-web' }) {
    Object.assign(this, { secret, expiresIn, issuer, audience })
  }
  firmar({ id, nombre, rol }) {
    return jwt.sign({ nombre, rol }, this.secret, {
      algorithm: 'HS256', subject: String(id), expiresIn: this.expiresIn, issuer: this.issuer, audience: this.audience,
    })
  }
  verificar(token) {
    return jwt.verify(token, this.secret, { algorithms: ['HS256'], issuer: this.issuer, audience: this.audience })
  }
}