import { Router } from 'express'
import { z } from 'zod'
import { validar } from './validar.js'
import { requireRol } from './auth.middleware.js'

const opt = (s) => z.preprocess((v) => (v === '' ? undefined : v), s.optional())

const ESTADOS_FILTRO = ['ACTIVO', 'INACTIVO', 'AGOTADO'] // AGOTADO solo existe como filtro (se calcula)
const ESTADOS_GUARDADOS = ['ACTIVO', 'INACTIVO']
const TIPOS = ['TERMINADO', 'INTERMEDIO']

const idParam = z.object({
  id: z.coerce.number().int().positive(),
})

const listarQuery = z.object({
  buscar: opt(z.string().trim().max(100)),
  categoria: opt(z.string().trim().max(60)),
  estado: opt(z.enum(ESTADOS_FILTRO)),
  tipo: opt(z.enum(TIPOS)),
  esVendible: opt(z.enum(['true', 'false'])),
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
}).strict()

const imagenUrl = opt(z.string().trim().max(500).refine((u) => /^https?:\/\//.test(u), { message: 'La imagen debe ser http:// o https://' }))

// Una línea de receta: un insumo o un producto Intermedio, con unidad y cantidad
const lineaReceta = z.object({
  origen: z.enum(['INSUMO', 'PRODUCTO']),
  idComponente: z.union([z.string().trim().min(1).max(50), z.number()]),
  nombre: z.string().trim().min(1).max(100),
  cantidad: z.number().positive(),
  unidad: z.string().trim().min(1).max(20),
})

const crearBody = z.object({
  nombre: z.string().trim().min(1).max(100),
  categoria: z.string().trim().min(1).max(60),
  tipo: z.enum(TIPOS).default('TERMINADO'),
  esVendible: z.boolean().default(true),
  precio: z.number().min(0).default(0),
  stock: z.number().int().min(0),
  stockMinimo: z.number().int().min(0).default(0),
  cantMinimaProduccion: z.number().int().min(1).default(1),
  cantMaximaProduccion: z.number().int().min(1).default(100),
  estado: z.enum(ESTADOS_GUARDADOS).default('ACTIVO'),
  receta: z.array(lineaReceta).max(100).default([]),
  imagen: imagenUrl.default(undefined),
}).strict()

const actualizarBody = z.object({
  nombre: opt(z.string().trim().min(1).max(100)),
  categoria: opt(z.string().trim().min(1).max(60)),
  tipo: opt(z.enum(TIPOS)), // se acepta solo para detectar intentos de cambiarlo
  esVendible: opt(z.boolean()),
  precio: opt(z.number().min(0)),
  stock: opt(z.number().int().min(0)), // se ignora: el stock no se edita aquí
  stockMinimo: opt(z.number().int().min(0)),
  cantMinimaProduccion: opt(z.number().int().min(1)),
  cantMaximaProduccion: opt(z.number().int().min(1)),
  estado: opt(z.enum(ESTADOS_GUARDADOS)),
  receta: opt(z.array(lineaReceta).max(100)),
  imagen: imagenUrl,
}).strict()

const cambiarEstadoBody = z.object({
  estado: z.enum(ESTADOS_GUARDADOS),
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