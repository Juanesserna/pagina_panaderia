import { Router } from 'express'
import { z } from 'zod'
import { validar } from './validar.js'
import { requireRol } from './auth.middleware.js'

const opt = (s) => z.preprocess((v) => (v === '' ? undefined : v), s.optional())
const ESTADOS = ['ACTIVO', 'INACTIVO', 'AGOTADO']

const listarQuery = z.object({
  buscar: opt(z.string().trim().max(100)),
  categoria: opt(z.string().trim().max(60)),
  estado: opt(z.enum(ESTADOS)),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
}).strict()

const crearBody = z.object({
  nombre: z.string().trim().min(1).max(100),
  categoria: z.string().trim().min(1).max(60),
  precio: z.number().min(0),
  stock: z.number().int().min(0),
  estado: z.enum(ESTADOS).default('ACTIVO'),
  receta: z.array(z.unknown()).max(100).default([]),
}).strict()

export function productosRouter({ crearProducto, listarProductos }) {
  const r = Router()
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

  r.get('/', validar(listarQuery, 'query'), wrap(async (req, res) => {
    res.json(await listarProductos.execute(req.query))
  }))

  r.post('/', requireRol('admin'), validar(crearBody), wrap(async (req, res) => {
    res.status(201).json(await crearProducto.execute(req.body))
  }))

  return r
}