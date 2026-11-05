import bcrypt from 'bcryptjs'

export class InMemoryUsuarioRepository {
  constructor(usuarios = []) { this.usuarios = usuarios }
  static async conAdminSemilla({ email, password }) {
    if (!email || !password) return new InMemoryUsuarioRepository()
    const passwordHash = await bcrypt.hash(password, 12)
    return new InMemoryUsuarioRepository([{ id: 1, nombre: 'Administrador', email, passwordHash, rol: 'admin' }])
  }
  async buscarPorEmail(email) { return this.usuarios.find((u) => u.email === email) ?? null }
}