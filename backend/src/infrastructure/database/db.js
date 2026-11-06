import 'dotenv/config'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

// Asegura cargar el archivo .env ubicado en la raíz de backend/
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config()

export function createPool(connectionString, { production = false } = {}) {
  if (!connectionString) return null
  const pool = new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: production ? { rejectUnauthorized: true } : false,
  })
  pool.on('error', (err) => console.error('[pg pool]', err.message))
  return pool
}

export const pool = process.env.DATABASE_URL
  ? createPool(process.env.DATABASE_URL, { production: process.env.NODE_ENV === 'production' })
  : null

export const query = (text, params) => {
  if (!pool) return Promise.reject(new Error('DATABASE_URL no configurada'))
  return pool.query(text, params)
}

export default pool
