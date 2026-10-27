import express from 'express'
import cors from 'cors'
import { buildContainer } from './container.js'
import { ventasRouter } from '../presentation/http/ventas.routes.js'
import { errorHandler } from '../presentation/http/errorHandler.js'
import { usuarioActualStub } from '../infrastructure/catalogos/InMemoryCatalogos.js'

export function createApp(container = buildContainer()) {
  const app = express()
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
  app.use(express.json({ limit: '5mb' }))
  app.use((req, _res, next) => { req.usuario = usuarioActualStub; next() }) // TODO: middleware real de auth

  // Catálogos temporales para el modal "Nueva venta" (migrarán a /api/clientes y /api/productos)
  app.get('/api/catalogos/clientes', async (_q, res) => res.json(await container.catalogoClientes.listar()))
  app.get('/api/catalogos/productos', async (_q, res) => res.json(await container.catalogoProductos.listar()))

  app.use('/api/ventas', ventasRouter(container.ventas))
  app.use(errorHandler)
  return app
}
