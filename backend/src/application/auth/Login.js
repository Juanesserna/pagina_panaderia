import bcrypt from 'bcryptjs'
import { AuthError } from '../../domain/shared/errors.js'

const HASH_FALSO = bcrypt.hashSync('no-existe', 12) // iguala tiempos: no revela si el email existe

export class Login {
  constructor({ usuarioRepository, tokenService }) { Object.assign(this, { usuarioRepository, tokenService }) }
  async execute({ email, password }) {
    const u = await this.usuarioRepository.buscarPorEmail(email)
    const ok = await bcrypt.compare(password, u?.passwordHash ?? HASH_FALSO)
    if (!u || !ok) throw new AuthError('Credenciales inválidas')
    return { token: this.tokenService.firmar(u), usuario: { id: u.id, nombre: u.nombre, rol: u.rol } }
  }
}