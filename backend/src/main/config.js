import 'dotenv/config'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

// Asegura cargar el archivo .env ubicado en la raíz de backend/
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config()

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener 32+ caracteres').default('NVtxwxjHkOOF6lF8AhZ7Ge78snHpxMa1OChLeEgmbk5g6IjvzlA3bkU63_t-Er0f'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  SEED_ADMIN_EMAIL: z.string().email().optional().default('admin@alhorno.local'),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional().default('cambiar_en_local'),
})

export const config = schema.parse(process.env)
