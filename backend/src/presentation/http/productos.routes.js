import { Router } from 'express'
import { z } from 'zod'
import { validar } from './validar.js'
import { requireRol } from './auth.middleware.js'

const opt = (s) => z.preprocess((v) => (v === '' ? undefined : v), s.optional())
const ESTADOS = ['ACTIVO', 'INACTIVO', 'AGOTADO']

const idParam = z.object({
  id: z.coerce.number().int().positive(),
})

const listarQuery = z.object({
  buscar: opt(z.string().trim().max(100)),
  categoria: opt(z.string().trim().max(60)),
  estado: opt(z.enum(ESTADOS)),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
}).strict()

const imagenUrl = opt(z.string().trim().max(500).refine((u) => /^https?:\/\//.test(u), { message: 'La imagen debe ser http:// o https://' }))

const crearBody = z.object({
  nombre: z.string().trim().min(1).max(100),
  categoria: z.string().trim().min(1).max(60),
  precio: z.number().min(0),
  stock: z.number().int().min(0),
  estado: z.enum(ESTADOS).default('ACTIVO'),
  receta: z.array(z.unknown()).max(100).default([]),
  imagen: imagenUrl.default(undefined),
}).strict()

const actualizarBody = z.object({
  nombre: opt(z.string().trim().min(1).max(100)),
  categoria: opt(z.string().trim().min(1).max(60)),
  precio: opt(z.number().min(0)),
  stock: opt(z.number().int().min(0)),
  estado: opt(z.enum(ESTADOS)),
  receta: opt(z.array(z.unknown()).max(100)),
  imagen: imagenUrl,
}).strict()

const cambiarEstadoBody = z.object({
  estado: z.enum(ESTADOS),
}).strict()

export function productosRouter({ crearProducto, listarProductos, actualizarProducto, cambiarEstadoProducto, eliminarProducto }) {
  const r = Router()
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

  r.get('/', validar(listarQuery, 'query'), wrap(async (req, res) => {
    res.json(await listarProductos.execute(req.query))
  }))

  r.post('/', requireRol('admin'), validar(crearBody), wrap(async (req, res) => {
    res.status(201).json(await crearProducto.execute(req.body))
  }))

  r.put('/:id', requireRol('admin'), validar(idParam, 'params'), validar(actualizarBody), wrap(async (req, res) => {
    res.json(await actualizarProducto.execute(req.params.id, req.body))
  }))

  r.patch('/:id/estado', requireRol('admin'), validar(idParam, 'params'), validar(cambiarEstadoBody), wrap(async (req, res) => {
    res.json(await cambiarEstadoProducto.execute(req.params.id, req.body.estado))
  }))

  r.delete('/:id', requireRol('admin'), validar(idParam, 'params'), wrap(async (req, res) => {
    await eliminarProducto.execute(req.params.id)
    res.status(204).send()
  }))

  return r
}
