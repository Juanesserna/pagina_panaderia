import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { buildContainer } from './container.js'
import { authRouter } from '../presentation/http/auth.routes.js'
import { ventasRouter } from '../presentation/http/ventas.routes.js'
import { pedidosRouter } from '../presentation/http/pedidos.routes.js'
import { productosRouter } from '../presentation/http/productos.routes.js'
import { requireAuth } from '../presentation/http/auth.middleware.js'
import { errorHandler } from '../presentation/http/errorHandler.js'
import { pool } from '../infrastructure/database/db.js'

export async function createApp(container) {
  const c = await (container ?? buildContainer())
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: config.CORS_ORIGIN.split(',').map((s) => s.trim()) }))

  // Solo la ruta de comprobantes admite cuerpos grandes (imágenes base64); el resto, 100kb
  app.use('/api/ventas/:id/pagos', express.json({ limit: '3mb' }))
  app.use('/api/pedidos/:id/pagos', express.json({ limit: '3mb' }))
  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (_q, res) => res.json({ status: 'ok' })) // sin detalles internos

  // Endpoint de prueba de conexión a la base de datos PostgreSQL
  app.get('/api/test-db', async (_req, res) => {
    try {
      if (!pool) throw new Error('Pool de PostgreSQL no configurado')
      const result = await pool.query('SELECT NOW()')
      return res.status(200).json({
        success: true,
        message: 'Conexión a la base de datos PostgreSQL exitosa',
        database_time: result.rows[0].now,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al conectar con la base de datos PostgreSQL',
        error: error.message,
      })
    }
  })

  const limiteLogin = rateLimit({ windowMs: 15 * 60_000, limit: 10, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false })
  app.use('/api/auth', limiteLogin, authRouter(c.auth))

  app.use('/api', rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }))
  app.use('/api', requireAuth(c.tokenService)) // todo lo de abajo exige JWT

  app.get('/api/catalogos/clientes', async (_q, res) => res.json(await c.catalogoClientes.listar()))
  app.get('/api/catalogos/productos', async (_q, res) => res.json(await c.catalogoProductos.listar()))
  app.use('/api/ventas', ventasRouter(c.ventas))
  app.use('/api/pedidos', pedidosRouter(c.pedidos))
  app.use('/api/productos', productosRouter(c.productos))

  app.use((_q, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Ruta no encontrada' }))
  app.use(errorHandler)
  return app
}
